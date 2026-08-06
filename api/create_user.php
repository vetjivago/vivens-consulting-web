<?php
require_once 'config.php';
require_once 'cors.php';

header("Content-Type: application/json; charset=UTF-8");

$users = [
    ['email' => 'bruno@vivenslab.com', 'password' => 'Bruno123'],
    ['email' => 'jivago@vivenslab.com', 'password' => 'Lara2013!'],
    ['email' => 'luisa@vivenslab.com', 'password' => 'luisa123']
];

try {
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `users` (
          `id` VARCHAR(36) PRIMARY KEY,
          `email` VARCHAR(255) UNIQUE NOT NULL,
          `password` VARCHAR(255) NOT NULL,
          `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ");

    foreach ($users as $u) {
        $email = strtolower(trim($u['email']));
        $hash = password_hash($u['password'], PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $existing = $stmt->fetch();

        if ($existing) {
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE email = ?");
            $stmt->execute([$hash, $email]);
        } else {
            $id = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
            $stmt = $pdo->prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)");
            $stmt->execute([$id, $email, $hash]);
        }
    }

    echo json_encode(['success' => true, 'message' => 'Users created/updated successfully']);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
