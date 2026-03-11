<?php
require_once '../config.php';
require_once '../cors.php';

header('Content-Type: application/json');

$courseId = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

// Get user from JWT
require_once '../jwt.php';
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$userId = null;
if ($authHeader) {
    list($jwt) = sscanf($authHeader, 'Bearer %s');
    $decoded = verify_jwt($jwt, $jwt_secret);
    if ($decoded) $userId = $decoded['id'];
}
if (!$userId) $userId = 1;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET' && $courseId > 0) {
        // Get course info
        $stmtCourse = $pdo->prepare("SELECT * FROM ava_courses WHERE id = ?");
        $stmtCourse->execute([$courseId]);
        $course = $stmtCourse->fetch();

        if (!$course) {
            http_response_code(404);
            echo json_encode(['error' => 'Curso não encontrado']);
            exit;
        }

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
        
        echo json_encode(['success' => true, 'course' => $course, 'modules' => $modules]);
    } else {
        echo json_encode(['error' => 'Invalid course ID']);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
