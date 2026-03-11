<?php
require_once '../config.php';
require_once '../jwt.php';

header('Content-Type: application/json');

// Helper to check auth
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$userId = null;

// Currently hardcoding user ID 1 for demo if no auth, in production enforce JWT
if ($authHeader) {
    list($jwt) = sscanf($authHeader, 'Bearer %s');
    $decoded = verify_jwt($jwt, $jwt_secret);
    if ($decoded) {
        $userId = $decoded['user_id'];
    }
}
// fallback for demo
if (!$userId) $userId = 1;

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Fetch all courses
        $stmt = $pdo->query("SELECT * FROM ava_courses ORDER BY created_at DESC");
        $courses = $stmt->fetchAll();
        
        // Calculate progress for each course
        foreach($courses as &$course) {
            $courseId = $course['id'];
            
            // Total lessons
            $stmtLessons = $pdo->prepare("
                SELECT COUNT(l.id) as total 
                FROM ava_lessons l
                JOIN ava_modules m ON l.module_id = m.id
                WHERE m.course_id = ?
            ");
            $stmtLessons->execute([$courseId]);
            $totalLessons = $stmtLessons->fetch()['total'];
            
            // Completed lessons by user
            $stmtCompleted = $pdo->prepare("
                SELECT COUNT(id) as completed 
                FROM ava_user_progress 
                WHERE course_id = ? AND user_id = ? AND completed = 1
            ");
            $stmtCompleted->execute([$courseId, $userId]);
            $completedLessons = $stmtCompleted->fetch()['completed'];
            
            $progressPercent = $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100) : 0;
            
            $course['progress_percent'] = $progressPercent;
            $course['total_lessons'] = $totalLessons;
            $course['completed_lessons'] = $completedLessons;
        }
        
        echo json_encode(['success' => true, 'courses' => $courses]);
    }
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
