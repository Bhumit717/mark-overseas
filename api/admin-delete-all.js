const creds = require('../creds');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { password } = req.body;
    if (password !== creds.adminPassword) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    try {
        // 1. Get all documents first
        const listUrl = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiry_vault/${creds.adminPassword}/data?key=${creds.firebaseConfig.apiKey}`;
        const listRes = await fetch(listUrl);
        const listData = await listRes.json();

        if (!listData.documents) return res.status(200).json({ success: true, message: 'Nothing to delete' });

        // 2. Delete each document (Firestore REST doesn't support batch delete easily without complex JSON)
        // For simplicity in a portable script, we delete in loop
        const deletePromises = listData.documents.map(doc => {
            const id = doc.name.split('/').pop();
            const deleteUrl = `https://firestore.googleapis.com/v1/projects/${creds.firebaseConfig.projectId}/databases/(default)/documents/inquiry_vault/${creds.adminPassword}/data/${id}?key=${creds.firebaseConfig.apiKey}`;
            return fetch(deleteUrl, { method: 'DELETE' });
        });

        await Promise.all(deletePromises);

        return res.status(200).json({ success: true, message: 'All inquiries deleted' });
    } catch (error) {
        console.error("Admin Delete All Error:", error);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
