const creds = require('./creds');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // --- 1. DOMAIN SECURITY CHECK ---
    const origin = req.headers.origin || req.headers.referer || "";
    const isAllowed = creds.allowedDomains.some(domain => origin.includes(domain));

    if (!isAllowed && process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Unauthorized domain' });
    }

    const { name, email, phone, subject, message } = req.body;

    // --- 2. SAVE TO FIRESTORE VIA REST API (SECURE PROXY) ---
    // The SMTP is now handled by FIREBASE side via Cloud Functions.
    // This handler only validates the domain and pushes data into the vault.
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
                authorizedDomain: { stringValue: origin },
                createdAt: { timestampValue: new Date().toISOString() }
            }
        };

        const fRes = await fetch(firestoreUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(firestoreData)
        });

        if (fRes.ok) {
            // Success: Cloud Function will now automatically trigger in the background
            return res.status(200).json({ success: true, message: 'Inquiry handled by Firebase rules.' });
        } else {
            const errLog = await fRes.text();
            console.error("Firestore REST Error:", errLog);
            return res.status(500).json({ error: 'Database entry failed.' });
        }
    } catch (error) {
        console.error("Critical Proxy Failure:", error);
        return res.status(500).json({ error: 'Server error during submission.' });
    }
}
