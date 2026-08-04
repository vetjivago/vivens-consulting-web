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

function parseSelect($str) {
    if (!$str || $str === '*') return ['*' => true];
    $str = preg_replace('/\s+/', '', $str);
    $pos = 0;
    return parseSelectRecursive($str, $pos);
}

function parseSelectRecursive($str, &$pos) {
    $fields = [];
    $currentField = '';
    $currentAlias = null;

    $flushField = function() use (&$fields, &$currentField, &$currentAlias) {
        if ($currentField !== '') {
            $key = $currentAlias ? $currentAlias : $currentField;
            if (!isset($fields[$key])) {
                $fields[$key] = true;
            }
            if ($currentAlias) {
                $fields[$key] = ['__target' => $currentField];
            }
            $currentField = '';
            $currentAlias = null;
        }
    };

    while ($pos < strlen($str)) {
        $char = $str[$pos];
        if ($char === ',') {
            $flushField();
            $pos++;
        } elseif ($char === '(') {
            $key = $currentAlias ? $currentAlias : $currentField;
            $target = $currentField;
            $currentField = '';
            $currentAlias = null;
            $pos++;
            $subFields = parseSelectRecursive($str, $pos);
            $subFields['__target'] = $target;
            $fields[$key] = $subFields;
        } elseif ($char === ')') {
            $flushField();
            $pos++;
            return $fields;
        } elseif ($char === ':') {
            $currentAlias = $currentField;
            $currentField = '';
            $pos++;
        } else {
            $currentField .= $char;
            $pos++;
        }
    }
    $flushField();
    return $fields;
}

function fetchRelations($pdo, $row, $parsedSelect, $currentTable) {
    if (!$parsedSelect || !is_array($parsedSelect)) return $row;
    foreach ($parsedSelect as $key => $val) {
        if (is_array($val) && isset($val['__target'])) {
            $targetTable = $val['__target'];
            
            $singularTarget = rtrim($targetTable, 's');
            $fkCol1 = $singularTarget . '_id';
            
            $singularCurrent = rtrim($currentTable, 's');
            $fkCol2 = $singularCurrent . '_id';
            
            if (array_key_exists($fkCol1, $row) && $row[$fkCol1] !== null) {
                try {
                    $stmt = $pdo->prepare("SELECT * FROM `$targetTable` WHERE id = ?");
                    $stmt->execute([$row[$fkCol1]]);
                    $targetRow = $stmt->fetch(\PDO::FETCH_ASSOC);
                    
                    if ($targetRow) {
                        $row[$key] = fetchRelations($pdo, $targetRow, $val, $targetTable);
                    } else {
                        $row[$key] = null;
                    }
                } catch (\PDOException $e) {
                    $row[$key] = null;
                }
            } elseif (array_key_exists('id', $row)) {
                try {
                    $stmt = $pdo->prepare("SELECT * FROM `$targetTable` WHERE `$fkCol2` = ?");
                    $stmt->execute([$row['id']]);
                    $targetRows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
                    
                    if ($targetRows) {
                        $fetched = [];
                        foreach ($targetRows as $tr) {
                            $fetched[] = fetchRelations($pdo, $tr, $val, $targetTable);
                        }
                        $row[$key] = $fetched;
                    } else {
                        $row[$key] = [];
                    }
                } catch (\PDOException $e) {
                    $row[$key] = null;
                }
            }
        }
    }
    return $row;
}

function getTableColumns($pdo, $table) {
    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table`");
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    } catch (\PDOException $e) {
        return [];
    }
}

function handle_crud($table, $pdo, $jwt_secret)
{
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method !== 'GET') {
        auth_require($pdo, $jwt_secret);
    }
    header("Content-Type: application/json; charset=UTF-8");

    try {
        if ($method === 'GET') {
            $conditions = [];
            $params = [];
            $rawSelect = '*';

            $orderBy = "created_at DESC";
            if (isset($_GET['order'])) {
                $orderCol = preg_replace('/[^a-zA-Z0-9_]/', '', $_GET['order']);
                $orderDir = isset($_GET['orderDesc']) && $_GET['orderDesc'] === 'true' ? 'DESC' : 'ASC';
                if ($orderCol) {
                    $orderBy = "`$orderCol` $orderDir";
                }
            }

            foreach ($_GET as $key => $value) {
                if ($key === 'select') {
                    $rawSelect = $value;
                    continue;
                }
                if ($key === 'order' || $key === 'orderDesc' || $key === 'limit' || $key === 'single') {
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
            $sql = "SELECT * FROM `$table` $where ORDER BY $orderBy";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);

            $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
            $parsedSelect = parseSelect($rawSelect);
            
            $result = [];
            foreach ($rows as $row) {
                $result[] = fetchRelations($pdo, $row, $parsedSelect, $table);
            }
            
            echo json_encode($result);

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

            $validCols = getTableColumns($pdo, $table);
            if (!empty($validCols)) {
                $filteredInput = [];
                foreach ($input as $k => $v) {
                    if (in_array($k, $validCols)) {
                        $filteredInput[$k] = $v;
                    }
                }
                $input = $filteredInput;
            }

            $columns = array_keys($input);
            $placeholders = array_fill(0, count($columns), '?');

            $sql = "INSERT INTO `$table` (`" . implode("`, `", $columns) . "`) VALUES (" . implode(", ", $placeholders) . ")";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(array_values($input));

            $stmt = $pdo->prepare("SELECT * FROM `$table` WHERE id = ?");
            $stmt->execute([$input['id']]);
            $inserted = $stmt->fetch(\PDO::FETCH_ASSOC);
            echo json_encode([$inserted]);

        } elseif ($method === 'PUT' || $method === 'PATCH') {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $_GET['id.eq'] ?? $_GET['id'] ?? $input['id'] ?? null;

            if (!$id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing record ID for update']);
                exit;
            }

            unset($input['id']);

            $validCols = getTableColumns($pdo, $table);
            if (!empty($validCols)) {
                $filteredInput = [];
                foreach ($input as $k => $v) {
                    if (in_array($k, $validCols)) {
                        $filteredInput[$k] = $v;
                    }
                }
                $input = $filteredInput;
            }

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
            $updated = $stmt->fetch(\PDO::FETCH_ASSOC);
            echo json_encode([$updated]);

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