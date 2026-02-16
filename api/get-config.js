const creds = require('./creds');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;

    if (password === creds.adminPassword) {
        // Return only the necessary public keys
        return res.status(200).json({
            success: true,
            config: creds.firebaseConfig
        });
    } else {
        return res.status(401).json({
            success: false,
            error: 'Invalid password'
        });
    }
}
