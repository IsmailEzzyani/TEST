<?php
// Test database connection
require_once 'config.php';

echo "<h1>Database Connection Test</h1>";

// Test 1: Connection Status
echo "<h2>1. Connection Status</h2>";
if ($conn->connect_error) {
    echo "<p style='color: red;'>❌ Connection failed: " . $conn->connect_error . "</p>";
} else {
    echo "<p style='color: green;'>✅ Successfully connected to database: <strong>" . $dbname . "</strong></p>";
}

// Test 2: Database exists
echo "<h2>2. Database Information</h2>";
$result = $conn->query("SELECT DATABASE() as db_name");
if ($result) {
    $row = $result->fetch_assoc();
    echo "<p>Current database: <strong>" . $row['db_name'] . "</strong></p>";
}

// Test 3: Check if tables exist
echo "<h2>3. Tables Check</h2>";
$tables_query = "SHOW TABLES";
$tables_result = $conn->query($tables_query);

if ($tables_result && $tables_result->num_rows > 0) {
    echo "<p style='color: green;'>✅ Found " . $tables_result->num_rows . " tables:</p>";
    echo "<ul>";
    while ($table = $tables_result->fetch_array()) {
        echo "<li>" . $table[0] . "</li>";
    }
    echo "</ul>";
} else {
    echo "<p style='color: red;'>❌ No tables found in database. Please run parc.sql to create tables.</p>";
}

// Test 4: Check users table structure
echo "<h2>4. Users Table Structure</h2>";
$users_check = $conn->query("SHOW TABLES LIKE 'users'");
if ($users_check && $users_check->num_rows > 0) {
    echo "<p style='color: green;'>✅ Users table exists</p>";
    
    $columns = $conn->query("DESCRIBE users");
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse;'>";
    echo "<tr><th>Field</th><th>Type</th><th>Null</th><th>Key</th><th>Default</th></tr>";
    while ($col = $columns->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $col['Field'] . "</td>";
        echo "<td>" . $col['Type'] . "</td>";
        echo "<td>" . $col['Null'] . "</td>";
        echo "<td>" . $col['Key'] . "</td>";
        echo "<td>" . ($col['Default'] ?? 'NULL') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
    
    // Count users
    $user_count = $conn->query("SELECT COUNT(*) as count FROM users");
    $count = $user_count->fetch_assoc();
    echo "<p>Total users: <strong>" . $count['count'] . "</strong></p>";
} else {
    echo "<p style='color: red;'>❌ Users table does not exist</p>";
}

// Test 5: Check transactions table
echo "<h2>5. Transactions Table</h2>";
$trans_check = $conn->query("SHOW TABLES LIKE 'transactions'");
if ($trans_check && $trans_check->num_rows > 0) {
    echo "<p style='color: green;'>✅ Transactions table exists</p>";
    
    $trans_count = $conn->query("SELECT COUNT(*) as count FROM transactions");
    $count = $trans_count->fetch_assoc();
    echo "<p>Total transactions: <strong>" . $count['count'] . "</strong></p>";
} else {
    echo "<p style='color: red;'>❌ Transactions table does not exist</p>";
}

// Test 6: Check password_reset_tokens table
echo "<h2>6. Password Reset Tokens Table</h2>";
$reset_check = $conn->query("SHOW TABLES LIKE 'password_reset_tokens'");
if ($reset_check && $reset_check->num_rows > 0) {
    echo "<p style='color: green;'>✅ Password reset tokens table exists</p>";
} else {
    echo "<p style='color: red;'>❌ Password reset tokens table does not exist</p>";
}

// Test 7: Server Information
echo "<h2>7. Server Information</h2>";
echo "<p>MySQL Version: <strong>" . $conn->server_info . "</strong></p>";
echo "<p>Host: <strong>" . $servername . ":" . $port . "</strong></p>";
echo "<p>Database: <strong>" . $dbname . "</strong></p>";
echo "<p>Character Set: <strong>" . $conn->character_set_name() . "</strong></p>";

$conn->close();
?>
