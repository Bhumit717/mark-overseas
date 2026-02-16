const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 1. PUBLIC FIREBASE CONFIG (Protected by Domain Lock in Google Console)
    const FB_CONFIG = {
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas"
    };

    const { name, email, subject, message } = req.body;

    try {
        // 2. 🛡️ FETCH SMTP FROM FIREBASE (Zero Secrets in Code)
        // We fetch from a private "config" collection. 
        // HTTrack cannot see this URL because this code runs only on the Server.
        const configUrl = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/config/smtp?key=${FB_CONFIG.apiKey}`;
        const configRes = await fetch(configUrl);
        const configData = await configRes.json();

        if (!configData.fields) {
            return res.status(500).json({ error: "SMTP Not Configured in Firestore. Create config/smtp document." });
        }

        const GMAIL_USER = configData.fields.user.stringValue;
        const GMAIL_PASS = configData.fields.pass.stringValue;

        // 3. SAVE THE INQUIRY
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FB_CONFIG.projectId}/databases/(default)/documents/inquiries?key=${FB_CONFIG.apiKey}`;
        await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    name: { stringValue: name || "N/A" },
                    email: { stringValue: email || "N/A" },
                    subject: { stringValue: subject || "N/A" },
                    message: { stringValue: message || "N/A" },
                    createdAt: { timestampValue: new Date().toISOString() }
                }
            })
        });

        // 4. SEND EMAIL
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: GMAIL_USER, pass: GMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"Mark Overseas" <${GMAIL_USER}>`,
            to: GMAIL_USER,
            replyTo: email,
            subject: `[New Inquiry] ${subject}`,
            html: `<h3>New Message</h3><p><strong>From:</strong> ${name}</p><p>${message}</p>`
        });

        return res.status(200).json({ success: true });

    } catch (e) {
        console.error("Cloud Flow Error:", e);
        return res.status(500).json({ error: "System Error: Check Firestore 'config/smtp' document." });
    }
}
