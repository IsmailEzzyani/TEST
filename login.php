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
    
    // Validate input
    $validation = validateInput($data, [
        'email' => ['required' => true],
        'password' => ['required' => true, 'min_length' => 6]
    ]);
    
    if (!empty($validation)) {
        echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
        exit;
    }
    
    $email = sanitizeString($data["email"] ?? '');
    $password = $data["password"] ?? '';

    // Use prepared statement to prevent SQL injection
    // Check if it's email or username
    if (strpos($email, '@') !== false) {
        $stmt = $conn->prepare("SELECT id, username, email, full_name, password, is_admin, wallet_usd, wallet_eur, wallet_gbp FROM users WHERE email = ?");
    } else {
        $stmt = $conn->prepare("SELECT id, username, email, full_name, password, is_admin, wallet_usd, wallet_eur, wallet_gbp FROM users WHERE username = ?");
    }
    
    if (!$stmt) {
        echo json_encode(["success" => false, "message" => "Database error"]);
        exit;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify password - only use password_verify, remove demo password
        if (password_verify($password, $user["password"])) {
            $_SESSION["user_id"] = $user["id"];
            $_SESSION["username"] = $user["username"];
            $_SESSION["email"] = $user["email"];
            $_SESSION["full_name"] = $user["full_name"];
            $_SESSION["is_admin"] = (bool)$user["is_admin"];
            
            // Return user data for frontend
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
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
            echo json_encode(["success" => false, "message" => "Invalid email or password"]);
        }
    } else {
        // Don't reveal if user exists or not (security best practice)
        echo json_encode(["success" => false, "message" => "Invalid email or password"]);
    }
    
    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
