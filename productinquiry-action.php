<?php
/**
 * SECURE PRODUCT INQUIRY BRIDGE
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. LOAD PRIVATE CONFIG
$creds_file = __DIR__ . '/php/gmail_credentials.php';
if (!file_exists($creds_file)) {
    echo '<div class="alert alert-danger">Error: Config missing.</div>';
    exit;
}
$creds = include($creds_file);

$data = $_POST;
if (empty($data)) $data = json_decode(file_get_contents('php://input'), true);

$name = htmlspecialchars($data['name'] ?? 'Unknown');
$product = htmlspecialchars($data['productname'] ?? 'Product');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars($data['phone'] ?? '');
$message = nl2br(htmlspecialchars($data['message'] ?? ''));

function send_gmail_smtp($to, $subject, $body, $creds) {
    // Same robust SMTP socket handler...
    $socket = fsockopen("ssl://smtp.gmail.com", 465, $errno, $errstr, 15);
    if (!$socket) return false;
    $commands = [
        "EHLO " . $_SERVER['HTTP_HOST'] => 250,
        "AUTH LOGIN" => 334,
        base64_encode($creds['user']) => 334,
        base64_encode($creds['pass']) => 235,
        "MAIL FROM: <{$creds['user']}>" => 250,
        "RCPT TO: <$to>" => 250,
        "DATA" => 354,
        "Subject: $subject\r\nTo: $to\r\nFrom: Product Inquiry <{$creds['user']}>\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n." => 250,
        "QUIT" => 221
    ];
    foreach ($commands as $cmd => $code) {
        fputs($socket, $cmd . "\r\n");
        $res = fgets($socket, 1024);
        if ((int)substr($res, 0, 3) !== $code) return false;
    }
    fclose($socket);
    return true;
}

$body = "<h2>Product Inquiry: $product</h2><p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Phone:</strong> $phone</p><hr><p><strong>Message:</strong></p><p>$message</p>";

if (send_gmail_smtp($creds['to'], "Product Inquiry: $product", $body, $creds)) {
    echo '<div class="alert alert-success"><strong>Success!</strong> Inquiry sent.</div>';
} else {
    echo '<div class="alert alert-danger"><strong>Error!</strong> Could not send email.</div>';
}
?>
