<?php
/**
 * 🚀 UNIVERSAL PRODUCT INQUIRY BRIDGE
 * Zero-Config and Scraper-Proof.
 */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 1. LOAD SECURE CONFIG
$config = include(__DIR__ . '/php/config.php');

// 2. GET SUBMITTED DATA
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'No data']);
    exit;
}

$product = strip_tags($data['product_name'] ?? 'General Product');
$name = strip_tags($data['name']);
$email = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone = strip_tags($data['phone']);
$message = nl2br(strip_tags($data['message']));
$origin = $_SERVER['HTTP_REFERER'] ?? 'unknown';

try {
    // 3. SAVE TO FIREBASE
    $save_url = "https://firestore.googleapis.com/v1/projects/{$config['firebase']['projectId']}/databases/(default)/documents/inquiries?key={$config['firebase']['apiKey']}";
    $save_payload = json_encode([
        'fields' => [
            'name' => ['stringValue' => $name],
            'email' => ['stringValue' => $email],
            'phone' => ['stringValue' => $phone],
            'subject' => ['stringValue' => "Product: $product"],
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

    // 4. SEND EMAIL via SMTP
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
                "Subject: $subject\r\nTo: $user\r\nFrom: Mark Overseas <$user>\r\nReply-To: $replyTo\r\nMIME-Version: 1.0\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n" . $body . "\r\n." => 250,
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

    $email_html = "<h2>Product Inquiry: $product</h2><p><strong>Name:</strong> $name</p><p><strong>Email:</strong> $email</p><p><strong>Message:</strong><br>$message</p>";
    send_smtp_direct($config['to'], "[Product Inquiry] $product", $email_html, $config['user'], $config['pass'], $email);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Transmitting Error']);
}
?>
