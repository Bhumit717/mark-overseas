const creds = require('../creds');

export default async function handler(req, res) {
    const origin = req.headers.origin || req.headers.referer || "";
    const isAllowed = creds.allowedDomains.some(domain => origin.includes(domain));
    if (!isAllowed && process.env.NODE_ENV === 'production') return res.status(403).end();

    if (req.method !== 'POST') return res.status(405).end();

    const { password } = req.body;
    if (password !== creds.adminPassword) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        // Query Firestore via REST API
        // Path: inquiry_vault / [PASSWORD] / data
        const url = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiry_vault/${creds.adminPassword}/data?key=${creds.firebaseConfig.apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        // Transform Firestore REST format to simple JSON
        const inquiries = (data.documents || []).map(doc => {
            const fields = doc.fields;
            const id = doc.name.split('/').pop();
            return {
                id: id,
                name: fields.name?.stringValue || 'N/A',
                email: fields.email?.stringValue || 'N/A',
                phone: fields.phone?.stringValue || 'N/A',
                subject: fields.subject?.stringValue || 'N/A',
                message: fields.message?.stringValue || 'N/A',
                createdAt: fields.createdAt?.timestampValue || null
            };
        });

        // Sort by date (desc)
        inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return res.status(200).json({ success: true, inquiries });
    } catch (error) {
        console.error("Admin Fetch Error:", error);
        return res.status(500).json({ success: false, error: 'Failed to fetch data' });
    }
}
