const nodemailer = require('nodemailer');
let creds;

// Try to load local credentials if they exist (for Zip deployment)
try {
    creds = require('./creds');
} catch (e) {
    // Fallback to Environment Variables (for Vercel/GitHub deployment)
    creds = {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    };
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!creds.user || !creds.pass) {
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin:0; font-size: 20px;">NEW INQUIRY: ${subject}</h1>
            </div>
            <div class="content">
                <div class="field"><span class="label">Client Name:</span><span class="value">${name}</span></div>
                <div class="field"><span class="label">Email Address:</span><span class="value"><a href="mailto:${email}" style="color: #08af08; text-decoration: none;">${email}</a></span></div>
                <div class="field"><span class="label">Phone Number:</span><span class="value">${phone}</span></div>
                <div class="field"><span class="label">Subject Line:</span><span class="value">${subject}</span></div>
                <div class="message-box">
                    <span class="label">Message:</span>
                    <div class="value" style="white-space: pre-wrap;">${message}</div>
                </div>
            </div>
            <div class="footer"><p>&copy; 2026 Mark Overseas - All Rights Reserved</p></div>
        </div>
    </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: creds.user,
            pass: creds.pass
        }
    });

    try {
        await transporter.sendMail({
            from: `"Website Inquiry" <${creds.user}>`,
            to: creds.user,
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
