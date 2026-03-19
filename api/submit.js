const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Simple Memory Rate Limiting (Note: Reset per cold start)
const rateLimits = new Map();
const LIMIT = 5;
const WINDOW = 60 * 1000;

// Initialize Firebase Admin (Only once per process)
function getDb() {
    try {
        if (!admin.apps.length) {
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
                });
            } else {
                return null;
            }
        }
        return admin.firestore();
    } catch (error) {
        console.error("Firebase Admin Init Error:", error.message);
        return null;
    }
}

module.exports = async (req, res) => {
    // 1. Method Validation
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

    // 2. Verify critical environment variables
    if (!process.env.SMTP_PASSWORD) {
        return res.status(500).json({
            success: false,
            error: 'Server configuration incomplete. SMTP_PASSWORD is missing.'
        });
    }

    // 3. IP Rate Limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.connection?.remoteAddress || "unknown";
    const now = Date.now();
    const entry = rateLimits.get(ip) || { count: 0, firstTime: now };

    if (now - entry.firstTime < WINDOW) {
        if (entry.count >= LIMIT) return res.status(429).json({ success: false, error: 'Too many requests. Please try again in a minute.' });
        entry.count++;
        rateLimits.set(ip, entry);
    } else {
        rateLimits.set(ip, { count: 1, firstTime: now });
    }

    // 4. Origin validation (Allow vercel preview + custom domain)
    const originOrReferer = req.headers.origin || req.headers.referer || "";
    const allowedDomains = ['mark-overseas.com', 'mark-overseas.vercel.app', 'localhost', '127.0.0.1'];
    const isAllowedOrigin = !originOrReferer || allowedDomains.some(d => originOrReferer.includes(d));
    if (!isAllowedOrigin) {
        return res.status(403).json({ success: false, error: 'Request origin not allowed.' });
    }

    const { name, email, phone, subject, message, website_url } = req.body || {};

    // 5. Bot Check (Honeypot)
    if (website_url && website_url.trim() !== '') {
        console.warn(`[BOT BLOCKED] IP: ${ip}`);
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    }

    // 6. Sanitization
    const clean = (s, len) => (s || "").toString().replace(/<[^>]*>?/gm, '').trim().substring(0, len);
    const data = {
        name: clean(name, 100),
        email: clean(email, 100).toLowerCase(),
        phone: clean(phone, 20),
        subject: clean(subject, 200),
        message: clean(message, 5000),
        ip: ip,
        createdAt: new Date().toISOString(),
        timestamp: admin.apps.length > 0 ? admin.firestore.FieldValue.serverTimestamp() : new Date().toISOString()
    };

    // 7. Field Validation
    if (!data.name || !data.email || !data.message) {
        return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return res.status(400).json({ success: false, error: 'Invalid email address.' });
    }

    try {
        // 8. Save to Firestore
        const db = getDb();
        if (db) {
            try {
                await db.collection("inquiry_vault").doc("Mark_Vault").collection("data").add({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    subject: data.subject,
                    message: data.message,
                    ip: data.ip,
                    createdAt: data.createdAt,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log(`[INQUIRY SAVED] ${data.name} | ${data.email}`);
            } catch (dbErr) {
                console.error("Firestore Write Error:", dbErr.message);
                // Don't fail the whole request if DB write fails — still send email
            }
        } else {
            console.warn("[FIREBASE] Not initialized — skipping Firestore save.");
        }

        // 9. Send Email Notification
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: { user: "markoverseas28@gmail.com", pass: process.env.SMTP_PASSWORD }
        });

        await transporter.sendMail({
            from: `"Mark Overseas Website" <markoverseas28@gmail.com>`,
            to: "markoverseas28@gmail.com",
            replyTo: data.email,
            subject: `New Inquiry: ${data.subject || '(no subject)'} — from ${data.name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
                    <div style="background: #08af08; padding: 22px 28px;">
                        <h2 style="color:#fff; margin:0;">📩 New Inquiry — Mark Overseas</h2>
                    </div>
                    <div style="padding: 28px;">
                        <table style="width:100%; border-collapse: collapse; font-size: 15px;">
                            <tr><td style="padding:8px 0; color:#555; width:35%;"><b>Name</b></td><td style="padding:8px 0;">${data.name}</td></tr>
                            <tr><td style="padding:8px 0; color:#555;"><b>Email</b></td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#08af08;">${data.email}</a></td></tr>
                            <tr><td style="padding:8px 0; color:#555;"><b>Phone</b></td><td style="padding:8px 0;">${data.phone || 'Not provided'}</td></tr>
                            <tr><td style="padding:8px 0; color:#555;"><b>Subject</b></td><td style="padding:8px 0;">${data.subject || 'Not provided'}</td></tr>
                            <tr><td style="padding:8px 0; color:#555;"><b>IP Address</b></td><td style="padding:8px 0; font-size:12px; color:#999;">${ip}</td></tr>
                        </table>
                        <hr style="border:none; border-top:1px solid #eee; margin: 20px 0;">
                        <p style="color:#555; margin-bottom:8px;"><b>Message:</b></p>
                        <div style="background:#f9f9f9; padding:16px; border-radius:8px; color:#333; white-space:pre-wrap;">${data.message}</div>
                    </div>
                    <div style="background:#f5f5f5; padding:14px 28px; font-size:12px; color:#aaa; text-align:center;">
                        Mark Overseas — This is an automated notification. Reply directly to this email to respond to the inquirer.
                    </div>
                </div>
            `
        });

        console.log(`[EMAIL SENT] To: markoverseas28@gmail.com | From: ${data.name} <${data.email}>`);
        res.status(200).json({ success: true, message: 'Message sent successfully!' });

    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).json({ success: false, error: 'Server error. Please try again later.' });
    }
};
