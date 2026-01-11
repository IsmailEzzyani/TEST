-- Create database if not exists
CREATE DATABASE IF NOT EXISTS prac;
USE prac;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    wallet_usd DECIMAL(15,2) DEFAULT 0.00,
    wallet_eur DECIMAL(15,2) DEFAULT 0.00,
    wallet_gbp DECIMAL(15,2) DEFAULT 0.00
);

-- Transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('send', 'receive', 'convert', 'deposit', 'withdraw', 'welcome') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    recipient_id INT NULL,
    recipient_email VARCHAR(150) NULL,
    description TEXT,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- NOTE: Sample user data removed - use create-admin.php to create admin users with proper password hashing
-- 
-- To create the admin user (ismail.ezzyani.03@gmail.com / ismail2003):
-- 1. Run this SQL file to create the database structure
-- 2. Then run create-admin.php in your browser to create the admin user with proper password hash
--
-- Sample data can be added through the signup form or admin panel

-- Password Reset Tokens Table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires_at (expires_at)
);

-- Create indexes for better performance
CREATE INDEX idx_user_id ON transactions(user_id);
CREATE INDEX idx_created_at ON transactions(created_at);
CREATE INDEX idx_user_email ON users(email);