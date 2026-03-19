const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

// Simple Memory Rate Limiting (Note: Reset per cold start)
const rateLimits = new Map();
const LIMIT = 5; 
const WINDOW = 60 * 1000;

// Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            admin.initializeApp({
                credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
            });
        }
    } catch (error) {
        console.error("Firebase Admin Init Error:", error.message);
    }
}
const db = admin.firestore();

module.exports = async (req, res) => {
    // 1. Method Validation
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method Not Allowed' });

    // Verify critical environment variables
    if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.SMTP_PASSWORD) {
        return res.status(500).json({ 
            success: false, 
            error: 'Server configuration incomplete. Please set SMTP_PASSWORD and FIREBASE_SERVICE_ACCOUNT in Vercel.' 
        });
    }

    // 2. IP Rate Limiting
    const ip = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || "";
    const now = Date.now();
    const entry = rateLimits.get(ip) || { count: 0, firstTime: now };
    
    if (now - entry.firstTime < WINDOW) {
        if (entry.count >= LIMIT) return res.status(429).json({ success: false, error: 'too many requests' });
        entry.count++;
        rateLimits.set(ip, entry);
    } else {
        rateLimits.set(ip, { count: 1, firstTime: now });
    }

    // 3. Origin validation
    const originOrReferer = req.headers.origin || req.headers.referer || "";
    // Check for allowed hostnames
    const allowedDomains = ['mark-overseas.com', 'www.mark-overseas.com', 'localhost', '127.0.0.1'];
    const isAllowedOrigin = allowedDomains.some(d => originOrReferer.includes(d));
    if (!isAllowedOrigin) {
        return res.status(403).json({ success: false, error: 'invalid domain' });
    }

    const { token, name, email, phone, subject, message, website_url } = req.body;

    // 4. Sanitization
    const clean = (s, len) => (s || "").toString().replace(/<[^>]*>?/gm, '').trim().substring(0, len);
    const data = {
        name: clean(name, 100),
        email: clean(email, 100).toLowerCase(),
        phone: clean(phone, 20),
        subject: clean(subject, 200),
        message: clean(message, 5000),
        ip: ip,
        createdAt: new Date().toISOString()
    };

    if (!token) return res.status(400).json({ success: false, error: 'submission missed' });

    try {
        // 5. Bot Check (Honeypot) - If a bot fills out the hidden website_url field, reject quietly
        if (website_url && website_url.trim() !== '') {
            console.warn(`[BOT BLOCKED] IP: ${ip} filled honeypot`);
            return res.status(200).json({ success: true, message: 'Message sent successfully' }); // fake success for bots
        }

        // 6. Data Validation
        if (!data.name || !data.email || !data.message) {
             return res.status(400).json({ success: false, error: 'missing required fields' });
        }

        // 7. Success logic
        if (db) {
            await db.collection("inquiry_vault").doc("Mark_Vault").collection("data").add({
                ...data,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }

        // 8. Email
        if (process.env.SMTP_PASSWORD) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: "markoverseas28@gmail.com", pass: process.env.SMTP_PASSWORD }
            });

            await transporter.sendMail({
                from: `"Mark Overseas Support" <markoverseas28@gmail.com>`,
                to: "markoverseas28@gmail.com",
                replyTo: data.email,
                subject: `[SECURE] New Inquiry: ${data.subject}`,
                html: `<p>New message from <b>${data.name}</b> (${data.email})</p><hr><p>${data.message}</p><br><p><small>IP: ${ip} | Phone: ${data.phone}</small></p>`
            });
        }

        res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
