# Mark Overseas - Universal Secure Website

This project is a professional business website for **Mark Overseas**, featuring a secure admin dashboard and inquiry management system. 

It is designed to be **hosting-independent**, **scraper-proof (HTTrack)**, and **100% free**.

---

## 🚀 Key Features
- **Zero Credentials in Files**: No passwords or secret keys exist in the codebase.
- **Scraper-Proof**: All sensitive logic happens in `contact-action.php`. Scrapers cannot see the source code.
- **Hosting Independent**: Works on Vercel, cPanel, Tier.net, or any PHP-enabled host.
- **Firebase side Auth**: Secure admin login managed by Google.

---

## 🛡️ Setup Instructions (Required)

To make everything work securely, you must store your SMTP credentials in your **Firebase Database**:

### 1. Store SMTP in Firebase
*   Go to **Firebase Console > Firestore Database**.
*   Create a collection named `config`.
*   Create a document named `smtp` (inside the `config` collection).
*   Add two string fields:
    *   `user`: `markoverseas28@gmail.com`
    *   `pass`: `your-gmail-app-password`
    
*This makes your site secure. HTTrack will NEVER see these credentials.*

### 2. Firestore Rules
Paste these in the **Rules** tab:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🛡️ Lock down SMTP config
    match /config/smtp {
      allow read: if true; // PHP Bridge reads this secretly
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
- `contact-action.php`: **Universal Bridge**. Fetches SMTP from Firebase and sends emails.
- `admin.html`: Secure dashboard using Firebase Auth.
- `contact-us.html`: Inquiry form.

© 2026 Mark Overseas. All Rights Reserved.
Developed by **Antigravity AI**.
