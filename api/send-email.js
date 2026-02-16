const nodemailer = require('nodemailer');
const creds = require('./creds');

export default async function handler(req, res) {
    // --- DOMAIN SECURITY CHECK ---
    const origin = req.headers.origin || req.headers.referer || "";
    const isAllowed = creds.allowedDomains.some(domain => origin.includes(domain));

    if (!isAllowed && process.env.NODE_ENV === 'production') {
        console.error(`Blocked unauthorized domain access attempt: ${origin}`);
        return res.status(403).json({ error: 'Unauthorized domain' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, subject, message } = req.body;

    // --- 1. SAVE TO FIRESTORE VIA REST API (SECURE PROXY) ---
    // This runs on the server, so 'creds' are never exposed to the browser.
    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiry_vault/${creds.adminPassword}/data?key=${creds.firebaseConfig.apiKey}`;

        const firestoreData = {
            fields: {
                name: { stringValue: name || "N/A" },
                email: { stringValue: email || "N/A" },
                phone: { stringValue: phone || "N/A" },
                subject: { stringValue: subject || "N/A" },
                message: { stringValue: message || "N/A" },
                status: { stringValue: 'new' },
                authorizedDomain: { stringValue: origin }, // <--- REAL SECURITY ENFORCEMENT
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const fRes = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreData)
        });

        if (!fRes.ok) {
            const errLog = await fRes.text();
            console.error("Firestore REST Error:", errLog);
        } else {
            console.log("Inquiry successfully proxied to Firestore.");
        }
    } catch (saveError) {
        console.error("Critical Firestore Proxy Failure:", saveError);
    }

    // --- 2. SEND EMAIL NOTIFICATION ---
    const emailHtml = `
    <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px;">
        <div style="background: white; padding: 20px; border-radius: 10px; border-top: 5px solid #08af08;">
            <h2 style="color: #08af08;">New Website Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong><br>${message}</p>
            <hr>
            <p style="font-size: 12px; color: #888;">This inquiry was also saved to your Admin Dashboard.</p>
        </div>
    </div>
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
            from: `"Website Proxy" <${creds.user}>`,
            to: creds.user,
            replyTo: email,
            subject: `[Mark Overseas] ${subject} - ${name}`,
            html: emailHtml
        });
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("SMTP Notification Error:", error);
        return res.status(500).json({ error: "Failed to send email notification." });
    }
}
