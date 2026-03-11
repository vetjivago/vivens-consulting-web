<?php
require_once '../config.php';

header('Content-Type: application/json');

$email = 'jivago@vivenslab.com';
$password = 'Lara2013!';
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

try {
    // Ensure users table exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if ($user) {
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed_password, $user['id']]);
        echo json_encode(['success' => true, 'message' => "User updated successfully"]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
        $stmt->execute([$email, $hashed_password]);
        echo json_encode(['success' => true, 'message' => "User created successfully", 'id' => $pdo->lastInsertId()]);
    }

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
