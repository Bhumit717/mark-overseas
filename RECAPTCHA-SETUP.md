# 🛡️ reCAPTCHA Enterprise Setup

The system now uses **reCAPTCHA Enterprise** to protect the contact form.

## 🔑 key Information
- **Site Key**: `6LdEV24sAAAAAGo0wr3C-xkzw_spoY8cEDpzM5nO`
- **Project ID**: `mark-overseas`
- **Integration**:
  - **Frontend**: `contact-us.html` (Generates token)
  - **Backend**: `functions/index.js` (Verifies token & Score)

## ⚙️ How It Works
1. User clicks "Send Message".
2. `grecaptcha.enterprise.execute` runs and gets a **Token**.
3. Form data + Token are saved to Firestore (`inquiry_vault`).
4. **Cloud Function** triggers on new document.
5. Function calls Google API to verify the token.
6. **If Score < 0.5**:
   - Status updated to `SPAM`.
   - Email **NOT** sent.
   - Admin Panel shows red badge.
7. **If Score >= 0.5**:
   - Status updated to `VERIFIED`.
   - Email **SENT**.
   - Admin Panel shows green badge.

## ⚠️ Important: Enable the API
For this to work, you must enable the API in Google Cloud:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select project `mark-overseas`.
3. Search for "reCAPTCHA Enterprise API".
4. Click **ENABLE**.

## 📧 Email Sending
- The backend still grabs the SMTP password from Firestore (`settings/smtp`).
- Ensure the **Blaze Plan** is active for external network requests (Gmail SMTP).
