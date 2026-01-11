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

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Authentication required"]);
    exit;
}

$user_id = $_SESSION['user_id'];
$action = sanitizeString($_GET['action'] ?? '');

switch ($action) {
    case 'get_profile':
        if ($_SERVER["REQUEST_METHOD"] != "GET") {
            echo json_encode(["success" => false, "message" => "GET method required"]);
            exit;
        }

        // Fetch user data
        $stmt = $conn->prepare("SELECT id, full_name, email, username, wallet_usd, wallet_eur, wallet_gbp FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            echo json_encode([
                "success" => true,
                "user" => [
                    "id" => $user['id'],
                    "fullName" => $user['full_name'],
                    "email" => $user['email'],
                    "username" => $user['username'],
                    "wallet_usd" => floatval($user['wallet_usd']),
                    "wallet_eur" => floatval($user['wallet_eur']),
                    "wallet_gbp" => floatval($user['wallet_gbp'])
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "User not found"]);
        }
        $stmt->close();
        break;

    case 'update_profile':
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            echo json_encode(["success" => false, "message" => "POST method required"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        // Validate input
        $validation = validateInput($data, [
            'full_name' => ['required' => true, 'min_length' => 3],
            'email' => ['required' => true, 'email' => true]
        ]);

        if (!empty($validation)) {
            echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
            exit;
        }

        $full_name = sanitizeString($data['full_name']);
        $email = sanitizeString($data['email']);

        // Check if email is taken by another user
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
        $stmt->bind_param("si", $email, $user_id);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "Email already in use"]);
            $stmt->close();
            exit;
        }
        $stmt->close();

        // Update user
        $stmt = $conn->prepare("UPDATE users SET full_name = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $full_name, $email, $user_id);

        if ($stmt->execute()) {
            // Update session
            $_SESSION['email'] = $email;
            $_SESSION['full_name'] = $full_name;

            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully",
                "user" => [
                    "full_name" => $full_name,
                    "email" => $email
                ]
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed: " . $conn->error]);
        }
        $stmt->close();
        break;

    case 'update_password':
        if ($_SERVER["REQUEST_METHOD"] != "POST") {
            echo json_encode(["success" => false, "message" => "POST method required"]);
            exit;
        }

        $data = json_decode(file_get_contents("php://input"), true);

        $current_password = $data['current_password'] ?? '';
        $new_password = $data['new_password'] ?? '';

        if (empty($current_password) || empty($new_password)) {
            echo json_encode(["success" => false, "message" => "All fields are required"]);
            exit;
        }

        // Verify current password
        $stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();

        if (!password_verify($current_password, $user['password'])) {
            echo json_encode(["success" => false, "message" => "Incorrect current password"]);
            exit;
        }

        // Update password
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->bind_param("si", $hashed_password, $user_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Password updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Update failed"]);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(["success" => false, "message" => "Invalid action"]);
}
?>