const nodemailer = require('nodemailer');
// 1. SAFE LOAD: This file is ignored by Git, keeping your password off GitHub.
let creds;
try {
    creds = require('./creds');
} catch (e) {
    console.error("Credentials file missing! Emails will not be sent.");
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!creds) {
        return res.status(500).json({ error: 'Server misconfigured: Credentials missing.' });
    }

    const { name, email, phone, subject, message } = req.body;

    // Use a stable Vercel URL for the logo to ensure it shows in Gmail
    const baseUrl = "https://mark-overseas.vercel.app";

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            .email-container { max-width: 600px; margin: 20px auto; font-family: 'Segoe UI', Arial, sans-serif; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e0e0e0; }
            .header { background: #08af08; padding: 30px; text-align: center; color: white; }
            .header img { max-width: 140px; margin-bottom: 10px; }
            .gif-container { text-align: center; padding: 20px; background-color: #f9fafb; border-bottom: 1px solid #eee; }
            .gif-container img { width: 80px; }
            .content { padding: 30px; color: #333; }
            .info-table { width: 100%; border-collapse: collapse; }
            .info-table td { padding: 12px; border-bottom: 1px solid #eeeeee; }
            .label { font-weight: bold; color: #08af08; width: 30%; }
            .message-box { background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 5px solid #08af08; white-space: pre-wrap; }
            .footer { padding: 20px; text-align: center; font-size: 11px; color: #999; }
        </style>
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f4f4f4;">
        <div class="email-container">
            <div class="header">
                <img src="${baseUrl}/images/mark-logo.png" alt="Mark Overseas Logo">
                <h1 style="margin:0; font-size: 22px;">New Website Inquiry</h1>
            </div>

            <div class="gif-container">
                <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHYwb2ZmM3Zud2d6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6ZzR6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKpxO0gS9sV4j1e/giphy.gif" alt="Inquiry">
            </div>

            <div class="content">
                <table class="info-table">
                    <tr><td class="label">Name</td><td>${name}</td></tr>
                    <tr><td class="label">Email</td><td><a href="mailto:${email}" style="color: #08af08;">${email}</a></td></tr>
                    <tr><td class="label">Phone</td><td>${phone}</td></tr>
                    <tr><td class="label">Subject</td><td>${subject}</td></tr>
                </table>

                <div class="message-box"><strong>Message:</strong><br>${message}</div>
            </div>

            <div class="footer">
                <p>Sent from Mark Overseas Website Administration</p>
                <p>&copy; 2026 Mark Overseas All Rights Reserved</p>
            </div>
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

    const mailOptions = {
        from: `Mark Overseas Website <${creds.user}>`,
        to: creds.user,
        replyTo: email,
        subject: `[Web Inquiry] ${subject} - from ${name}`,
        html: emailHtml
    };

    try {
        await transporter.sendMail(mailOptions);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
