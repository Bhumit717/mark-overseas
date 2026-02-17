# 🛡️ reCAPTCHA Enterprise Setup

The system now uses **reCAPTCHA Enterprise** to protect the contact form.

## 🔑 key Information
- **Site Key**: `6LdEV24sAAAAAGo0wr3C-xkzw_spoY8cEDpzM5nO`
- **Project ID**: `mark-overseas`
- **Integration**:
  - **Frontend**: `contact-us.html` (Generates token)

## ⚙️ How It Works
1. User clicks "Send Message".
2. `grecaptcha.enterprise.execute` runs and gets a **Token**.
3. Form data + Token are saved to Firestore (`inquiry_vault`).
4. **Admin Dashboard** automatically processes the inquiry.
5. **Secure Relay**: The system uses a secure backend relay to send the email notification.

## ⚠️ Important: Enable the API
For this to work, you must enable the API in Google Cloud:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select project `mark-overseas`.
3. Search for "reCAPTCHA Enterprise API".
4. Click **ENABLE**.
