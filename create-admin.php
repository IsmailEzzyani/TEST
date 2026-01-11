<?php
/**
 * Script to create or update admin user
 * 
 * INSTRUCTIONS:
 * 1. Open this file in your browser: http://localhost/PRAC-Siteweb/create-admin.php
 * 2. The admin user will be created/updated
 * 3. DELETE THIS FILE after use for security
 */

// Set content type to HTML for browser viewing
header("Content-Type: text/html; charset=UTF-8");

require "config.php";

// Admin user details
$email = "ismail.ezzyani.03@gmail.com";
$password = "ismail2003";
$username = "ismail";
$full_name = "Ismail Ezzyani";

// Hash the password
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Check if user already exists
$check_stmt = $conn->prepare("SELECT id, is_admin FROM users WHERE email = ? OR username = ?");
$check_stmt->bind_param("ss", $email, $username);
$check_stmt->execute();
$result = $check_stmt->get_result();
$existing_user = $result->fetch_assoc();
$check_stmt->close();

if ($existing_user) {
    // User exists, update to admin
    $update_stmt = $conn->prepare("UPDATE users SET 
        password = ?, 
        is_admin = TRUE, 
        full_name = ?,
        wallet_usd = 0.00,
        wallet_eur = 0.00,
        wallet_gbp = 0.00
        WHERE id = ?");
    $update_stmt->bind_param("ssi", $hashed_password, $full_name, $existing_user['id']);

    if ($update_stmt->execute()) {
        $result = [
            "success" => true,
            "message" => "Admin user updated successfully!",
            "user_id" => $existing_user['id'],
            "email" => $email,
            "username" => $username
        ];
        displayResult($result, true);
    } else {
        $result = [
            "success" => false,
            "message" => "Error updating user: " . $update_stmt->error
        ];
        displayResult($result, false);
    }
    $update_stmt->close();
} else {
    // User doesn't exist, create new admin user
    $insert_stmt = $conn->prepare("INSERT INTO users (full_name, email, username, password, is_admin, wallet_usd, wallet_eur, wallet_gbp) 
        VALUES (?, ?, ?, ?, TRUE, 0.00, 0.00, 0.00)");
    $insert_stmt->bind_param("ssss", $full_name, $email, $username, $hashed_password);

    if ($insert_stmt->execute()) {
        $user_id = $conn->insert_id;

        // Create welcome transaction
        $welcome_stmt = $conn->prepare("INSERT INTO transactions (user_id, type, amount, currency, description, status) 
            VALUES (?, 'welcome', 0.00, 'USD', 'Admin account setup', 'completed')");
        $welcome_stmt->bind_param("i", $user_id);
        $welcome_stmt->execute();
        $welcome_stmt->close();

        $result = [
            "success" => true,
            "message" => "Admin user created successfully!",
            "user_id" => $user_id,
            "email" => $email,
            "username" => $username
        ];
        displayResult($result, true);
    } else {
        $result = [
            "success" => false,
            "message" => "Error creating user: " . $insert_stmt->error
        ];
        displayResult($result, false);
    }
    $insert_stmt->close();
}

$conn->close();

// Function to display result in HTML format
function displayResult($result, $success)
{
    $color = $success ? "green" : "red";
    $icon = $success ? "✓" : "✗";
    ?>
    <!DOCTYPE html>
    <html>

    <head>
        <title>Create Admin User</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: #f5f5f5;
            }

            .container {
                background: white;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }

            h1 {
                color: #333;
                margin-bottom: 20px;
            }

            .result {
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
                background:
                    <?php echo $success ? '#d4edda' : '#f8d7da'; ?>
                ;
                border: 1px solid
                    <?php echo $success ? '#c3e6cb' : '#f5c6cb'; ?>
                ;
                color:
                    <?php echo $success ? '#155724' : '#721c24'; ?>
                ;
            }

            .info {
                background: #e7f3ff;
                border: 1px solid #b3d9ff;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
            }

            .warning {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 15px;
                border-radius: 5px;
                margin-top: 20px;
                color: #856404;
            }

            code {
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: monospace;
            }
        </style>
    </head>

    <body>
        <div class="container">
            <h1>Admin User Setup</h1>
            <div class="result">
                <strong><?php echo $icon; ?>     <?php echo htmlspecialchars($result['message']); ?></strong>
            </div>

            <?php if ($success): ?>
                <div class="info">
                    <h3>User Details:</h3>
                    <p><strong>Email:</strong> <?php echo htmlspecialchars($result['email']); ?></p>
                    <p><strong>Username:</strong> <?php echo htmlspecialchars($result['username']); ?></p>
                    <p><strong>Password:</strong> ismail2003</p>
                    <p><strong>User ID:</strong> <?php echo $result['user_id']; ?></p>
                    <p><strong>Status:</strong> Admin ✓</p>
                </div>
            <?php endif; ?>

            <div class="warning">
                <strong>⚠️ Security Warning:</strong><br>
                Please <strong>DELETE</strong> this file (<code>create-admin.php</code>) after use for security reasons!
            </div>
        </div>
    </body>

    </html>
    <?php
}
?>