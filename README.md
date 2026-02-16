# Mark Overseas - Firebase-Only Architecture

This project is built using a **Firebase-First** architecture. It has **Zero SMTP secrets in the codebase**, making it 100% scraper-proof and highly secure.

---

## 🚀 Key Features
- **Zero Secrets in Files**: No passwords, App Passwords, or secrets exist in any file.
- **Firebase Native**: Submissions go directly to Firestore from the browser.
- **Automated Emails**: A Firebase Cloud Function (Node.js) triggers on new inquiries and sends the email.
- **Scraper-Proof**: HTTrack only sees your Public Firebase Config, which is protected by Domain Lock.

---

## 🛡️ Setup Instructions (Required)

Because there are **no secrets in the code**, you must set them in the Firebase Console:

### 1. Set SMTP Secrets
Run these commands in your terminal (using Firebase CLI) to store your Gmail password securely in the cloud:
```bash
firebase functions:secrets:set GMAIL_USER
# Enter: markoverseas28@gmail.com

firebase functions:secrets:set GMAIL_PASS
# Enter: your-gmail-app-password
```
*Wait ~30 seconds for the secrets to propagate.*

### 2. Firestore Rules
Paste these in the **Rules** tab in the Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🛡️ Lock down SMTP config (if you use it)
    match /config/smtp {
      allow read, write: if false; 
    }
    // 🛡️ Inquiry Management
    match /inquiries/{id} {
      allow create: if true;
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
  }
}
```

### 3. Deploy
```bash
firebase deploy --only functions
```

---

## 📂 Project Structure
- `functions/index.js`: The "Brain". Handles secure email sending.
- `admin.html`: Secure dashboard using Firebase Auth.
- `contact-us.html`: Inquiry form using Firebase SDK.

© 2026 Mark Overseas. All Rights Reserved.
Developed by **Antigravity AI**.
