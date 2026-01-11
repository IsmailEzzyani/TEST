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

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate inputs using helper function
    $validation = validateInput($data, [
        'full_name' => ['required' => true, 'min_length' => 2, 'max_length' => 100],
        'email' => ['required' => true, 'type' => 'email', 'max_length' => 255],
        'username' => ['required' => true, 'min_length' => 3, 'max_length' => 50],
        'password' => ['required' => true, 'min_length' => 6, 'max_length' => 255]
    ]);
    
    if (!empty($validation)) {
        echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
        exit;
    }
    
    $full_name = sanitizeString($data["full_name"]);
    $email = sanitizeString($data["email"]);
    $username = sanitizeString($data["username"]);
    $password = $data["password"];
    
    // Check if email or username already exists using prepared statement
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    if (!$check_stmt) {
        echo json_encode(["success" => false, "message" => "Database error"]);
        exit;
    }
    
    $check_stmt->bind_param("ss", $email, $username);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();
    
    if ($check_result && $check_result->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email or username already exists"]);
        $check_stmt->close();
        exit;
    }
    $check_stmt->close();
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user with zero wallet balances (users start with no money)
    $insert_stmt = $conn->prepare("INSERT INTO users (full_name, email, username, password, wallet_usd, wallet_eur, wallet_gbp) 
            VALUES (?, ?, ?, ?, 0.00, 0.00, 0.00)");
    
    if (!$insert_stmt) {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
        exit;
    }
    
    $insert_stmt->bind_param("ssss", $full_name, $email, $username, $hashed_password);
    
    if ($insert_stmt->execute()) {
        $user_id = $conn->insert_id;
        
        // No welcome bonus - users start with zero balance
        // Users must deposit money to have funds in their account
        
        // Get user data using prepared statement
        $user_stmt = $conn->prepare("SELECT id, username, email, full_name, is_admin, wallet_usd, wallet_eur, wallet_gbp FROM users WHERE id = ?");
        $user_stmt->bind_param("i", $user_id);
        $user_stmt->execute();
        $user_result = $user_stmt->get_result();
        $user = $user_result->fetch_assoc();
        $user_stmt->close();
        
        // Set session
        $_SESSION["user_id"] = $user["id"];
        $_SESSION["username"] = $user["username"];
        $_SESSION["email"] = $user["email"];
        $_SESSION["full_name"] = $user["full_name"];
        $_SESSION["is_admin"] = (bool)$user["is_admin"];
        
        echo json_encode([
            "success" => true,
            "message" => "Signup successful",
            "user" => [
                "id" => (int)$user["id"],
                "username" => $user["username"],
                "email" => $user["email"],
                "full_name" => $user["full_name"],
                "is_admin" => (bool)$user["is_admin"],
                "wallet_usd" => (float)$user["wallet_usd"],
                "wallet_eur" => (float)$user["wallet_eur"],
                "wallet_gbp" => (float)$user["wallet_gbp"]
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error creating account"]);
    }
    
    $insert_stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>