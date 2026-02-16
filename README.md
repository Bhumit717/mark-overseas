# Mark Overseas - Secure Portable Website

This project is a professional business website for **Mark Overseas**, featuring a secure admin dashboard and inquire management system.

## 🚀 Key Features
- **Zero-Password Codebase**: No passwords are stored in the source code.
- **Portability**: Works instantly without needing `.env` or Vercel environment variables.
- **Scraper Protection**: All sensitive keys are stored in the `/api` directory, which hides source code from tools like HTTrack.
- **Enforced Domain Security**: The database only accepts entries from authorized domains.

---

## 🛡️ CRITICAL: Firebase Setup (REQUIRED)

To protect your website from hackers, you **MUST** configure these 2 things inside your Firebase Console:

### 1. Set Security Rules (Domain Lockdown)
Go to **Firestore Database > Rules** and paste this:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inquiries/{id} {
      // 🛡️ ENFORCED DOMAIN CHECK
      allow create: if request.resource.data.authorizedDomain in [
        'mark-overseas.com', 
        'www.mark-overseas.com', 
        'mark-overseas.vercel.app',
        'localhost'
      ];
      // ADMIN ONLY
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
  }
}
```

### 2. Set Admin Account
Go to **Authentication > Users** and add:
- **Email**: `markoverseas28@gmail.com`
- **Password**: (Your chosen password)

---

## 📂 Project Structure
- `api/creds.js`: **Central Config**. Edit this to change your Gmail credentials. (Portable & Scraper-Safe).
- `admin.html`: Secure dashboard using Firebase Auth.
- `contact-us.html`: Inquiry form protected by Domain Proxy.

© 2026 Mark Overseas. All Rights Reserved.
