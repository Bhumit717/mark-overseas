const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 1. SECURE ENVIRONMENT CONFIGURATION
    // No secrets in code. These must be set in your Vercel Project Settings.
    const GMAIL_USER = process.env.GMAIL_USER;
    const GMAIL_PASS = process.env.GMAIL_PASS;
    const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;
    const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID;

    const origin = req.headers.origin || req.headers.referer || "unknown";
    const { name, email, phone, subject, message } = req.body;

    // 2. PROXY TO FIRESTORE (REST API)
    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/inquiries?key=${FIREBASE_API_KEY}`;

        await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    name: { stringValue: name || "N/A" },
                    email: { stringValue: email || "N/A" },
                    phone: { stringValue: phone || "N/A" },
                    subject: { stringValue: subject || "N/A" },
                    message: { stringValue: message || "N/A" },
                    authorizedDomain: { stringValue: origin.replace(/^https?:\/\//, '').split('/')[0] },
                    createdAt: { timestampValue: new Date().toISOString() }
                }
            })
        });
    } catch (e) {
        console.error("DB Error:", e);
    }

    // 3. SMTP NOTIFICATION
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_PASS }
    });

    try {
        await transporter.sendMail({
            from: `"Mark Overseas" <${GMAIL_USER}>`,
            to: GMAIL_USER,
            replyTo: email,
            subject: `[Website Inquiry] ${subject}`,
            html: `<h3>New Inquiry</h3><p><strong>From:</strong> ${name}</p><p>${message}</p>`
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(200).json({ success: true, warning: 'Saved to DB, notification pending.' });
    }
}
