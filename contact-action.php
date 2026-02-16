<?php
/**
 * 🚀 UNIVERSAL CLOUD BRIDGE (ZERO-SECRETS)
 * Hosting Independent. Works on Vercel (via proxy), cPanel, & more.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. PUBLIC FIREBASE PARAMS (Safe for Code)
$FB_KEY = "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0";
$FB_PID = "mark-overseas";

// 2. DATA PARSING
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) exit(json_encode(['success' => false, 'error' => 'No Data']));

$name = strip_tags($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = strip_tags($data['phone']);
$subject = strip_tags($data['subject'] ?? 'Website Inquiry');
$message = nl2br(strip_tags($data['message']));
$origin = $_SERVER['HTTP_REFERER'] ?? 'unknown';

try {
    // 3. 🛡️ FETCH SMTP FROM FIREBASE CLOUD (DYNAMIC)
    function fb_fetch($url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res, true);
    }

    $config_url = "https://firestore.googleapis.com/v1/projects/$FB_PID/databases/(default)/documents/config/smtp?key=$FB_KEY";
    $config = fb_fetch($config_url);

    if (!isset($config['fields']['user']['stringValue'])) {
        echo json_encode(['success' => false, 'error' => 'Cloud Config Missing. Use the Cloud Initializer tool.']);
        exit;
    }

    $USER_SMTP = $config['fields']['user']['stringValue'];
    $PASS_SMTP = $config['fields']['pass']['stringValue'];

    // 4. SAVE INQUIRY TO FIREBASE
    $save_url = "https://firestore.googleapis.com/v1/projects/$FB_PID/databases/(default)/documents/inquiries?key=$FB_KEY";
    $payload = json_encode([
        'fields' => [
            'name' => ['stringValue' => $name],
            'email' => ['stringValue' => $email],
            'phone' => ['stringValue' => $phone],
            'subject' => ['stringValue' => $subject],
            'message' => ['stringValue' => $message],
            'authorizedDomain' => ['stringValue' => $origin],
            'createdAt' => ['timestampValue' => date('c')]
        ]
    ]);

    $ch = curl_init($save_url);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    curl_close($ch);

    // 5. SEND EMAIL via GMAIL SMTP (NO SERVER DEPENDENCY)
    function smtp_send($to, $sub, $body, $user, $pass, $reply) {
        $socket = @fsockopen("ssl://smtp.gmail.com", 465, $errno, $errstr, 15);
        if ($socket) {
            $cmds = ["EHLO mark.com" => 250, "AUTH LOGIN" => 334, base64_encode($user) => 334, base64_encode($pass) => 235, "MAIL FROM: <$user>" => 250, "RCPT TO: <$user>" => 250, "DATA" => 354];
            foreach ($cmds as $cmd => $code) {
                fputs($socket, $cmd . "\r\n");
                $r = fgets($socket, 1024);
                if ((int)substr($r, 0, 3) !== $code) { fclose($socket); return false; }
            }
            fputs($socket, "Subject: $sub\r\nTo: $user\r\nFrom: Mark Overseas <$user>\r\nReply-To: $reply\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n.\r\n");
            fgets($socket, 1024);
            fputs($socket, "QUIT\r\n");
            fclose($socket);
            return true;
        }
        return false;
    }

    $html = "<h2>New Lead</h2><p><strong>From:</strong> $name ($email)</p><p>$message</p>";
    if (smtp_send($USER_SMTP, "[New Inquiry] $subject", $html, $USER_SMTP, $PASS_SMTP, $email)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'SMTP Failed']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'System Error']);
}
?>
