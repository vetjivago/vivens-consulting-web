<?php
require_once '../config.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"));
// Check user ID properly in prod
$userId = 1;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($data->course_id) && isset($data->lesson_id)) {
        
        // Insert or update on duplicate key (MySQL)
        $stmt = $pdo->prepare("
            INSERT INTO ava_user_progress (user_id, course_id, lesson_id, completed) 
            VALUES (?, ?, ?, 1)
            ON DUPLICATE KEY UPDATE completed = 1, last_accessed = CURRENT_TIMESTAMP
        ");
        $success = $stmt->execute([$userId, $data->course_id, $data->lesson_id]);
        
        echo json_encode(['success' => $success]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
