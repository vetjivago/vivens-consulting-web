<?php
// jwt.php
function base64url_encode($data)
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data)
{
    return base64_decode(str_pad(strtr($data, '-_', '+/'), strlen($data) % 4, '=', STR_PAD_RIGHT));
}

function generate_jwt($payload, $secret)
{
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode($payload);

    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

function verify_jwt($jwt, $secret)
{
    $tokenParts = explode('.', $jwt);
    if (count($tokenParts) != 3)
        return false;

    $header = base64url_decode($tokenParts[0]);
    $payload = base64url_decode($tokenParts[1]);
    $signature_provided = $tokenParts[2];

    $base64UrlHeader = base64url_encode($header);
    $base64UrlPayload = base64url_encode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret, true);
    $base64UrlSignature = base64url_encode($signature);

    if ($signature_provided === $base64UrlSignature) {
        $payloadData = json_decode($payload, true);
        if (isset($payloadData['exp']) && $payloadData['exp'] < time()) {
            return false; // expired
        }
        return $payloadData;
    }
    return false;
}

function get_bearer_token()
{
    $headers = null;

    if (!empty($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (!empty($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["REDIRECT_HTTP_AUTHORIZATION"]);
    } elseif (!empty($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } elseif (!empty($_ENV['HTTP_AUTHORIZATION'])) {
        $headers = trim($_ENV["HTTP_AUTHORIZATION"]);
    } elseif (!empty($_ENV['REDIRECT_HTTP_AUTHORIZATION'])) {
        $headers = trim($_ENV["REDIRECT_HTTP_AUTHORIZATION"]);
    }

    if (empty($headers)) {
        $requestHeaders = null;
        if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
        } elseif (function_exists('getallheaders')) {
            $requestHeaders = getallheaders();
        }
        if (is_array($requestHeaders)) {
            $requestHeaders = array_change_key_case($requestHeaders, CASE_LOWER);
            if (!empty($requestHeaders['authorization'])) {
                $headers = trim($requestHeaders['authorization']);
            }
        }
    }

    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/i', $headers, $matches)) {
            return $matches[1];
        }
    }

    if (!empty($_GET['access_token'])) {
        return trim($_GET['access_token']);
    }
    if (!empty($_GET['token'])) {
        return trim($_GET['token']);
    }

    return null;
}

function auth_require($pdo, $secret)
{
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    $decoded = verify_jwt($token, $secret);
    if (!$decoded) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    return $decoded;
}
?>