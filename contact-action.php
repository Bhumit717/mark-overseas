<?php
/**
 * SECURE SMTP BRIDGE for Mark Overseas
 * This file stays on the server. Clients/Users CANNOT see these credentials.
 */

header('Content-Type: application/json');

// 1. CONFIGURATION (STRICTLY SECURE)
$config = [
    'smtp_user' => 'markoverseas28@gmail.com',
    'smtp_pass' => 'aopp wbdc ykky txwl', // App Password
    'to_email'   => 'markoverseas28@gmail.com',
    'from_name'  => 'Mark Overseas Website'
];

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

// 3. PREPARE EMAIL
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: " . $config['from_name'] . " <" . $config['smtp_user'] . ">" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

$email_body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;'>
        <h2 style='color: #08af08;'>New Website Inquiry</h2>
        <p><strong>Name:</strong> $name</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Phone:</strong> $phone</p>
        <p><strong>Subject:</strong> $subject</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>$message</p>
    </div>
";

// 4. SEND (Using PHP Mail - Tier.net supports this by default)
if (mail($config['to_email'], "New Inquiry: $subject", $email_body, $headers)) {
    echo json_encode(['success' => true]);
} else {
    // If standard mail fails, SMTP would be the fallback, 
    // but Tier.net usually allows mail() if the domain is correctly pointed.
    echo json_encode(['success' => false, 'error' => 'Mail server error']);
}
?>
