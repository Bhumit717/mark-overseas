const creds = require('../creds');

export default async function handler(req, res) {
    const origin = req.headers.origin || req.headers.referer || "";
    const isAllowed = creds.allowedDomains.some(domain => origin.includes(domain));
    if (!isAllowed && process.env.NODE_ENV === 'production') return res.status(403).end();

    if (req.method !== 'POST') return res.status(405).end();

    const { password, id } = req.body;
    if (password !== creds.adminPassword) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        // Delete document via REST API
        const url = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiry_vault/${creds.adminPassword}/data/${id}?key=${creds.firebaseConfig.apiKey}`;

        const fRes = await fetch(url, { method: 'DELETE' });

        if (fRes.ok) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(500).json({ success: false, error: 'Delete failed' });
        }
    } catch (error) {
        console.error("Admin Delete Error:", error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
