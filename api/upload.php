<?php
require_once 'config.php';
require_once 'jwt.php';

$user = auth_require($pdo, $jwt_secret);
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(['error' => 'No file uploaded']);
    exit;
}

// Simulando o bucket/path do Supabase
$bucket = $_POST['bucket'] ?? 'uploads';
$path = $_POST['path'] ?? $_FILES['file']['name'];

$relative_dir = '/uploads/' . $bucket . '/';
$full_path = $relative_dir . ltrim($path, '/');

$target_dir = __DIR__ . dirname($full_path);
if (!is_dir($target_dir)) {
    mkdir($target_dir, 0755, true);
}

$target_file = __DIR__ . $full_path;

if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    // Retorna no formato do Supabase { data: { path: "..." }, error: null }
    echo json_encode([
        'data' => ['path' => str_replace('//', '/', $full_path)],
        'error' => null
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file']);
}
?>