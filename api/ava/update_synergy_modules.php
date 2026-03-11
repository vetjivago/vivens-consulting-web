<?php
require_once '../config.php';
require_once '../cors.php';

header('Content-Type: application/json');

try {
    $pdo->beginTransaction();

    // Get course ID for Synergy
    $stmt = $pdo->prepare("SELECT id FROM ava_courses WHERE title LIKE '%Synergy%'");
    $stmt->execute();
    $course = $stmt->fetch();
    
    if (!$course) {
        echo json_encode(['error' => 'Curso Synergy não encontrado']);
        exit;
    }
    
    $courseId = $course['id'];
    
    // Delete existing modules & lessons (cascade)
    $pdo->prepare("DELETE FROM ava_modules WHERE course_id = ?")->execute([$courseId]);

    // Insert new modules with correct data from proposal
    $modules = [
        ['title' => 'Módulo 1: Fundamentos da Ciência do Bem-Estar Animal', 'hours' => '3h', 'format' => 'Síncrono + discussão', 'order' => 1],
        ['title' => 'Módulo 2: Marco Regulatório Nacional e Internacional', 'hours' => '3h', 'format' => 'Síncrono + análise', 'order' => 2],
        ['title' => 'Módulo 3: Bem-Estar de Cães e Gatos em Pesquisa Clínica', 'hours' => '3h', 'format' => 'Síncrono + vídeos', 'order' => 3],
        ['title' => 'Módulo 4: Bem-Estar de Bovinos em Pesquisa Clínica', 'hours' => '3h', 'format' => 'Síncrono + vídeos', 'order' => 4],
        ['title' => 'Módulo 5: Bem-Estar de Suínos em Pesquisa Clínica', 'hours' => '3h', 'format' => 'Síncrono + vídeos', 'order' => 5],
        ['title' => 'Módulo 6: Desfechos Humanitários e Comitês de Monitoramento', 'hours' => '2h', 'format' => 'Síncrono + workshop', 'order' => 6],
        ['title' => 'Módulo 7: Documentação, Registro e BPC', 'hours' => '2h', 'format' => 'Síncrono + exercícios', 'order' => 7],
        ['title' => 'Módulo 8: Estudos de Caso Integrados e Avaliação Final', 'hours' => '3h', 'format' => 'Workshop colaborativo', 'order' => 8]
    ];

    $stmtMod = $pdo->prepare("INSERT INTO ava_modules (course_id, title, order_index) VALUES (?, ?, ?)");
    $stmtLesson = $pdo->prepare("INSERT INTO ava_lessons (module_id, title, video_url, content_text, duration_minutes, order_index) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($modules as $mod) {
        $stmtMod->execute([$courseId, $mod['title'], $mod['order']]);
        $moduleId = $pdo->lastInsertId();

        $hours = (int) filter_var($mod['hours'], FILTER_SANITIZE_NUMBER_INT);
        $minutes = $hours * 60;

        $stmtLesson->execute([
            $moduleId,
            $mod['title'],
            '',
            'Formato: ' . $mod['format'] . '. Duração: ' . $mod['hours'] . '.',
            $minutes,
            1
        ]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Módulos do curso Synergy atualizados com sucesso! Course ID: ' . $courseId]);

} catch(PDOException $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    echo json_encode(['error' => $e->getMessage()]);
}
?>
