<?php
/**
 * ROBUST GMAIL SMTP BRIDGE
 * This file handles REAL SMTP authentication securely.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. LOAD PRIVATE CONFIG (Stays off GitHub)
$creds_file = __DIR__ . '/php/gmail_credentials.php';
if (!file_exists($creds_file)) {
    echo json_encode(['success' => false, 'error' => 'Configuration file missing. Please contact administrator.']);
    exit;
}
$creds = include($creds_file);

// 2. GET FORM DATA
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$name    = strip_tags($data['name']);
$email   = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone   = strip_tags($data['phone']);
$subject = strip_tags($data['subject']);
$message = nl2br(strip_tags($data['message']));

// 3. SMTP SOCKET LOGIC (Port 465 SSL)
function send_gmail_smtp($to, $subject, $body, $creds, $replyTo) {
    $timeout = 15;
    $smtp_host = "ssl://smtp.gmail.com";
    $smtp_port = 465;
    
    $socket = fsockopen($smtp_host, $smtp_port, $errno, $errstr, $timeout);
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

    foreach ($commands as $command => $expected_code) {
        fputs($socket, $command . "\r\n");
        $response = fgets($socket, 1024);
        if ((int)substr($response, 0, 3) !== $expected_code) {
            fclose($socket);
            return false;
        }
    }
    fclose($socket);
    return true;
}

$body = "<h2>New Website Inquiry</h2><p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Phone:</strong> $phone</p><hr><p><strong>Message:</strong></p><p>$message</p>";

// 4. EXECUTE
if (send_gmail_smtp($creds['to'], "Mark Overseas: $subject", $body, $creds, $email)) {
    echo json_encode(['success' => true]);
} else {
    // Fallback to mail()
    $headers = "MIME-Version: 1.0\r\nContent-type:text/html;charset=UTF-8\r\nFrom: Mark Overseas <{$creds['user']}>";
    if (mail($creds['to'], "Fallback Inquiry: $subject", $body, $headers)) {
        echo json_encode(['success' => true, 'note' => 'fallback']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Mail delivery failed.']);
    }
}
?>
