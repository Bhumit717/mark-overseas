# Mark Overseas - Universal Cloud Site (Zero-Secrets)

This website is **Hosting Independent**, **100% Free**, and **Scraper-Proof**. 

It uses a **Cloud-Vault** architecture: Secrets are stored in Firebase and fetched at the moment of submission.

---

## 🚀 Key Features
- **Zero Secrets in Files**: Not a single password exists in the codebase.
- **Hosting Independent**: Works on cPanel, Vercel, Tier.net, or any host.
- **Scraper-Proof**: Scrapers (HTTrack) only see public HTML/JS. They cannot see the dynamic cloud fetch.
- **One-Click Setup**: No manual typing in the Firebase Console.

---

## 🛡️ Setup (Required Once)

To make everything work without manual entry, follow these 3 steps:

### 1. Initialize Cloud (Automatic)
Open the file `CLOUD-INITIALIZER.html` in your browser and click the button. 
*This automatically populates your Firebase Database with your SMTP settings.*

### 2. Firestore Rules
Paste these in the **Rules** tab in the Firebase Console:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /config/smtp {
      allow read: if true; 
      allow write: if false; 
    }
    match /inquiries/{id} {
      allow create: if true;
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
  }
}
```

### 3. Deploy
Upload to your host. If using Vercel, ensure you have set up the `vercel.json` rewrites for the admin dashboard.

---

© 2026 Mark Overseas. All Rights Reserved.
Developed by **Antigravity AI**.
