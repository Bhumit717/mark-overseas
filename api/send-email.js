const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    // 🔐 PRIVATE CREDENTIALS (SAVES THE DAY)
    // HTTrack can NEVER see this because this file only runs on the Server.
    const creds = {
        user: 'markoverseas28@gmail.com',
        pass: 'aopp wbdc ykky txwl',
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas"
    };

    const { name, email, phone, subject, message } = req.body;
    const origin = req.headers.origin || req.headers.referer || "unknown";

    try {
        // 1. SAVE TO FIREBASE (Cloud Backup)
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

        // 2. SEND EMAIL Notification
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: creds.user, pass: creds.pass }
        });

        await transporter.sendMail({
            from: `"Mark Overseas" <${creds.user}>`,
            to: creds.user,
            replyTo: email,
            subject: `[Web Inquiry] ${subject} from ${name}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 12px;">
                    <h2 style="color: #10b981;">New Inquiry Received</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Message:</strong><br>${message}</p>
                </div>
            `
        });

        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(200).json({ success: true, note: 'Processed' });
    }
}
