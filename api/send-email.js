const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const creds = {
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas",
        // 🔐 Temporary fallback for auto-setup
        initUser: 'markoverseas28@gmail.com',
        initPass: 'aopp wbdc ykky txwl'
    };

    const { name, email, phone, subject, message } = req.body;
    const origin = req.headers.origin || req.headers.referer || "unknown";

    try {
        const configUrl = `https://firestore.googleapis.com/v1/projects/${creds.projectId}/databases/(default)/documents/config/smtp?key=${creds.apiKey}`;

        // 1. 🛡️ FETCH FROM CLOUD
        let configRes = await fetch(configUrl);
        let configData = await configRes.json();

        // 🤖 AUTO-SETUP: If document is missing, create it automatically!
        if (!configData.fields) {
            console.log("Detecting missing config... Performing Auto-Setup.");
            await fetch(configUrl, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fields: {
                        user: { stringValue: creds.initUser },
                        pass: { stringValue: creds.initPass }
                    }
                })
            });
            // Re-fetch after creation
            configRes = await fetch(configUrl);
            configData = await configRes.json();
        }

        const GMAIL_USER = configData.fields.user.stringValue;
        const GMAIL_PASS = configData.fields.pass.stringValue;

        // 2. SAVE INQUIRY
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

        // 3. SEND EMAIL
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
        return res.status(500).json({ error: "System Error: Please ensure Firestore Rules are set to allow read/write on 'config/smtp'." });
    }
}
