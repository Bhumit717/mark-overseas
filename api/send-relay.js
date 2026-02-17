const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { smtpPassword, mailOptions } = req.body;

    if (!smtpPassword || !mailOptions) {
        return res.status(400).json({ error: 'Missing configuration' });
    }

    // 1. Configure Transporter with Dynamic Password
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "markoverseas28@gmail.com",
            pass: smtpPassword
        }
    });

    try {
        // 2. Send Email
        const info = await transporter.sendMail({
            from: `"Mark Overseas" <markoverseas28@gmail.com>`,
            to: "markoverseas28@gmail.com",
            replyTo: mailOptions.replyTo,
            subject: mailOptions.subject,
            html: mailOptions.html
        });

        res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error("Relay Error:", error);
        res.status(500).json({ error: error.message });
    }
}
