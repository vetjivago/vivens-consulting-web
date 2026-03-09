<?php
// api/crud_helper.php
require_once 'config.php';
require_once 'jwt.php';

function uuid_v4()
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

function handle_crud($table, $pdo, $jwt_secret)
{
    auth_require($pdo, $jwt_secret);
    header("Content-Type: application/json; charset=UTF-8");
    $method = $_SERVER['REQUEST_METHOD'];

    try {
        if ($method === 'GET') {
            $conditions = [];
            $params = [];
            $select = '*';

            foreach ($_GET as $key => $value) {
                if ($key === 'select') {
                    // Ignora select avançado por enquanto, pega tudo
                    continue;
                }
                if ($key === 'order' || $key === 'limit' || $key === 'single') {
                    continue;
                }
                if (str_ends_with($key, 'eq')) {
                    $realKey = str_replace('.eq', '', $key);
                    $conditions[] = "`$realKey` = ?";
                    $params[] = $value;
                } else {
                    $conditions[] = "`$key` = ?";
                    $params[] = $value;
                }
            }

            $where = count($conditions) > 0 ? "WHERE " . implode(' AND ', $conditions) : "";
            $sql = "SELECT $select FROM `$table` $where ORDER BY created_at DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            echo json_encode($stmt->fetchAll());

        } elseif ($method === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (isset($input[0]))
                $input = $input[0]; // Extrai do formato Supabase insert([{}])

            if (!isset($input['id'])) {
                $input['id'] = uuid_v4();
            }
            if (!isset($input['created_at'])) {
                $input['created_at'] = date('Y-m-d H:i:s');
            }

            $columns = array_keys($input);
            $placeholders = array_fill(0, count($columns), '?');

            $sql = "INSERT INTO `$table` (`" . implode("`, `", $columns) . "`) VALUES (" . implode(", ", $placeholders) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($input));

            $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
            $stmt->execute([$input['id']]);
            echo json_encode([$stmt->fetch()]);

        } elseif ($method === 'PUT' || $method === 'PATCH') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $_GET['id.eq'] ?? $_GET['id'] ?? $input['id'] ?? null;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing record ID for update']);
                exit;
            }

            unset($input['id']);
            $setClause = [];
            $params = [];

            foreach ($input as $col => $val) {
                $setClause[] = "`$col` = ?";
                $params[] = $val;
            }

            $params[] = $id;

            $sql = "UPDATE `$table` SET " . implode(', ', $setClause) . " WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode([$stmt->fetch()]);

        } elseif ($method === 'DELETE') {
            $id = $_GET['id.eq'] ?? $_GET['id'] ?? null;
            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing ID for delete']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM `$table` WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['success' => true]);
        }
    } catch (\PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>