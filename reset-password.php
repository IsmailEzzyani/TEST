<?php
/**
 * Reset Password API - Validate token and reset password
 */
require "config.php";

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
        'token' => ['required' => true],
        'password' => ['required' => true, 'min_length' => 6]
    ]);
    
    if (!empty($validation)) {
        echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
        exit;
    }
    
    $token = sanitizeString($data['token']);
    $password = $data['password'];
    
    // Validate password strength
    if (strlen($password) < 6) {
        echo json_encode(["success" => false, "message" => "Password must be at least 6 characters"]);
        exit;
    }
    
    // Find valid token
    $stmt = $conn->prepare("SELECT prt.user_id, prt.expires_at, prt.used, u.email 
                            FROM password_reset_tokens prt
                            JOIN users u ON prt.user_id = u.id
                            WHERE prt.token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "message" => "Invalid or expired reset token"]);
        $stmt->close();
        exit;
    }
    
    $token_data = $result->fetch_assoc();
    $stmt->close();
    
    // Check if token is used
    if ($token_data['used']) {
        echo json_encode(["success" => false, "message" => "This reset link has already been used"]);
        exit;
    }
    
    // Check if token is expired
    $expires_at = strtotime($token_data['expires_at']);
    $now = time();
    
    if ($now > $expires_at) {
        echo json_encode(["success" => false, "message" => "This reset link has expired. Please request a new one."]);
        exit;
    }
    
    // Hash new password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $user_id = $token_data['user_id'];
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Update password
        $update_stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
        $update_stmt->bind_param("si", $hashed_password, $user_id);
        $update_stmt->execute();
        $update_stmt->close();
        
        // Mark token as used
        $mark_used_stmt = $conn->prepare("UPDATE password_reset_tokens SET used = TRUE WHERE token = ?");
        $mark_used_stmt->bind_param("s", $token);
        $mark_used_stmt->execute();
        $mark_used_stmt->close();
        
        $conn->commit();
        
        echo json_encode([
            "success" => true,
            "message" => "Password reset successfully. You can now login with your new password."
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(["success" => false, "message" => "Error resetting password: " . $e->getMessage()]);
    }
    
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Validate token (for frontend to check if token is valid)
    $token = sanitizeString($_GET['token'] ?? '');
    
    if (empty($token)) {
        echo json_encode(["success" => false, "message" => "Token required"]);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT prt.expires_at, prt.used 
                            FROM password_reset_tokens prt
                            WHERE prt.token = ?");
    $stmt->bind_param("s", $token);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(["success" => false, "valid" => false, "message" => "Invalid token"]);
        $stmt->close();
        exit;
    }
    
    $token_data = $result->fetch_assoc();
    $stmt->close();
    
    // Check if token is used
    if ($token_data['used']) {
        echo json_encode(["success" => false, "valid" => false, "message" => "Token already used"]);
        exit;
    }
    
    // Check if token is expired
    $expires_at = strtotime($token_data['expires_at']);
    $now = time();
    
    if ($now > $expires_at) {
        echo json_encode(["success" => false, "valid" => false, "message" => "Token expired"]);
        exit;
    }
    
    echo json_encode(["success" => true, "valid" => true, "message" => "Token is valid"]);
    
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>

