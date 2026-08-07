<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';

try {
    // 1. Users table (for Auth)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
          `id` VARCHAR(36) PRIMARY KEY,
          `email` VARCHAR(255) UNIQUE NOT NULL,
          `password` VARCHAR(255) NOT NULL,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 2. Clients table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `clients` (
          `id` VARCHAR(36) PRIMARY KEY,
          `name` VARCHAR(255) NOT NULL,
          `fantasy_name` VARCHAR(255),
          `contact_person` VARCHAR(255),
          `email` VARCHAR(255),
          `phone` VARCHAR(255),
          `document` VARCHAR(255),
          `state_registration` VARCHAR(255),
          `address` TEXT,
          `street` VARCHAR(255),
          `number` VARCHAR(255),
          `neighborhood` VARCHAR(255),
          `city` VARCHAR(255),
          `state` VARCHAR(255),
          `zip_code` VARCHAR(255),
          `status` VARCHAR(50) DEFAULT 'active',
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Ensure columns exist if clients table was previously created with fewer columns
    $columnsToAdd = [
        'fantasy_name' => 'VARCHAR(255)',
        'contact_person' => 'VARCHAR(255)',
        'state_registration' => 'VARCHAR(255)',
        'street' => 'VARCHAR(255)',
        'number' => 'VARCHAR(255)',
        'neighborhood' => 'VARCHAR(255)',
        'city' => 'VARCHAR(255)',
        'state' => 'VARCHAR(255)',
        'zip_code' => 'VARCHAR(255)',
        'updated_at' => 'DATETIME'
    ];

    $stmt = $pdo->query("SHOW COLUMNS FROM `clients`");
    $existing = $stmt->fetchAll(PDO::FETCH_COLUMN);

    foreach ($columnsToAdd as $col => $type) {
        if (!in_array($col, $existing)) {
            $pdo->exec("ALTER TABLE `clients` ADD COLUMN `$col` $type");
        }
    }

    // 3. Projects table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `projects` (
          `id` VARCHAR(36) PRIMARY KEY,
          `title` VARCHAR(255) NOT NULL,
          `client_id` VARCHAR(36),
          `status` VARCHAR(50) DEFAULT 'active',
          `start_date` DATE,
          `end_date` DATE,
          `description` TEXT,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 4. Reports table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `reports` (
          `id` VARCHAR(36) PRIMARY KEY,
          `title` VARCHAR(255) NOT NULL,
          `project_id` VARCHAR(36),
          `type` VARCHAR(50),
          `status` VARCHAR(50) DEFAULT 'draft',
          `content` LONGTEXT,
          `images` LONGTEXT,
          `pdf_url` TEXT,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
          `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // Ensure extra columns exist if reports table was created before
    $reportExtraCols = ['images' => 'LONGTEXT', 'pdf_url' => 'TEXT'];
    $stmtR = $pdo->query("SHOW COLUMNS FROM `reports`");
    $existingR = $stmtR->fetchAll(PDO::FETCH_COLUMN);
    foreach ($reportExtraCols as $col => $type) {
        if (!in_array($col, $existingR)) {
            $pdo->exec("ALTER TABLE `reports` ADD COLUMN `$col` $type");
        }
    }

    // 5. Invoices table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `invoices` (
          `id` VARCHAR(36) PRIMARY KEY,
          `client_id` VARCHAR(36),
          `number` VARCHAR(50),
          `issue_date` DATE,
          `value` DECIMAL(10,2),
          `status` VARCHAR(50),
          `file_url` TEXT,
          `file_type` VARCHAR(20),
          `notes` TEXT,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    // 6. System Users Seeding
    $systemUsers = [
        'bruno@vivenslab.com' => 'Bruno123',
        'jivago@vivenslab.com' => 'Lara2013!',
        'luisa@vivenslab.com' => 'luisa123'
    ];

    foreach ($systemUsers as $uEmail => $uPass) {
        $hash = password_hash($uPass, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$uEmail]);
        $existing = $stmt->fetch();
        if (!$existing) {
            $uId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
            $ins = $pdo->prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)");
            $ins->execute([$uId, $uEmail, $hash]);
        } else {
            $upd = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
            $upd->execute([$hash, $uEmail]);
        }
    }

    echo "Tables and system users updated successfully.";
} catch (\PDOException $e) {
    echo "Error updating tables: " . $e->getMessage();
}
?>
