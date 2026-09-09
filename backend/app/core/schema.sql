-- ==============================================================================
-- FraudShield AI — Database Schema Initializer
-- MySQL 8.0 Compatibility
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `fraud_alerts`;
DROP TABLE IF EXISTS `explainability_logs`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users table (Enterprise Authentication)
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(50) NOT NULL,
  `last_name` VARCHAR(50) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'analyst', -- analyst, admin, manager
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Credit Card Transactions
CREATE TABLE `transactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` INT,
  `amount` DECIMAL(10, 2) NOT NULL,
  `merchant` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `timestamp` TIMESTAMP NOT NULL,
  `card_type` VARCHAR(20) NOT NULL,
  `location_lat` DECIMAL(9, 6),
  `location_long` DECIMAL(9, 6),
  `status` VARCHAR(20) DEFAULT 'pending', -- approved, declined, suspicious
  `is_fraud` TINYINT(1) DEFAULT 0,
  `fraud_probability` DECIMAL(5, 4) DEFAULT 0.0000,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Explainability Logs (Explainable AI - SHAP & LIME explanations cache)
CREATE TABLE `explainability_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` VARCHAR(50) NOT NULL,
  `method` VARCHAR(10) NOT NULL, -- SHAP, LIME
  `explanation_json` JSON NOT NULL, -- Stores key-value importances
  `base_value` DECIMAL(10, 6),
  `prediction_value` DECIMAL(10, 6),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Fraud Alerts / Workflows
CREATE TABLE `fraud_alerts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `transaction_id` VARCHAR(50) NOT NULL,
  `severity` VARCHAR(10) NOT NULL, -- Low, Medium, High, Critical
  `assigned_to` INT,
  `status` VARCHAR(20) DEFAULT 'open', -- open, investigating, resolved, false_positive
  `resolution_notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- !! No default admin credentials are seeded here.
-- !! Use the Flask CLI command to provision the first admin account:
-- !!   flask create-admin
-- !! See README.md § "First Admin Account" for full instructions.
