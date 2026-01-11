<?php
require "config.php";
session_start();

// Handle preflight OPTIONS request
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    setCorsHeaders($allowed_origins);
    http_response_code(200);
    exit;
}

setCorsHeaders($allowed_origins);

// Check if user is admin (using session)
if (!isset($_SESSION['is_admin']) || !$_SESSION['is_admin']) {
    // Alternative: check localStorage via request header
    if (isset($_SERVER['HTTP_X_USER_DATA'])) {
        $userData = json_decode($_SERVER['HTTP_X_USER_DATA'], true);
        if (!$userData || !$userData['is_admin']) {
            echo json_encode(["success" => false, "message" => "Admin access required"]);
            exit;
        }
    } else {
        echo json_encode(["success" => false, "message" => "Admin access required"]);
        exit;
    }
}

// Sanitize action parameter
$action = sanitizeString($_GET['action'] ?? '');

switch($action) {
    case 'stats':
        // Get total users - no user input, safe query
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users");
        $stmt->execute();
        $result = $stmt->get_result();
        $total_users = $result ? (int)$result->fetch_assoc()['count'] : 0;
        $stmt->close();
        
        // Get new users today
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()");
        $stmt->execute();
        $result = $stmt->get_result();
        $new_users_today = $result ? (int)$result->fetch_assoc()['count'] : 0;
        $stmt->close();
        
        // Get total transactions
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM transactions");
        $stmt->execute();
        $result = $stmt->get_result();
        $total_transactions = $result ? (int)$result->fetch_assoc()['count'] : 0;
        $stmt->close();
        
        // Get total money in system
        $stmt = $conn->prepare("SELECT 
            COALESCE(SUM(wallet_usd), 0) as total_usd,
            COALESCE(SUM(wallet_eur), 0) as total_eur,
            COALESCE(SUM(wallet_gbp), 0) as total_gbp 
            FROM users");
        $stmt->execute();
        $result = $stmt->get_result();
        $money = $result ? $result->fetch_assoc() : ['total_usd' => 0, 'total_eur' => 0, 'total_gbp' => 0];
        $total_money = (float)$money['total_usd'] + ((float)$money['total_eur'] * 1.1) + ((float)$money['total_gbp'] * 1.3);
        $stmt->close();
        
        // Get total money sent
        $stmt = $conn->prepare("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'send'");
        $stmt->execute();
        $result = $stmt->get_result();
        $total_sent = $result ? (float)$result->fetch_assoc()['total'] : 0;
        $stmt->close();
        
        echo json_encode([
            "success" => true,
            "stats" => [
                "total_users" => $total_users,
                "new_users_today" => $new_users_today,
                "total_transactions" => $total_transactions,
                "total_money_in_system" => round($total_money, 2),
                "total_money_sent" => round($total_sent, 2)
            ]
        ]);
        break;
        
    case 'users':
        $stmt = $conn->prepare("SELECT id, username, email, full_name, is_admin, wallet_usd, wallet_eur, wallet_gbp, created_at 
                FROM users ORDER BY created_at DESC");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $users = [];
        while($row = $result->fetch_assoc()) {
            $users[] = [
                "id" => (int)$row["id"],
                "username" => $row["username"],
                "email" => $row["email"],
                "full_name" => $row["full_name"],
                "is_admin" => (bool)$row["is_admin"],
                "wallet_usd" => (float)$row["wallet_usd"],
                "wallet_eur" => (float)$row["wallet_eur"],
                "wallet_gbp" => (float)$row["wallet_gbp"],
                "created_at" => $row["created_at"]
            ];
        }
        $stmt->close();
        
        echo json_encode(["success" => true, "users" => $users]);
        break;
        
    case 'transactions':
        $stmt = $conn->prepare("SELECT t.*, u.username, u.email as user_email 
                FROM transactions t 
                LEFT JOIN users u ON t.user_id = u.id 
                ORDER BY t.created_at DESC 
                LIMIT 50");
        $stmt->execute();
        $result = $stmt->get_result();
        
        $transactions = [];
        while($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }
        $stmt->close();
        
        echo json_encode(["success" => true, "transactions" => $transactions]);
        break;
        
    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>