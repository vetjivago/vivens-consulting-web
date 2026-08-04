<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once 'config.php';
require_once 'jwt.php';

$token = JWT::encode(['id' => '1', 'email' => 'admin@admin.com', 'exp' => time() + 3600], $jwt_secret);

$ch = curl_init('https://mail.vivenslab.com/api/clients.php?select=*&order=created_at&orderDesc=true');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token
]);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP $httpcode\n";
echo "Response: $response\n";
