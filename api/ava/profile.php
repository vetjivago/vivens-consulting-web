<?php
require_once '../config.php';
require_once '../cors.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

// Get user ID from JWT or default
require_once '../jwt.php';
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$userId = null;

if ($authHeader) {
    list($jwt) = sscanf($authHeader, 'Bearer %s');
    $decoded = verify_jwt($jwt, $jwt_secret);
    if ($decoded) {
        $userId = $decoded['id'];
    }
}

if (!$userId) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autorizado']);
    exit;
}

try {
    if ($method === 'GET') {
        $stmt = $pdo->prepare("SELECT id, email, name FROM users WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();
        if ($user) {
            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Usuário não encontrado']);
        }
    } elseif ($method === 'PUT' || $method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $name = $input['name'] ?? null;

        if ($name !== null) {
            // Ensure name column exists
            try {
                $pdo->exec("ALTER TABLE users ADD COLUMN name VARCHAR(255) DEFAULT NULL");
            } catch(PDOException $e) {
                // Column already exists, ignore
            }

            $stmt = $pdo->prepare("UPDATE users SET name = ? WHERE id = ?");
            $stmt->execute([$name, $userId]);
            echo json_encode(['success' => true, 'message' => 'Perfil atualizado']);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Nenhum campo para atualizar']);
        }
    }
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
