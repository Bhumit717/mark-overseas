const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 1. PUBLIC FIREBASE CONFIG
    // These are safe to stay in code as they are public identifiers.
    const creds = {
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas"
    };

    const { name, email, phone, subject, message } = req.body;
    const origin = req.headers.origin || req.headers.referer || "unknown";

    try {
        // 2. 🛡️ FETCH SMTP SECRETS FROM FIREBASE (ZERO SECRETS IN FILE)
        // We fetch from the 'config/smtp' document.
        const configUrl = `https://firestore.googleapis.com/v1/projects/${creds.projectId}/databases/(default)/documents/config/smtp?key=${creds.apiKey}`;
        const configRes = await fetch(configUrl);
        const configData = await configRes.json();

        if (!configData.fields) {
            return res.status(500).json({ error: "SMTP secrets not found in Firestore 'config/smtp'" });
        }

        const GMAIL_USER = configData.fields.user.stringValue;
        const GMAIL_PASS = configData.fields.pass.stringValue;

        // 3. SAVE TO FIREBASE
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${creds.projectId}/databases/(default)/documents/inquiries?key=${creds.apiKey}`;
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
                    authorizedDomain: { stringValue: origin },
                    createdAt: { timestampValue: new Date().toISOString() }
                }
            })
        });

        // 4. SEND EMAIL using the fetched secrets
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: GMAIL_USER, pass: GMAIL_PASS }
        });

        await transporter.sendMail({
            from: `"Mark Overseas" <${GMAIL_USER}>`,
            to: GMAIL_USER,
            replyTo: email,
            subject: `[Mark] ${subject} from ${name}`,
            html: `<h3>New Message</h3><p><strong>From:</strong> ${name}</p><p>${message}</p>`
        });

        return res.status(200).json({ success: true });
    } catch (e) {
        console.error("Transmission error:", e);
        return res.status(500).json({ error: "System error: Configuration required in Firestore." });
    }
}
