<?php
/**
 * PREMIUM PRODUCT INQUIRY BRIDGE
 * Simplified Mobile Theme
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

$creds_file = __DIR__ . '/php/gmail_credentials.php';
if (!file_exists($creds_file)) {
    echo json_encode(['success' => false, 'error' => 'Config missing']);
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

$email_html = "
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f7f7f7; }
        .container { max-width: 100%; width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; }
        .header { background-color: #08af08; padding: 20px; text-align: center; color: #ffffff; }
        .header img { max-width: 120px; height: auto; display: block; margin: 0 auto 10px; }
        .header h1 { margin: 0; font-size: 20px; }
        .content { padding: 20px; color: #333333; line-height: 1.5; }
        .field { margin-bottom: 15px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; }
        .label { font-weight: bold; color: #08af08; display: block; margin-bottom: 5px; font-size: 14px; }
        .value { font-size: 16px; word-break: break-all; }
        .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #08af08; margin-top: 20px; }
        .footer { background-color: #f1f1f1; padding: 15px; text-align: center; color: #777777; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <img src='https://mark-overseas.com/images/mark-logo.png' alt='Mark Overseas'>
            <h1>New Product Inquiry</h1>
        </div>
        <div class='content'>
            <div class='field'><span class='label'>Product:</span><span class='value' style='font-weight:bold;'>$product</span></div>
            <div class='field'><span class='label'>Client Name:</span><span class='value'>$name</span></div>
            <div class='field'><span class='label'>Email:</span><span class='value'><a href='mailto:$email' style='color: #08af08; text-decoration: none;'>$email</a></span></div>
            <div class='field'><span class='label'>Phone:</span><span class='value'>$phone</span></div>
            <div class='message-box'><span class='label'>Inquiry Details:</span><div class='value'>$message</div></div>
        </div>
        <div class='footer'><p>&copy; 2026 Mark Overseas</p></div>
    </div>
</body>
</html>";

function send_gmail_smtp($to, $subject, $body, $creds) {
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

if (send_gmail_smtp($creds['to'], "[Product Inquiry] $product - $name", $email_html, $creds)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Delivery failed']);
}
?>
