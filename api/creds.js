module.exports = {
    // Gmail SMTP Settings
    user: 'markoverseas28@gmail.com',
    pass: 'aopp wbdc ykky txwl',

    // Firebase (Protected by Domain Restriction in Google Console)
    firebaseConfig: {
        apiKey: "AIzaSyAtWGC2M5CqAhDK1O7mVqYvkhCqXhv0Ii0",
        projectId: "mark-overseas"
    },

    // Authorized Domains (Enforced via Server-Side Check)
    allowedDomains: [
        'mark-overseas.com',
        'www.mark-overseas.com',
        'mark-overseas.vercel.app',
        'localhost'
    ]
};
