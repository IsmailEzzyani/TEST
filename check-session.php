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
if(!isset($_SESSION['user_id'])) {
    echo json_encode([
        "logged_in" => false,
        "message" => "Not logged in"
    ]);
    exit();
}

// Return user data as JSON
echo json_encode([
    "logged_in" => true,
    "user_id" => (int)$_SESSION["user_id"],
    "username" => $_SESSION["username"] ?? null,
    "email" => $_SESSION["email"] ?? null,
    "full_name" => $_SESSION["full_name"] ?? null,
    "is_admin" => (bool)($_SESSION["is_admin"] ?? false)
]);
?>