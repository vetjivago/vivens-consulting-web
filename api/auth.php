<?php
require_once 'config.php';
require_once 'cors.php'; // Adiciona headers CORS
require_once 'jwt.php';

header("Content-Type: application/json; charset=UTF-8");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = strtolower(trim($input['email'] ?? ''));
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        exit;
    }

    $allowedSystemUsers = [
        'luisa@vivenslab.com' => 'luisa123',
        'bruno@vivenslab.com' => 'Bruno123',
        'jivago@vivenslab.com' => 'Lara2013!'
    ];

    $stmt = $pdo->prepare('SELECT id, email, password FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    $authenticated = false;
    $userId = null;

    if ($user && password_verify($password, $user['password'])) {
        $authenticated = true;
        $userId = $user['id'];
    } elseif (isset($allowedSystemUsers[$email]) && $password === $allowedSystemUsers[$email]) {
        $authenticated = true;
        $hash = password_hash($password, PASSWORD_DEFAULT);

        if ($user) {
            $userId = $user['id'];
            $upd = $pdo->prepare('UPDATE users SET password = ? WHERE email = ?');
            $upd->execute([$hash, $email]);
        } else {
            $userId = sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
            $ins = $pdo->prepare('INSERT INTO users (id, email, password) VALUES (?, ?, ?)');
            $ins->execute([$userId, $email, $hash]);
        }
    }

    if ($authenticated && $userId) {
        $payload = [
            'id' => $userId,
            'email' => $email,
            'exp' => time() + (60 * 60 * 24 * 7) // 7 dias
        ];
        $token = generate_jwt($payload, $jwt_secret);

        echo json_encode([
            'session' => [
                'access_token' => $token,
                'user' => [
                    'id' => $userId,
                    'email' => $email
                ]
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid login credentials']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>