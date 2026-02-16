export default async function handler(req, res) {
    // 🔐 ONE-TIME SECURE SETUP
    // This allows the user to populate their private Firebase config without using the console.
    const creds = {
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas",
        user: 'markoverseas28@gmail.com',
        pass: 'aopp wbdc ykky txwl'
    };

    try {
        const configUrl = `https://firestore.googleapis.com/v1/projects/${creds.projectId}/databases/(default)/documents/config/smtp?key=${creds.apiKey}`;

        const response = await fetch(configUrl, {
            method: 'PATCH', // Update if exists
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fields: {
                    user: { stringValue: creds.user },
                    pass: { stringValue: creds.pass }
                }
            })
        });

        if (response.ok) {
            return res.status(200).send("✅ SUCCESS: Firebase Config Populated. You can now delete this /api/setup.js file for maximum security.");
        } else {
            const err = await response.text();
            return res.status(500).send("❌ FAILED: " + err + "\n\nMake sure your Firestore Database is created and Rules are set to allow reads/writes.");
        }
    } catch (e) {
        return res.status(500).send("❌ FATAL ERROR: " + e.message);
    }
}
