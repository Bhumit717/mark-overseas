const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_PASS = process.env.GMAIL_PASS;

    if (!GMAIL_USER || !GMAIL_PASS) {
        return res.status(500).json({ error: 'Server misconfigured: Email credentials missing.' });
    }

    const { name, email, phone, subject, message } = req.body;

    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; background-color: #f7f7f7; }
            .container { max-width: 100%; width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; overflow: hidden; }
            .header { background-color: #08af08; padding: 20px; text-align: center; color: #ffffff; }
            .header h1 { margin: 0; font-size: 20px; }
            .content { padding: 20px; color: #333333; line-height: 1.5; }
            .field { margin-bottom: 15px; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; }
            .label { font-weight: bold; color: #08af08; display: block; margin-bottom: 5px; font-size: 14px; }
            .value { font-size: 16px; word-break: break-all; }
            .message-box { background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #08af08; margin-top: 20px; }
            .footer { background-color: #f1f1f1; padding: 15px; text-align: center; color: #777777; font-size: 12px; }
            @media only screen and (max-width: 480px) {
                .content { padding: 15px; }
                .header h1 { font-size: 18px; }
                .value { font-size: 15px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>NEW INQUIRY: ${subject}</h1>
            </div>
            <div class="content">
                <div class="field">
                    <span class="label">Client Name:</span>
                    <span class="value">${name}</span>
                </div>
                <div class="field">
                    <span class="label">Email Address:</span>
                    <span class="value"><a href="mailto:${email}" style="color: #08af08; text-decoration: none;">${email}</a></span>
                </div>
                <div class="field">
                    <span class="label">Phone Number:</span>
                    <span class="value">${phone}</span>
                </div>
                <div class="field">
                    <span class="label">Subject Line:</span>
                    <span class="value">${subject}</span>
                </div>
                <div class="message-box">
                    <span class="label">Message:</span>
                    <div class="value" style="white-space: pre-wrap;">${message}</div>
                </div>
            </div>
            <div class="footer">
                <p>&copy; 2026 Mark Overseas - All Rights Reserved</p>
                <p>Website Admin Notification</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: `"Website Inquiry" <${GMAIL_USER}>`,
            to: GMAIL_USER,
            replyTo: email,
            subject: `[Mark Overseas] ${subject} - from ${name}`,
            html: emailHtml
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("SMTP Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
