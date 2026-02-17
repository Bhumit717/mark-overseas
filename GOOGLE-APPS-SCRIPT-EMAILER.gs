/*
 * 🚀 GOOGLE APPS SCRIPT: Mark Overseas Emailer (Zero-Cost Backend)
 * 
 * INSTRUCTIONS:
 * 1. Go to script.google.com -> New Project -> Name it "Mark Overseas Emailer"
 * 2. Paste this ENTIRE file content into Code.gs
 * 3. Go to Project Settings (Gear Icon) -> Script Properties -> Add these:
 *    - FIREBASE_EMAIL: (From your service account JSON)
 *    - FIREBASE_KEY: (The huge private key from JSON, including -----BEGIN... and \n)
 *    - FIREBASE_PROJECT_ID: mark-overseas
 * 4. Run `setup()` function once.
 * 5. Initial Run: You will be asked to grant permissions. Click Review Permissions -> Advanced -> Proceed (unsafe).
 * 6. Triggers: Click Alarm Clock icon -> Add Trigger -> `checkInquiries` -> Time-driven -> Every minute.
 */

const SECRET_KEY = PropertiesService.getScriptProperties().getProperty('FIREBASE_KEY').replace(/\\n/g, '\n');
const CLIENT_EMAIL = PropertiesService.getScriptProperties().getProperty('FIREBASE_EMAIL');
const PROJECT_ID = PropertiesService.getScriptProperties().getProperty('FIREBASE_PROJECT_ID');
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function checkInquiries() {
  const token = getOAuthToken();
  if (!token) {
    Logger.log("❌ Failed to get OAuth Token");
    return;
  }

  // 1. QUERY: Get documents sorted by date (descending) 
  // We fetch potentially new ones. Since we can't easily filter by "status" without an index, 
  // we will fetch the latest 20 and process only those with status="NEW" or missing status.
  const url = `${BASE_URL}/inquiry_vault/Mark@Overseas321/data?pageSize=20&orderBy=createdAt desc`;
  
  const options = {
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + token },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = JSON.parse(response.getContentText());

  if (!json.documents) {
    Logger.log("✅ No inquiries found.");
    return;
  }

  Logger.log(`🔍 Checking ${json.documents.length} recent inquiries...`);

  json.documents.forEach(doc => {
    const fields = doc.fields;
    const docPath = doc.name.split('/documents/')[1]; // inquiry_vault/Mark@Overseas321/data/{ID}

    // CHECK STATUS: Only process if status is missing or 'NEW'
    // If we already sent it, the status should be 'EMAILED' or 'SPAM'
    const status = fields.status ? fields.status.stringValue : 'NEW';
    const score = fields.recaptchaScore ? fields.recaptchaScore.doubleValue || fields.recaptchaScore.integerValue : 0;

    if (status === 'NEW' || !fields.status) {
      Logger.log(`⚡ Processing: ${docPath}`);

      if (score < 0.5 && fields.recaptchaScore) {
          Logger.log(`🚫 SPAM DETECTED (Score: ${score}). Marking as SPAM.`);
          updateStatus(docPath, 'SPAM', token);
          return;
      }

      // SEND EMAIL
      if (sendEmail(fields)) {
        updateStatus(docPath, 'EMAILED', token);
      }
    } else {
      Logger.log(`⏩ Skipping ${docPath} (Status: ${status})`);
    }
  });
}

function sendEmail(fields) {
  try {
    const name = fields.name.stringValue;
    const email = fields.email.stringValue;
    const phone = fields.phone.stringValue;
    const subject = fields.subject.stringValue;
    const message = fields.message.stringValue.replace(/\n/g, '<br>'); // Preserve line breaks
    const domain = fields.authorizedDomain ? fields.authorizedDomain.stringValue : 'Unknown';
    const score = fields.recaptchaScore ? (fields.recaptchaScore.doubleValue || fields.recaptchaScore.integerValue) : 'N/A';

    const htmlBody = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #10b981; border-radius: 12px;">
          <h2 style="color: #10b981;">New Inquiry from ${name}</h2>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 15px;">
              <strong>Message:</strong><br>${message}
          </div>
          <hr>
          <small style="color: #888;">Domain: ${domain}</small>
          <small style="color: #888;"> | reCAPTCHA Score: ${score}</small>
      </div>
    `;

    // Recipient
    const recipient = "markoverseas28@gmail.com"; 

    MailApp.sendEmail({
      to: recipient,
      subject: `[Web Inquiry] ${subject}`,
      htmlBody: htmlBody,
      replyTo: email,
      name: "Mark Overseas Bot"
    });

    Logger.log(`✅ Email sent to ${recipient}`);
    return true;

  } catch (e) {
    Logger.log(`❌ Email Failed: ${e.toString()}`);
    return false;
  }
}

function updateStatus(docPath, newStatus, token) {
  const url = `${BASE_URL}/${docPath}?updateMask.fieldPaths=status`;
  const body = {
    fields: {
      status: { stringValue: newStatus }
    }
  };

  UrlFetchApp.fetch(url, {
    method: 'patch',
    headers: { 
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json' 
    },
    payload: JSON.stringify(body),
    muteHttpExceptions: true
  });
  Logger.log(`💾 Updated status to: ${newStatus}`);
}

// ==========================================
// 🔐 OAUTH 2.0 TOKEN GENERATION (The Hard Part)
// ==========================================
function getOAuthToken() {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claimSet = {
    iss: CLIENT_EMAIL,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const toSign = Utilities.base64EncodeWebSafe(JSON.stringify(header)) + '.' + Utilities.base64EncodeWebSafe(JSON.stringify(claimSet));
  const signatureBytes = Utilities.computeRsaSha256Signature(toSign, SECRET_KEY);
  const signature = Utilities.base64EncodeWebSafe(signatureBytes);

  const jwt = toSign + '.' + signature;

  const params = {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    },
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch('https://oauth2.googleapis.com/token', params);
  const json = JSON.parse(response.getContentText());

  if (json.access_token) {
    return json.access_token;
  } else {
    Logger.log("❌ OAuth Error: " + JSON.stringify(json));
    return null;
  }
}

function setup() {
  Logger.log("✅ Script Initialized. Now set up your Triggers.");
}
