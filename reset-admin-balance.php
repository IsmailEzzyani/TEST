<?php
/**
 * Temporary script to reset admin balance to 0
 */
require "config.php";

$email = "ismail.ezzyani.03@gmail.com";

$stmt = $conn->prepare("UPDATE users SET wallet_usd = 0.00, wallet_eur = 0.00, wallet_gbp = 0.00 WHERE email = ?");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo "<h1>Admin balance reset successfully!</h1>";
    echo "<p>User: $email</p>";
    echo "<p>All wallets set to 0.00</p>";
    echo "<p><a href='dashboard.html'>Go to Dashboard</a></p>";
} else {
    echo "<h1>Error resetting balance: " . $stmt->error . "</h1>";
}

$stmt->close();
$conn->close();
?>