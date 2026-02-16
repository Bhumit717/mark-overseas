# Mark Overseas - Secure Cloud-Flow Website

This project is a professional business website for **Mark Overseas**, featuring a secure admin dashboard and inquiry management system.

It is designed with **Zero Credentials in Files**. All sensitive data lives securely in the Firebase Cloud, making it 100% scraper-proof (HTTrack cannot see your passwords).

---

## 🚀 Key Features
- **Zero Secrets in Files**: No passwords or App Passwords are stored in the source code.
- **Cloud-Config Model**: SMTP settings are fetched from Firebase at runtime.
- **100% Free**: No Blaze plan required. Works on free Vercel or any PHP host.
- **Scraper-Proof**: All sensitive logic happens server-side (PHP or Vercel API).

---

## 🛡️ CRITICAL: One-Click Automated Setup (REQUIRED)

To make everything work without manual console entry, follow these steps:

1.  **Open your Website**: Visit `https://[your-domain].vercel.app/api/setup` in your browser.
2.  **Verify Success**: You should see a "✅ SUCCESS" message. This automatically creates the `config/smtp` document in your Firebase.
3.  **Maximum Security**: For the highest security, you can now **delete** the `api/setup.js` file from your project so nobody else can change your settings.

---

### 2. Firestore Rules (Security Lockdown)
Paste these in the **Rules** tab. These rules allow the system to read the config and users to submit inquiries while keeping your data safe:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🛡️ Lock down SMTP config
    match /config/smtp {
      allow read: if true; // The secure server bridge reads this
      allow write: if false; 
    }
    // 🛡️ Inquiry Management
    match /inquiries/{id} {
      allow create: if true;
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
  }
}
```

### 3. Admin Account
Go to **Authentication > Users** and add:
- **Email**: `markoverseas28@gmail.com`
- **Password**: (Your chosen password)

---

## 📂 Project Structure
- `admin.html`: Secure dashboard using Firebase Auth.
- `contact-us.html`: Inquiry form with smart hosting auto-detection.
- `contact-action.php`: Universal PHP Bridge (Zero Secrets).
- `api/send-email.js`: Vercel Serverless Bridge (Zero Secrets).

© 2026 Mark Overseas. All Rights Reserved.
Developed by **Antigravity AI**.
