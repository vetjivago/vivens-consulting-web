<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';
require_once 'crud_helper.php';

// Bypass auth function by redefining or mocking
if (!function_exists('auth_require')) {
    function auth_require() {}
}

$_SERVER['REQUEST_METHOD'] = 'GET';
$_GET['select'] = '*';
$_GET['order'] = 'created_at';
$_GET['orderDesc'] = 'true';

// Copy the GET logic from crud_helper.php
$table = 'clients';
try {
    $conditions = [];
    $params = [];
    $rawSelect = '*';

    $orderBy = "created_at DESC";
    
    $sql = "SELECT * FROM `$table` ORDER BY $orderBy";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    $parsedSelect = parseSelect($rawSelect);
    
    $result = [];
    foreach ($rows as $row) {
        $result[] = fetchRelations($pdo, $row, $parsedSelect, $table);
    }
    
    $json = json_encode($result);
    if ($json === false) {
        echo "JSON ENCODE ERROR: " . json_last_error_msg();
    } else {
        echo "SUCCESS JSON:\n";
        echo $json;
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
