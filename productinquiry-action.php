<?php
/**
 * PRODUCT INQUIRY BRIDGE (Mobile-Perfect Theme)
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

$name = strip_tags($data['name'] ?? 'Unknown');
$product = strip_tags($data['productname'] ?? 'Product');
$email = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
$phone = strip_tags($data['phone'] ?? '');
$message = nl2br(strip_tags($data['message'] ?? ''));

$email_html = "
<!DOCTYPE html>
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body { font-family: sans-serif; margin: 0; padding: 0; background: #f8fafc; }
        .wrapper { width: 100%; padding: 20px 0; }
        .content { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; }
        .header { background: #08af08; padding: 25px; text-align: center; color: white; }
        .body { padding: 20px; color: #334155; }
        .item { margin-bottom: 20px; padding-bottom: 8px; border-bottom: 1px solid #f1f5f9; }
        .label { font-size: 11px; color: #08af08; font-weight: bold; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 16px; color: #0f172a; }
        .msg-box { background: #fdfdfd; padding: 15px; border-radius: 6px; border: 1px dashed #e2e8f0; margin-top: 15px; }
        @media screen and (max-width: 600px) { .wrapper { padding: 10px; } }
    </style>
</head>
<body>
    <div class='wrapper'>
        <div class='content'>
            <div class='header'><h1>Product Inquiry</h1></div>
            <div class='body'>
                <div class='item'><div class='label'>Product Name</div><div class='value'><strong>$product</strong></div></div>
                <div class='item'><div class='label'>Client Name</div><div class='value'>$name</div></div>
                <div class='item'><div class='label'>Email Address</div><div class='value'>$email</div></div>
                <div class='item'><div class='label'>Phone Number</div><div class='value'>$phone</div></div>
                <div class='msg-box'>
                    <div class='label'>Inquiry Details</div>
                    <div class='value'>$message</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>";

function send_smtp($to, $subject, $body, $creds) {
    // Robust multi-port retry logic
    $targets = [["ssl://smtp.gmail.com", 465], ["tls://smtp.gmail.com", 587]];
    foreach ($targets as $t) {
        $socket = @fsockopen($t[0], $t[1], $errno, $errstr, 10);
        if ($socket) {
            $commands = [
                "EHLO " . $_SERVER['HTTP_HOST'] => 250,
                "AUTH LOGIN" => 334,
                base64_encode($creds['user']) => 334,
                base64_encode($creds['pass']) => 235,
                "MAIL FROM: <{$creds['user']}>" => 250,
                "RCPT TO: <$to>" => 250,
                "DATA" => 354,
                "Subject: $subject\r\nTo: $to\r\nFrom: Mark Overseas <{$creds['user']}>\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n." => 250,
                "QUIT" => 221
            ];
            foreach ($commands as $cmd => $code) {
                fputs($socket, $cmd . "\r\n");
                if ((int)substr(fgets($socket, 1024), 0, 3) !== $code) { fclose($socket); continue 2; }
            }
            fclose($socket);
            return true;
        }
    }
    return false;
}

if (send_smtp($creds['to'], "Inquiry for $product - $name", $email_html, $creds)) {
    echo json_encode(['success' => true]);
} else {
    $headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: Mark Overseas <{$creds['user']}>";
    if (mail($creds['to'], "[Product] $product", $email_html, $headers)) {
        echo json_encode(['success' => true, 'note' => 'fallback']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delivery failed.']);
    }
}
?>
