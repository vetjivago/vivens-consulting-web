<?php
require_once 'crud_helper.php';

// Relatórios pode requerer lógicas específicas, mas usaremos crud_helper por enquanto
handle_crud('reports', $pdo, $jwt_secret);
?>