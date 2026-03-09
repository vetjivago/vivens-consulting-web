<?php
// config.php
require_once 'cors.php';

$host = 'localhost';
$db = 'josel054_vivens_db';
$user = 'josel054_vivens';
$pass = 'Lara2013!';
$charset = 'utf8mb4';

// JWT Secret Key - Change this in production!
$jwt_secret = 'vivens_super_secret_key_2026';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}
?>