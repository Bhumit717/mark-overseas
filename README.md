# Mark Overseas - Secure Website Dashboard

This project is a professional business website for **Mark Overseas**, featuring a secure admin dashboard and inquire management system.

## 🚀 Key Features
- **Zero-Password Codebase**: No passwords are stored in the source code.
- **Firebase Authentication**: Secure login managed by Google.
- **Proxied Submissions**: Protects database keys from scrapers like HTTrack.
- **Admin Dashboard**: View, export (PDF), and delete inquiries.
- **Automated SMTP**: Email notifications sent on every inquiry.

---

## 🛠️ Initial Setup (First Time Only)

Since the password is now kept **only in Firebase**, you must set up your admin account:

1.  **Enable Firebase Auth**:
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Build > Authentication > Get Started.
    *   Enable **Email/Password** sign-in method.
2.  **Create Admin Account**:
    *   Under the **Users** tab, click **Add User**.
    *   Enter Email: `markoverseas28@gmail.com`
    *   Enter your desired **Password**.
3.  **Authorized Domains (Vital)**:
    *   Under Authentication > Settings > **Authorized Domains**.
    *   Add `mark-overseas.com`, `www.mark-overseas.com`, and `mark-overseas.vercel.app`.
    *   *This prevents hackers from using your login on other sites.*

---

## ☁️ Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy site"
   git push origin main
   ```
2. **SMTP Configuration**:
   Open `api/creds.js` and enter your Gmail App Password for notifications. This file is protected by a server-side firewall.

---

## 🛡️ Admin Dashboard
Access the dashboard at: `/admin.html`

- **Login**: Use the Email and Password you created in the Firebase Console.
- **Architecture**: The dashboard uses a **State-of-the-Art** security model where access is verified by Google's servers, making it impossible to "hack" via static copies of the site.

---

## 📂 Project Structure
```
mark-overseas/
│
├── api/                    # Serverless Functions (Backend)
│   ├── send-email.js       # Secure Domain Proxy & SMTP
│   └── creds.js            # Private Server Config (Gmail)
│
├── js/                     
│   └── firebase-config.js  # Public Database Identifiers
│
├── admin.html              # Secure Admin Dashboard
├── contact-us.html         # Inquiry Form
├── .htaccess               # Apache Firewall
└── vercel.json             # Vercel Firewall (Blocks Scrapers)
```

© 2026 Mark Overseas. All Rights Reserved.
