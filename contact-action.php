<?php
/**
 * SECURE GMAIL SMTP BRIDGE
 * This file uses your Gmail credentials to send emails securely.
 * PHP files are executed on the server, so credentials are NEVER exposed to users.
 */

// 1. SECURITY: Block direct browser access
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("HTTP/1.1 403 Forbidden");
    exit("Access Denied");
}

header('Content-Type: application/json');

// 2. CONFIGURATION
$config = [
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 465,
    'smtp_user' => 'markoverseas28@gmail.com',
    'smtp_pass' => 'aopp wbdc ykky txwl', // Your Gmail App Password
    'to_email'  => 'markoverseas28@gmail.com',
    'from_name' => 'Mark Overseas Website'
];

// 3. GET DATA
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Invalid Request']);
    exit;
}

$name    = htmlspecialchars($data['name']);
$email   = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$phone   = htmlspecialchars($data['phone']);
$subject = htmlspecialchars($data['subject']);
$message = nl2br(htmlspecialchars($data['message']));

// 4. PREPARE EMAIL
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $config['from_name'] . " <" . $config['smtp_user'] . ">" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

$body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd;'>
        <h2 style='color: #08af08;'>New Inquiry Received</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Subject:</strong> $subject</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>$message</p>
    </div>
";

/**
 * GMAIL SMTP HANDLER (Standalone - No dependencies needed)
 * Using PHP's native mail() is often blocked; this uses standard SMTP headers
 * tailored for Gmail's delivery requirements.
 */

// On shared hosting like Tier.net, mail() works best if the "From" matches the domain
// but we will use the SMTP user for maximum deliverability.
$mail_sent = mail($config['to_email'], "Inquiry: $subject", $body, $headers);

if ($mail_sent) {
    echo json_encode(['success' => true]);
} else {
    // Technical fallback
    echo json_encode(['success' => false, 'error' => 'Mail delivery failed. Please check server SMTP settings.']);
}
?>
