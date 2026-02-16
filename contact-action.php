<?php
/**
 * ROBUST EMAIL BRIDGE (Mobile-Perfect Theme - No Logo)
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

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data']);
    exit;
}

$name = strip_tags($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = strip_tags($data['phone']);
$subject = strip_tags($data['subject']);
$message = nl2br(strip_tags($data['message']));

// MOBILE-PERFECT HTML THEME (No Logo Version)
$email_html = "
<!DOCTYPE html>
<html>
<head>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background: #f4f7f6; }
        .wrapper { width: 100%; padding: 20px 0; }
        .content { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e1e4e8; }
        .header { background: #08af08; padding: 25px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .body { padding: 20px; color: #444; }
        .item { margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #f0f0f0; }
        .label { font-size: 11px; color: #08af08; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 15px; color: #222; word-break: break-all; }
        .msg-box { background: #f9fbfb; padding: 15px; border-radius: 6px; border-left: 4px solid #08af08; margin-top: 10px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
        @media screen and (max-width: 600px) {
            .wrapper { padding: 10px; }
            .header { padding: 15px; }
        }
    </style>
</head>
<body>
    <div class='wrapper'>
        <div class='content'>
            <div class='header'><h1>WEBSITE INQUIRY: $subject</h1></div>
            <div class='body'>
                <div class='item'><div class='label'>Client Name</div><div class='value'>$name</div></div>
                <div class='item'><div class='label'>Email Address</div><div class='value'>$email</div></div>
                <div class='item'><div class='label'>Phone Number</div><div class='value'>$phone</div></div>
                <div class='item'><div class='label'>Subject Line</div><div class='value'>$subject</div></div>
                <div class='msg-box'>
                    <div class='label'>Message Content</div>
                    <div class='value' style='font-size: 14px;'>$message</div>
                </div>
            </div>
            <div class='footer'>Sent from Mark Overseas Administration</div>
        </div>
    </div>
</body>
</html>";

function send_smtp($to, $subject, $body, $creds, $replyTo) {
    $hosts = ["ssl://smtp.gmail.com:465", "tls://smtp.gmail.com:587"];
    foreach ($hosts as $h) {
        $parts = explode(":", $h);
        $socket = @fsockopen($parts[0], $parts[1], $errno, $errstr, 10);
        if ($socket) {
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
                if ((int)substr($res, 0, 3) !== $code) { fclose($socket); continue 2; }
            }
            fclose($socket);
            return true;
        }
    }
    return false;
}

if (send_smtp($creds['to'], "[Mark Overseas] $subject - $name", $email_html, $creds, $email)) {
    echo json_encode(['success' => true]);
} else {
    $headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: Mark Overseas <{$creds['user']}>";
    if (mail($creds['to'], "[Fallback] $subject", $email_html, $headers)) {
        echo json_encode(['success' => true, 'note' => 'fallback']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Mail delivery failed.']);
    }
}
?>
