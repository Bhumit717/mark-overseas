const nodemailer = require('nodemailer');
const creds = require('./creds');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 🛡️ SERVER-SIDE DOMAIN VERIFICATION
    const origin = req.headers.origin || req.headers.referer || "unknown";
    let cleanOrigin = origin.replace(/^https?:\/\//, '').split('/')[0];
    cleanOrigin = cleanOrigin.split(':')[0]; // Remove port for matching

    // Check if the domain is in our authorized list
    const isAllowed = creds.allowedDomains.some(d => cleanOrigin.includes(d));
    if (!isAllowed && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: `Domain Restricted: ${cleanOrigin}` });
    }

    const { name, email, phone, subject, message } = req.body;

    // 1. SAVE TO FIRESTORE (REST API)
    // Domain is passed as a field so the database can verify it in its RULES
    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiries?key=${creds.firebaseConfig.apiKey}`;

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
                    authorizedDomain: { stringValue: cleanOrigin },
                    createdAt: { timestampValue: new Date().toISOString() }
                }
            })
        });
    } catch (e) {
        console.error("DB Error:", e);
        // Don't stop here, but notify the log
        return res.status(500).json({ error: "Database Connection Failed: " + e.message });
    }

    // 2. SMTP NOTIFICATION
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: creds.user, pass: creds.pass }
    });

    try {
        await transporter.sendMail({
            from: `"Mark Overseas" <${creds.user}>`,
            to: creds.user,
            replyTo: email,
            subject: `[Mark] ${subject} from ${name}`,
            html: `<h3>New Message</h3><p><strong>Sender:</strong> ${name}</p><p>${message}</p>`
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(200).json({ success: true, warning: 'Sent to DB' });
    }
}
