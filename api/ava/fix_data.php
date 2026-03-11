<?php
require_once '../config.php';
require_once '../cors.php';

header('Content-Type: application/json');

try {
    // Fix instructor names
    $pdo->exec("UPDATE ava_courses SET instructor = 'Equipe Vivens' WHERE 1=1");

    // Add name column to users if missing
    try {
        $pdo->exec("ALTER TABLE users ADD COLUMN name VARCHAR(255) DEFAULT NULL");
    } catch(PDOException $e) {
        // already exists
    }

    echo json_encode(['success' => true, 'message' => 'Dados corrigidos com sucesso']);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
