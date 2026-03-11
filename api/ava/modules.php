<?php
require_once '../config.php';
header('Content-Type: application/json');

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;
// Check user ID properly in prod
$userId = 1;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $courseId > 0) {
        $stmtModules = $pdo->prepare("SELECT * FROM ava_modules WHERE course_id = ? ORDER BY order_index ASC");
        $stmtModules->execute([$courseId]);
        $modules = $stmtModules->fetchAll();
        
        foreach ($modules as &$module) {
            $stmtLessons = $pdo->prepare("
                SELECT l.*, 
                       IFNULL(p.completed, 0) as is_completed 
                FROM ava_lessons l 
                LEFT JOIN ava_user_progress p ON (l.id = p.lesson_id AND p.user_id = ?)
                WHERE l.module_id = ? 
                ORDER BY l.order_index ASC
            ");
            $stmtLessons->execute([$userId, $module['id']]);
            $module['lessons'] = $stmtLessons->fetchAll();
        }
        
        echo json_encode(['success' => true, 'modules' => $modules]);
    } else {
        echo json_encode(['error' => 'Invalid course ID']);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
