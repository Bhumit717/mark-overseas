<?php
/**
 * 🚀 UNIVERSAL HOSTING-INDEPENDENT BRIDGE
 * Fetches SMTP from Firebase and handles emails/database logic.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. PUBLIC FIREBASE IDENTIFIERS
$FB_KEY = "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0";
$FB_PID = "mark-overseas";

// 2. GET SUBMITTED DATA
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

$name = strip_tags($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = strip_tags($data['phone']);
$subject = strip_tags($data['subject']);
$message = nl2br(strip_tags($data['message']));
$origin = $_SERVER['HTTP_REFERER'] ?? 'unknown';

try {
    // 3. 🛡️ FETCH SMTP FROM FIREBASE (SECURE CLOUD FLOW)
    // We fetch from 'config/smtp' document. 
    function fetch_fb($url) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $res = curl_exec($ch);
        curl_close($ch);
        return json_decode($res, true);
    }

    $config_url = "https://firestore.googleapis.com/v1/projects/$FB_PID/databases/(default)/documents/config/smtp?key=$FB_KEY";
    $config = fetch_fb($config_url);

    if (!isset($config['fields']['user']['stringValue'])) {
        echo json_encode(['success' => false, 'error' => 'SMTP Cloud Config missing. Create config/smtp in Firestore.']);
        exit;
    }

    $GMAIL_USER = $config['fields']['user']['stringValue'];
    $GMAIL_PASS = $config['fields']['pass']['stringValue'];

    // 4. SAVE INQUIRY TO FIREBASE
    $save_url = "https://firestore.googleapis.com/v1/projects/$FB_PID/databases/(default)/documents/inquiries?key=$FB_KEY";
    $save_payload = json_encode([
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
    curl_setopt($ch, CURLOPT_POSTFIELDS, $save_payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_exec($ch);
    curl_close($ch);

    // 5. SEND EMAIL VIA SMTP
    function send_smtp_direct($to, $subject, $body, $user, $pass, $replyTo) {
        $socket = @fsockopen("ssl://smtp.gmail.com", 465, $errno, $errstr, 15);
        if ($socket) {
            $cmds = [
                "EHLO mark-overseas.com" => 250,
                "AUTH LOGIN" => 334,
                base64_encode($user) => 334,
                base64_encode($pass) => 235,
                "MAIL FROM: <$user>" => 250,
                "RCPT TO: <$user>" => 250,
                "DATA" => 354,
                "Subject: $subject\r\nTo: $user\r\nFrom: Mark Overseas Site <$user>\r\nReply-To: $replyTo\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n." => 250,
                "QUIT" => 221
            ];
            foreach ($cmds as $cmd => $code) {
                fputs($socket, $cmd . "\r\n");
                $r = fgets($socket, 1024);
                if ((int)substr($r, 0, 3) !== $code) { fclose($socket); return false; }
            }
            fclose($socket);
            return true;
        }
        return false;
    }

    $email_html = "<h2>New Website Message</h2><p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Message:</strong><br>$message</p>";
    if (send_smtp_direct($GMAIL_USER, "[New Inquiry] $subject", $email_html, $GMAIL_USER, $GMAIL_PASS, $email)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => true, 'warning' => 'Saved to DB, email failed. Check App Password.']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
