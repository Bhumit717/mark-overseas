# 📧 FIREBASE EMAIL SETUP (Data-Driven Mode)

## ✅ New Architecture
Per your request, the system now:
1.  **Listens** to `inquiry_vault/{pwd}/data/{id}`
2.  **Fetches** SMTP password from Firestore `settings/smtp` (Field: `smtp`)
3.  **Sends** email via Cloud Functions

---

## 🚀 Deployment Instructions

### ⚠️ Prerequisite: Blaze Plan
**Crucial:** To send emails from Cloud Functions (accessing Gmail), your Firebase project **MUST be on the Blaze Plan** (Pay-as-you-go). 
-   It is free for small usage (<2M calls).
-   If you stay on Spark (Free), the email triggers will fail with "Network Error".

### Step 1: Deploy the Function
Run this command in your terminal:

```bash
cd c:\Users\bhumi\Desktop\clone\mark-overseas
firebase deploy --only functions
```

### Step 2: Verify Firestore Data
Ensure you have the document set up exactly as shown in your screenshot:
-   **Collection**: `settings`
-   **Document**: `smtp`
-   **Field**: `smtp` -> Value: `[Your App Password]`

---

## 🔍 How to Test
1.  Submit a form on your website.
2.  Check the **Firebase Console -> Functions -> Logs**.
3.  You should see: `"✅ SMTP Credentials fetched from Firestore. Sending email..."`

---

## 🔒 Security
-   The Cloud Function runs on Google's secure servers.
-   It reads the password directly from your database.
-   The password is NOT in the code.

Good luck! 🚀
