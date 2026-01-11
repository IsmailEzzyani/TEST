<?php
// Environment detection (set to 'production' for production, 'development' for dev)
$environment = getenv('APP_ENV') ?: 'development';

// Error reporting based on environment
if ($environment === 'production') {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
    ini_set('log_errors', 1);
    ini_set('error_log', __DIR__ . '/logs/php-errors.log');
} else {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Database configuration - can be overridden by environment variables
$servername = getenv('DB_HOST') ?: "localhost";
$username = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASS') ?: "";
$dbname = getenv('DB_NAME') ?: "prac";
$port = getenv('DB_PORT') ?: 3306;

// Email Configuration
define('MAIL_FROM', 'no-reply@prac.com');
define('MAIL_FROM_NAME', 'PRAC Support');


// CORS configuration - restrict to specific domains in production
$allowed_origins = [
    'http://localhost',
    'http://localhost:8080',
    'http://127.0.0.1',
    'http://127.0.0.1:8080'
];

// Add production domain here
if ($environment === 'production') {
    // $allowed_origins[] = 'https://yourdomain.com';
}

// Create connection using MySQLi (Object-Oriented)
$conn = new mysqli($servername, $username, $password, $dbname, $port);

// Check the connection
if ($conn->connect_error) {
    if ($environment === 'production') {
        die(json_encode(["success" => false, "message" => "Database connection failed"]));
    } else {
        die("Database connection failed: " . $conn->connect_error);
    }
}

// Set charset to utf8mb4 for proper encoding
$conn->set_charset("utf8mb4");

// Helper function to set CORS headers
function setCorsHeaders($allowed_origins)
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array($origin, $allowed_origins)) {
        header("Access-Control-Allow-Origin: $origin");
    } else {
        // In development, allow all origins
        if (getenv('APP_ENV') !== 'production') {
            header("Access-Control-Allow-Origin: *");
        }
    }
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-User-Data");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json");
}

// Helper function for input validation
function validateInput($data, $rules)
{
    $errors = [];
    foreach ($rules as $field => $rule) {
        $value = $data[$field] ?? null;

        if (isset($rule['required']) && $rule['required'] && empty($value)) {
            $errors[$field] = ucfirst($field) . " is required";
            continue;
        }

        if (!empty($value)) {
            if (isset($rule['type'])) {
                switch ($rule['type']) {
                    case 'email':
                        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                            $errors[$field] = "Invalid email format";
                        }
                        break;
                    case 'int':
                        if (!filter_var($value, FILTER_VALIDATE_INT)) {
                            $errors[$field] = ucfirst($field) . " must be a number";
                        }
                        break;
                    case 'float':
                        if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
                            $errors[$field] = ucfirst($field) . " must be a number";
                        }
                        break;
                }
            }

            if (isset($rule['min_length']) && strlen($value) < $rule['min_length']) {
                $errors[$field] = ucfirst($field) . " must be at least " . $rule['min_length'] . " characters";
            }

            if (isset($rule['max_length']) && strlen($value) > $rule['max_length']) {
                $errors[$field] = ucfirst($field) . " must be no more than " . $rule['max_length'] . " characters";
            }
        }
    }

    return $errors;
}

// Helper function to sanitize string input
function sanitizeString($string)
{
    return htmlspecialchars(strip_tags(trim($string)), ENT_QUOTES, 'UTF-8');
}
?>