<?php
require_once '../config.php';

// Danger: Remove this file after running it once in production!
echo "<h1>Setup Database for AVA</h1>";

$sql = file_get_contents('schema.sql');

try {
    $pdo->exec($sql);
    echo "<p style='color:green;'>Tables created and dummy data inserted successfully!</p>";
} catch (\PDOException $e) {
    echo "<p style='color:red;'>Error executing SQL: " . $e->getMessage() . "</p>";
}
?>
