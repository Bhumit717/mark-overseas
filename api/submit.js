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
    if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.RECAPTCHA_SECRET_KEY || !process.env.SMTP_PASSWORD) {
        return res.status(500).json({ 
            success: false, 
            error: 'Server configuration incomplete. Please set RECAPTCHA_SECRET_KEY, SMTP_PASSWORD, and FIREBASE_SERVICE_ACCOUNT in Vercel.' 
        });
    }

    // Verify critical environment variables
    if (!process.env.FIREBASE_SERVICE_ACCOUNT || !process.env.RECAPTCHA_SECRET_KEY || !process.env.SMTP_PASSWORD) {
        return res.status(500).json({ 
            success: false, 
            error: 'Server configuration incomplete. Please set RECAPTCHA_SECRET_KEY, SMTP_PASSWORD, and FIREBASE_SERVICE_ACCOUNT in Vercel.' 
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

    const { token, name, email, phone, subject, message } = req.body;

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

    if (!token) return res.status(400).json({ success: false, error: 'captcha missed' });

    try {
        // 5. reCAPTCHA Verification
        const secret = process.env.RECAPTCHA_SECRET_KEY;
        const verifyRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secret}&response=${token}`
        });
        const recaptcha = await verifyRes.json();

        // 6. Detailed checks
        if (!recaptcha.success || recaptcha.score < 0.5 || !allowedDomains.some(host => recaptcha.hostname?.includes(host))) {
            
            // Log suspicious request to Firestore
            if (db) {
                await db.collection("security_logs").add({
                    type: "suspicious_request",
                    reason: !recaptcha.success ? "captcha_failed" : (recaptcha.score < 0.5 ? `low_score_${recaptcha.score}` : "invalid_hostname"),
                    recaptcha: recaptcha,
                    ip: ip,
                    data_preview: { name: data.name, email: data.email },
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                }).catch(err => console.error("Log error:", err));
            }

            return res.status(400).json({ 
                success: false, 
                error: (recaptcha.score < 0.5) ? 'low score' : 'captcha failed'
            });
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
                html: `<p>New message from <b>${data.name}</b> (${data.email})</p><hr><p>${data.message}</p><br><p><small>IP: ${ip} | Score: ${recaptcha.score}</small></p>`
            });
        }

        res.status(200).json({ success: true, message: 'Message sent successfully' });

    } catch (err) {
        console.error("Backend Error:", err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};
