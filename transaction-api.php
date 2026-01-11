<?php
/**
 * Transaction API - Handle send, receive, convert operations
 */
require "config.php";
session_start();

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    setCorsHeaders($allowed_origins);
    http_response_code(200);
    exit;
}

setCorsHeaders($allowed_origins);

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Authentication required"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = sanitizeString($_GET['action'] ?? '');

// Exchange rates (in production, fetch from API)
function getExchangeRate($from, $to)
{
    // Base rates (USD)
    $rates = [
        'USD' => ['USD' => 1.0, 'EUR' => 0.93, 'GBP' => 0.79, 'MAD' => 10.25],
        'EUR' => ['USD' => 1.08, 'EUR' => 1.0, 'GBP' => 0.85, 'MAD' => 11.05],
        'GBP' => ['USD' => 1.27, 'EUR' => 1.18, 'GBP' => 1.0, 'MAD' => 13.00],
        'MAD' => ['USD' => 0.098, 'EUR' => 0.090, 'GBP' => 0.077, 'MAD' => 1.0]
    ];

    return $rates[$from][$to] ?? 1.0;
}

switch ($action) {
    case 'send':
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            echo json_encode(["success" => false, "message" => "POST method required"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validation = validateInput($data, [
            'recipient' => ['required' => true, 'min_length' => 3],
            'amount' => ['required' => true, 'type' => 'float'],
            'currency' => ['required' => true]
        ]);

        if (!empty($validation)) {
            echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
            exit;
        }

        $recipient_username = sanitizeString($data['recipient']);
        $amount = (float) $data['amount'];
        $currency = strtoupper(sanitizeString($data['currency']));

        // Validate currency
        if (!in_array($currency, ['USD', 'EUR', 'GBP'])) {
            echo json_encode(["success" => false, "message" => "Invalid currency"]);
            exit;
        }

        // Validate amount
        if ($amount <= 0) {
            echo json_encode(["success" => false, "message" => "Amount must be greater than 0"]);
            exit;
        }

        // Check if recipient exists
        $recipient_stmt = $conn->prepare("SELECT id, username, email FROM users WHERE username = ? OR email = ?");
        $recipient_stmt->bind_param("ss", $recipient_username, $recipient_username);
        $recipient_stmt->execute();
        $recipient_result = $recipient_stmt->get_result();

        if ($recipient_result->num_rows === 0) {
            echo json_encode(["success" => false, "message" => "Recipient not found"]);
            $recipient_stmt->close();
            exit;
        }

        $recipient = $recipient_result->fetch_assoc();
        $recipient_id = $recipient['id'];

        // Can't send to yourself
        if ($recipient_id == $user_id) {
            echo json_encode(["success" => false, "message" => "Cannot send money to yourself"]);
            $recipient_stmt->close();
            exit;
        }

        $recipient_stmt->close();

        // Check sender's balance
        $balance_field = "wallet_" . strtolower($currency);
        $check_balance_stmt = $conn->prepare("SELECT $balance_field FROM users WHERE id = ?");
        $check_balance_stmt->bind_param("i", $user_id);
        $check_balance_stmt->execute();
        $balance_result = $check_balance_stmt->get_result();
        $sender = $balance_result->fetch_assoc();
        $sender_balance = (float) $sender[$balance_field];
        $check_balance_stmt->close();

        if ($sender_balance < $amount) {
            echo json_encode(["success" => false, "message" => "Insufficient balance"]);
            exit;
        }

        // Start transaction
        $conn->begin_transaction();

        try {
            // Deduct from sender
            $deduct_stmt = $conn->prepare("UPDATE users SET $balance_field = $balance_field - ? WHERE id = ?");
            $deduct_stmt->bind_param("di", $amount, $user_id);
            $deduct_stmt->execute();
            $deduct_stmt->close();

            // Add to recipient
            $add_stmt = $conn->prepare("UPDATE users SET $balance_field = $balance_field + ? WHERE id = ?");
            $add_stmt->bind_param("di", $amount, $recipient_id);
            $add_stmt->execute();
            $add_stmt->close();

            // Create transaction record for sender
            $trans_stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, currency, recipient_id, recipient_email, description, status) 
                VALUES (?, 'send', ?, ?, ?, ?, ?, 'completed')");
            $description = "Sent to " . $recipient['username'];
            $trans_stmt->bind_param("idssss", $user_id, $amount, $currency, $recipient_id, $recipient['email'], $description);
            $trans_stmt->execute();
            $trans_stmt->close();

            // Create transaction record for recipient
            $trans_stmt2 = $conn->prepare("INSERT INTO transactions (user_id, type, amount, currency, recipient_id, recipient_email, description, status) 
                VALUES (?, 'receive', ?, ?, ?, ?, ?, 'completed')");
            $description2 = "Received from " . $_SESSION['username'];
            $trans_stmt2->bind_param("idssss", $recipient_id, $amount, $currency, $user_id, $_SESSION['email'], $description2);
            $trans_stmt2->execute();
            $trans_stmt2->close();

            // Commit transaction
            $conn->commit();

            // Get updated balances
            $balance_stmt = $conn->prepare("SELECT wallet_usd, wallet_eur, wallet_gbp FROM users WHERE id = ?");
            $balance_stmt->bind_param("i", $user_id);
            $balance_stmt->execute();
            $balance_result = $balance_stmt->get_result();
            $updated_balances = $balance_result->fetch_assoc();
            $balance_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Money sent successfully",
                "balances" => [
                    "wallet_usd" => (float) $updated_balances['wallet_usd'],
                    "wallet_eur" => (float) $updated_balances['wallet_eur'],
                    "wallet_gbp" => (float) $updated_balances['wallet_gbp']
                ]
            ]);

        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Transaction failed: " . $e->getMessage()]);
        }
        break;

    case 'convert':
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            echo json_encode(["success" => false, "message" => "POST method required"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validation = validateInput($data, [
            'from_currency' => ['required' => true],
            'to_currency' => ['required' => true],
            'amount' => ['required' => true, 'type' => 'float']
        ]);

        if (!empty($validation)) {
            echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
            exit;
        }

        $from_currency = strtoupper(sanitizeString($data['from_currency']));
        $to_currency = strtoupper(sanitizeString($data['to_currency']));
        $amount = (float) $data['amount'];

        // Validate currencies
        if (!in_array($from_currency, ['USD', 'EUR', 'GBP']) || !in_array($to_currency, ['USD', 'EUR', 'GBP'])) {
            echo json_encode(["success" => false, "message" => "Invalid currency"]);
            exit;
        }

        if ($from_currency === $to_currency) {
            echo json_encode(["success" => false, "message" => "Cannot convert to same currency"]);
            exit;
        }

        if ($amount <= 0) {
            echo json_encode(["success" => false, "message" => "Amount must be greater than 0"]);
            exit;
        }

        // Get exchange rate
        $rate = getExchangeRate($from_currency, $to_currency);
        $converted_amount = $amount * $rate;

        // Check balance
        $from_field = "wallet_" . strtolower($from_currency);
        $to_field = "wallet_" . strtolower($to_currency);

        $check_balance_stmt = $conn->prepare("SELECT $from_field FROM users WHERE id = ?");
        $check_balance_stmt->bind_param("i", $user_id);
        $check_balance_stmt->execute();
        $balance_result = $check_balance_stmt->get_result();
        $user = $balance_result->fetch_assoc();
        $balance = (float) $user[$from_field];
        $check_balance_stmt->close();

        if ($balance < $amount) {
            echo json_encode(["success" => false, "message" => "Insufficient balance"]);
            exit;
        }

        // Start transaction
        $conn->begin_transaction();

        try {
            // Deduct from source currency
            $deduct_stmt = $conn->prepare("UPDATE users SET $from_field = $from_field - ? WHERE id = ?");
            $deduct_stmt->bind_param("di", $amount, $user_id);
            $deduct_stmt->execute();
            $deduct_stmt->close();

            // Add to target currency
            $add_stmt = $conn->prepare("UPDATE users SET $to_field = $to_field + ? WHERE id = ?");
            $add_stmt->bind_param("di", $converted_amount, $user_id);
            $add_stmt->execute();
            $add_stmt->close();

            // Create transaction record
            $trans_stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, currency, description, status) 
                VALUES (?, 'convert', ?, ?, ?, 'completed')");
            $description = "Converted $amount $from_currency to " . number_format($converted_amount, 2) . " $to_currency (Rate: $rate)";
            $trans_stmt->bind_param("idss", $user_id, $amount, $from_currency, $description);
            $trans_stmt->execute();
            $trans_stmt->close();

            $conn->commit();

            // Get updated balances
            $balance_stmt = $conn->prepare("SELECT wallet_usd, wallet_eur, wallet_gbp FROM users WHERE id = ?");
            $balance_stmt->bind_param("i", $user_id);
            $balance_stmt->execute();
            $balance_result = $balance_stmt->get_result();
            $updated_balances = $balance_result->fetch_assoc();
            $balance_stmt->close();

            echo json_encode([
                "success" => true,
                "message" => "Currency converted successfully",
                "converted_amount" => round($converted_amount, 2),
                "rate" => $rate,
                "balances" => [
                    "wallet_usd" => (float) $updated_balances['wallet_usd'],
                    "wallet_eur" => (float) $updated_balances['wallet_eur'],
                    "wallet_gbp" => (float) $updated_balances['wallet_gbp']
                ]
            ]);

        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(["success" => false, "message" => "Conversion failed: " . $e->getMessage()]);
        }
        break;

    case 'rates':
        // Get current exchange rates
        $rates = [
            'USD' => ['EUR' => getExchangeRate('USD', 'EUR'), 'GBP' => getExchangeRate('USD', 'GBP'), 'MAD' => getExchangeRate('USD', 'MAD')],
            'EUR' => ['USD' => getExchangeRate('EUR', 'USD'), 'GBP' => getExchangeRate('EUR', 'GBP'), 'MAD' => getExchangeRate('EUR', 'MAD')],
            'GBP' => ['USD' => getExchangeRate('GBP', 'USD'), 'EUR' => getExchangeRate('GBP', 'EUR'), 'MAD' => getExchangeRate('GBP', 'MAD')],
            'MAD' => ['USD' => getExchangeRate('MAD', 'USD'), 'EUR' => getExchangeRate('MAD', 'EUR'), 'GBP' => getExchangeRate('MAD', 'GBP')]
        ];

        echo json_encode([
            "success" => true,
            "rates" => $rates,
            "timestamp" => time()
        ]);
        break;

    case 'history':
        // Get user's transaction history
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 50;
        $limit = min($limit, 100); // Max 100

        $stmt = $conn->prepare("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT ?");
        $stmt->bind_param("ii", $user_id, $limit);
        $stmt->execute();
        $result = $stmt->get_result();

        $transactions = [];
        while ($row = $result->fetch_assoc()) {
            $transactions[] = [
                "id" => (int) $row["id"],
                "type" => $row["type"],
                "amount" => (float) $row["amount"],
                "currency" => $row["currency"],
                "description" => $row["description"],
                "status" => $row["status"],
                "created_at" => $row["created_at"],
                "recipient_email" => $row["recipient_email"] ?? null
            ];
        }
        $stmt->close();

        echo json_encode(["success" => true, "transactions" => $transactions]);
        break;

    case 'balance':
        // Get user's current balances
        $stmt = $conn->prepare("SELECT wallet_usd, wallet_eur, wallet_gbp FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        echo json_encode([
            "success" => true,
            "balances" => [
                "wallet_usd" => (float) $user['wallet_usd'],
                "wallet_eur" => (float) $user['wallet_eur'],
                "wallet_gbp" => (float) $user['wallet_gbp']
            ]
        ]);
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>