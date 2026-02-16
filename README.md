# Mark Overseas - Secure "Firebase Only" Website

This project is a professional business website for **Mark Overseas**, featuring a secure admin dashboard and inquire management system. 

It is designed with **Zero Credentials in Files** to prevent tools like HTTrack from scraping sensitive data.

---

## 🚀 Key Features
- **Zero-Password Codebase**: All passwords and secrets live in the Firebase Cloud.
- **Firebase side SMTP**: Emails are sent by Firebase Cloud Functions, not the website.
- **No Proxy Needed**: Writes directly to Firestore using secure **Firebase Rules**.
- **Scraper-Proof**: HTTrack only sees public Firebase config protected by domain lock.

---

## 🛡️ CRITICAL: Firebase Setup (Required)

To make everything work "By Firebase Only," you must follow these steps:

### 1. Upgrade to Blaze Plan
*   **Firebase Functions** require the "Blaze" (Pay-as-you-go) plan. 
*   It is **Free** for low usage (the first 2M invocations are free), but Google requires a credit card to enable Cloud Build.

### 2. Set SMTP Secrets (The Secure Way)
Instead of files or environment variables, use the Firebase CLI to set your secrets in the cloud:
```bash
# Register secrets in the cloud (Zero file exposure)
firebase functions:secrets:set GMAIL_USER
# (Enter your email when prompted)

firebase functions:secrets:set GMAIL_PASS
# (Enter your App Password when prompted)
```

### 3. Deploy Functions
```bash
firebase deploy --only functions
```

### 4. Firestore Rules (Domain Check)
Go to **Firestore Database > Rules** and paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inquiries/{id} {
      // 🛡️ REJECT submissions from unauthorized domains
      allow create: if request.resource.data.authorizedDomain in [
        'mark-overseas.com', 
        'www.mark-overseas.com', 
        'mark-overseas.vercel.app',
        'localhost'
      ];
      // Admin only
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
  }
}
```

### 5. Authorized Domains
Go to **Authentication > Settings > Authorized Domains** and add your website URL. This prevents other people from using your database.

---

## 📂 Project Structure
- `js/firebase-config.js`: Public database identifiers (Protected by Google Console).
- `functions/index.js`: Firebase side email logic (Zero secrets).
- `admin.html`: Secure dashboard using Firebase Auth.
- `contact-us.html`: Form writing directly to Firestore.

© 2026 Mark Overseas. All Rights Reserved.
Developed by **Antigravity AI**.
