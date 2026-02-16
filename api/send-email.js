const nodemailer = require('nodemailer');
const creds = require('./creds');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 1. DOMAIN SECURITY CHECK
    const origin = req.headers.origin || req.headers.referer || "";
    const isAllowed = creds.allowedDomains.some(domain => origin.includes(domain));

    if (!isAllowed && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Unauthorized domain access blocked.' });
    }

    const { name, email, phone, subject, message } = req.body;

    // 2. SAVE TO FIRESTORE (INQUIRIES COLLECTION)
    // No password needed in the path anymore.
    try {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiries?key=${creds.firebaseConfig.apiKey}`;

        const firestoreData = {
            fields: {
                name: { stringValue: name || "N/A" },
                email: { stringValue: email || "N/A" },
                phone: { stringValue: phone || "N/A" },
                subject: { stringValue: subject || "N/A" },
                message: { stringValue: message || "N/A" },
                authorizedDomain: { stringValue: origin },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreData)
        });
    } catch (dbError) {
        console.error("Firestore Save Error:", dbError);
    }

    // 3. SMTP NOTIFICATION (Vercel Side for reliability)
    const emailHtml = `
    <div style="font-family: Arial; border: 1px solid #08af08; border-radius: 10px; padding: 20px;">
        <h2 style="color:#08af08;">New Website Inquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <p>${message}</p>
    </div>
    `;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: creds.user, pass: creds.pass }
    });

    try {
        await transporter.sendMail({
            from: `"Mark Overseas" <${creds.user}>`,
            to: creds.user,
            replyTo: email,
            subject: `[Web Inquiry] ${subject} from ${name}`,
            html: emailHtml
        });
        return res.status(200).json({ success: true });
    } catch (mailError) {
        console.error("Mail Error:", mailError);
        return res.status(200).json({ success: true, warning: 'Saved to DB, but email failed.' });
    }
}
