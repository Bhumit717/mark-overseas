<?php
/**
 * PREMIUM GMAIL SMTP BRIDGE
 * This handles real SMTP authentication with a high-end email theme.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. LOAD PRIVATE CONFIG
$creds_file = __DIR__ . '/php/gmail_credentials.php';
if (!file_exists($creds_file)) {
    echo json_encode(['success' => false, 'error' => 'Config missing']);
    exit;
}
$creds = include($creds_file);

// 2. GET FORM DATA
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data']);
    exit;
}

$name    = htmlspecialchars($data['name']);
$email   = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars($data['phone']);
$subject = htmlspecialchars($data['subject']);
$message = nl2br(htmlspecialchars($data['message']));

// 3. PREMIUM HTML TEMPLATE
$email_html = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <style>
        .container { max-width: 600px; margin: 20px auto; font-family: sans-serif; background: #fff; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #08af08 0%, #058f05 100%); padding: 30px; text-align: center; color: white; }
        .header img { max-width: 150px; }
        .gif-cap { text-align: center; padding: 20px; background: #f9fafb; }
        .gif-cap img { width: 100px; border-radius: 50%; }
        .content { padding: 30px; color: #333; }
        .row { display: flex; border-bottom: 1px solid #eee; padding: 10px 0; }
        .label { font-weight: bold; color: #08af08; width: 35%; }
        .val { width: 65%; }
        .msg-box { background: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #08af08; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body style='background: #f4f4f4; padding: 10px;'>
    <div class='container'>
        <div class='header'>
            <img src='https://www.mark-overseas.com/images/mark-logo.png' alt='Mark Overseas'>
            <h1 style='margin:10px 0 0 0; font-size: 20px;'>New Inquiry Received</h1>
        </div>
        <div class='gif-cap'>
            <img src='https://cdn.dribbble.com/users/1537480/screenshots/7123498/media/25261175317789.GIF' alt='Notification'>
        </div>
        <div class='content'>
            <div class='row'><div class='label'>Name</div><div class='val'>$name</div></div>
            <div class='row'><div class='label'>Email</div><div class='val'>$email</div></div>
            <div class='row'><div class='label'>Phone</div><div class='val'>$phone</div></div>
            <div class='row'><div class='label'>Subject</div><div class='val'>$subject</div></div>
            <div class='msg-box'>
                <strong>Message:</strong><br>
                <p style='margin-top:10px;'>$message</p>
            </div>
        </div>
        <div class='footer'>
            &copy; 2026 Mark Overseas | Independent Agro Exporter
        </div>
    </div>
</body>
</html>";

// 4. SMTP SOCKET HANDLER
function send_gmail_smtp($to, $subject, $body, $creds, $replyTo) {
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
        "Subject: $subject\r\nTo: $to\r\nFrom: Mark Overseas <{$creds['user']}>\r\nReply-To: $replyTo\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n." => 250,
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

// 5. EXECUTE
if (send_gmail_smtp($creds['to'], "[Web] $subject - from $name", $email_html, $creds, $email)) {
    echo json_encode(['success' => true]);
} else {
    // Fallback
    $headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: Mark Overseas <{$creds['user']}>";
    if (mail($creds['to'], "[Web Fallback] $subject", $email_html, $headers)) {
        echo json_encode(['success' => true, 'note' => 'fallback']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Delivery failed']);
    }
}
?>
