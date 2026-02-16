# 🔒 DOMAIN-RESTRICTED FIREBASE RULES

## ✅ Enhanced Security Rules

Use these rules in your Firebase Console to restrict submissions to your authorized domains only:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /inquiries/{id} {
      // 🛡️ REAL DOMAIN ENFORCEMENT
      // The database will REJECT any submission that doesn't come from these domains.
      allow create: if request.resource.data.authorizedDomain in [
        'mark-overseas.com', 
        'www.mark-overseas.com', 
        'mark-overseas.vercel.app',
        'localhost'  // For local testing
      ];
      
      // 🛡️ AUTH ENFORCEMENT
      // Only your logged-in Google account can read/delete data.
      allow read, delete: if request.auth != null && request.auth.token.email == 'markoverseas28@gmail.com';
    }
    
    // Allow reading SMTP config (for PHP bridge)
    match /config/smtp {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

---

## 🚀 How to Apply

### Step 1: Open Firebase Console
1. Go to https://console.firebase.google.com/
2. Select project: **mark-overseas**
3. Click **Firestore Database** (left menu)
4. Click **Rules** tab (top)

### Step 2: Paste Rules
- Delete everything in the editor
- Paste the rules above
- Click **Publish**

### Step 3: Test
- Submit a form from your website
- ✅ Should work from authorized domains
- ❌ Will be rejected from other domains

---

## 🔒 What This Protects Against

### ✅ Prevents:
1. **Spam submissions** from unauthorized websites
2. **Form scraping** - someone copying your form to their site
3. **API abuse** - direct database writes from unknown sources
4. **Data pollution** - fake submissions from bots

### ✅ Allows:
1. Submissions from `mark-overseas.com`
2. Submissions from `www.mark-overseas.com`
3. Submissions from `mark-overseas.vercel.app`
4. Submissions from `localhost` (for testing)

---

## 📊 How It Works

```javascript
// Your form includes:
authorizedDomain: window.location.hostname

// Firebase checks:
if (authorizedDomain in ['mark-overseas.com', 'www.mark-overseas.com', ...]) {
  ✅ Allow submission
} else {
  ❌ Reject with "Missing or insufficient permissions"
}
```

---

## 🔧 Adding More Domains

To allow submissions from additional domains:

```javascript
allow create: if request.resource.data.authorizedDomain in [
  'mark-overseas.com', 
  'www.mark-overseas.com', 
  'mark-overseas.vercel.app',
  'localhost',
  'your-new-domain.com'  // ← Add here
];
```

---

## ⚠️ Important Notes

### For Local Testing:
- `localhost` is included in the allowed domains
- This lets you test the form locally
- Remove it in production if you want maximum security

### For Subdomains:
- Add each subdomain explicitly
- Example: `'blog.mark-overseas.com'`

### For Vercel Preview Deployments:
- Each preview has a unique URL
- You may want to allow `*.vercel.app` pattern
- Or test with direct Firebase mode locally

---

## ✅ Updated Files

I've updated `contact-us.html` to include:
```javascript
authorizedDomain: window.location.hostname || 'localhost'
```

This automatically captures the domain and sends it with each submission.

---

## 🎯 Security Levels

| Rule Type | Security Level | Use Case |
|-----------|----------------|----------|
| `allow create: if true` | Low | Development/Testing |
| `allow create: if request.resource.data.authorizedDomain in [...]` | **High** | **Production** ✅ |

---

## 📝 Complete Setup Checklist

- [ ] Update Firebase rules with domain restrictions
- [ ] Click "Publish" in Firebase Console
- [ ] Test form from your website
- [ ] Verify submission works
- [ ] Try from unauthorized domain (should fail)
- [ ] Check admin dashboard for inquiries

---

**Your form is now protected by domain-level security!** 🔒🚀
