<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    require_once 'crud_helper.php';
    $_GET['select'] = '*';
    $_GET['order'] = 'created_at';
    $_GET['orderDesc'] = 'true';
    $_SERVER['REQUEST_METHOD'] = 'GET';
    
    // create a dummy PDO
    require_once 'config.php';
    
    // bypass auth
    function auth_require_mock() {}
    
    // We cannot redefine auth_require easily, but let's just copy the GET logic
    $table = 'clients';
    $method = 'GET';
    
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
    
    echo "SUCCESS: " . json_encode($result);

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . " on line " . $e->getLine() . " in " . $e->getFile();
}
