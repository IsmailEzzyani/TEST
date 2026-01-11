<?php
/**
 * Forgot Password API - Request password reset
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
        'email' => ['required' => true, 'type' => 'email']
    ]);

    if (!empty($validation)) {
        echo json_encode(["success" => false, "message" => implode(", ", $validation)]);
        exit;
    }

    $email = sanitizeString($data['email']);

    // Check if user exists
    $stmt = $conn->prepare("SELECT id, username, email FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    // Always return success message (security best practice - don't reveal if email exists)
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $user_id = $user['id'];

        // Generate secure token
        $token = bin2hex(random_bytes(32)); // 64 character token
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 hour')); // Token valid for 1 hour

        // Invalidate any existing tokens for this user
        $invalidate_stmt = $conn->prepare("UPDATE password_reset_tokens SET used = TRUE WHERE user_id = ? AND used = FALSE");
        $invalidate_stmt->bind_param("i", $user_id);
        $invalidate_stmt->execute();
        $invalidate_stmt->close();

        // Insert new token
        $token_stmt = $conn->prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)");
        $token_stmt->bind_param("iss", $user_id, $token, $expires_at);

        if ($token_stmt->execute()) {
            // Generate reset link
            $reset_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") .
                "://" . $_SERVER['HTTP_HOST'] .
                dirname($_SERVER['PHP_SELF']) .
                "/reset-password.html?token=" . $token;

            // Send email
            $to = $email;
            $subject = "Reset your password - PRAC";
            $message = "Hi there,\n\nClick the link below to reset your password:\n\n" . $reset_link . "\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.";
            $headers = "From: " . MAIL_FROM_NAME . " <" . MAIL_FROM . ">\r\n";
            $headers .= "Reply-To: " . MAIL_FROM . "\r\n";
            $headers .= "X-Mailer: PHP/" . phpversion();

            $mailSent = mail($to, $subject, $message, $headers);

            // Log the reset request
            if (getenv('APP_ENV') === 'development') {
                error_log("Password reset requested for: $email");
                error_log("Reset link: $reset_link");
                error_log("Mail sent status: " . ($mailSent ? "YES" : "NO"));
            }

            echo json_encode([
                "success" => true,
                "message" => "If an account exists with this email, a password reset link has been sent.",
                // Remove this in production - only for development
                "dev_reset_link" => (getenv('APP_ENV') === 'development') ? $reset_link : null
            ]);
        } else {
            echo json_encode(["success" => false, "message" => "Error generating reset token"]);
        }

        $token_stmt->close();
    } else {
        // User doesn't exist, but return success anyway (security)
        echo json_encode([
            "success" => true,
            "message" => "If an account exists with this email, a password reset link has been sent."
        ]);
    }

    $stmt->close();
} else {
    echo json_encode(["success" => false, "message" => "POST method required"]);
}
?>