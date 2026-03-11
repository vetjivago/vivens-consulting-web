<?php
require_once '../config.php';

try {
    $pdo->beginTransaction();

    // Inserir Curso
    $stmt = $pdo->prepare("INSERT INTO ava_courses (title, description, instructor, thumbnail_url) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        'Capacitação In-Company: Synergy Animal Research',
        'Curso de capacitação in-company customizado estruturado para a realidade de pesquisa clínica veterinária.',
        'Vivens Consultoria Científica',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop'
    ]);
    
    $course_id = $pdo->lastInsertId();

    // Módulos
    $modules = [
        ['title' => 'Módulo 1: Fundamentos', 'order_index' => 1],
        ['title' => 'Módulo 2: Marco Regulatório', 'order_index' => 2],
        ['title' => 'Módulo 3: Cães e Gatos', 'order_index' => 3],
        ['title' => 'Módulo 4: Bovinos', 'order_index' => 4],
        ['title' => 'Módulo 5: Suínos', 'order_index' => 5],
        ['title' => 'Módulo 6: Desfechos Humanitários', 'order_index' => 6],
        ['title' => 'Módulo 7: Documentação e BPC', 'order_index' => 7],
        ['title' => 'Módulo 8: Estudos de Caso e Avaliação Final', 'order_index' => 8]
    ];

    $module_ids = [];
    $stmt_mod = $pdo->prepare("INSERT INTO ava_modules (course_id, title, order_index) VALUES (?, ?, ?)");
    foreach ($modules as $mod) {
        $stmt_mod->execute([$course_id, $mod['title'], $mod['order_index']]);
        $module_ids[] = $pdo->lastInsertId();
    }

    // Aulas (1 por módulo para simplificar, já que são síncronas/gravações de horas)
    $lessons = [
        ['module_id' => $module_ids[0], 'title' => 'Fundamentos em Ciência de Animais de Laboratório', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 1'],
        ['module_id' => $module_ids[1], 'title' => 'Marco Regulatório e Ética', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 2'],
        ['module_id' => $module_ids[2], 'title' => 'Particularidades: Cães e Gatos', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 3'],
        ['module_id' => $module_ids[3], 'title' => 'Particularidades: Bovinos', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 4'],
        ['module_id' => $module_ids[4], 'title' => 'Particularidades: Suínos', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 5'],
        ['module_id' => $module_ids[5], 'title' => 'Desfechos Humanitários e Avaliação de Dor', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 6'],
        ['module_id' => $module_ids[6], 'title' => 'Documentação e Boas Práticas Clínicas (BPC)', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 7'],
        ['module_id' => $module_ids[7], 'title' => 'Estudos de Caso e Avaliação Final', 'video_url' => '', 'duration_minutes' => 120, 'order_index' => 1, 'content' => 'Conteúdo do módulo 8']
    ];

    $stmt_lesson = $pdo->prepare("INSERT INTO ava_lessons (module_id, title, video_url, content_text, duration_minutes, order_index) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($lessons as $lesson) {
        $stmt_lesson->execute([$lesson['module_id'], $lesson['title'], $lesson['video_url'], $lesson['content'], $lesson['duration_minutes'], $lesson['order_index']]);
    }

    $pdo->commit();
    echo "Curso Synergy criado com sucesso!";

} catch(PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo "Erro: " . $e->getMessage();
}
?>
