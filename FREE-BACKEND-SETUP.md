# 🚜 Zero-Cost Backend Guide (Google Apps Script)

Since you want a "Fully Free" solution and cannot use the Blaze plan, we will bypass Firebase Cloud Functions entirely. Instead, a **Google Script** running on your Google Drive will monitor the database and send emails for you.

## 📝 Step 1: Get Your Secret Key
We need a key to let the script talk to your database.
1.  Go to **[Firebase Console > Project Settings > Service Accounts](https://console.firebase.google.com/project/mark-overseas/settings/serviceaccounts/adminsdk)**.
2.  Click **Generate new private key**.
3.  A file like `mark-overseas-firebase-adminsdk-xxxxx.json` will download.
4.  **Open it with Notepad**. You will need these 3 values:
    *   `client_email` (e.g., `firebase-adminsdk-...@mark-overseas.iam.gserviceaccount.com`)
    *   `private_key` (The huge text block starting with `-----BEGIN PRIVATE KEY...`)
    *   `project_id` (`mark-overseas`)

## 📝 Step 2: Create the Google Script
1.  Go to **[script.google.com](https://script.google.com/)**.
2.  Click **+ New Project**.
3.  Click on the title "Untitled project" and rename it to `Mark Overseas Emailer`.
4.  **Delete any code** in the editor.
5.  **Copy & Paste** the entire code from `GOOGLE-APPS-SCRIPT-EMAILER.gs` (in your project folder) into the script editor.

## 📝 Step 3: Add Your Secrets
1.  In the Apps Script editor, click on the **Gear Icon (Project Settings)** in the left sidebar.
2.  Scroll down to **Script Properties**.
3.  Click **Edit script properties** -> **Add script property**.
4.  Add these 3 properties (Copy values from your JSON file):
    *   **Property**: `FIREBASE_EMAIL` -> **Value**: (your client_email)
    *   **Property**: `FIREBASE_PROJECT_ID` -> **Value**: `mark-overseas`
    *   **Property**: `FIREBASE_KEY` -> **Value**: (your entire private_key, including `\n` characters)
5.  Click **Save script properties**.

## 📝 Step 4: Run Initial Setup
1.  Back in the Code Editor, select the function `setup` from the dropdown menu (top bar).
2.  Click **Run**.
3.  **Authorization Required**: A popup will appear.
    *   Click **Review Permissions**.
    *   Choose your Google Account.
    *   Click **Advanced** (bottom left).
    *   Click **Go to Mark Overseas Emailer (unsafe)**.
    *   Click **Allow**.
4.  You should see `Execution started` -> `Execution completed` in the log.

## 📝 Step 5: Automate It (The Alarm Clock)
1.  Click the **Alarm Clock Icon (Triggers)** in the left sidebar.
2.  Click **+ Add Trigger**.
3.  Configure it like this:
    *   **Choose which function to run**: `checkInquiries`
    *   **Select event source**: `Time-driven`
    *   **Select type of time based trigger**: `Minutes timer`
    *   **Select minute interval**: `Every minute`
4.  Click **Save**.

---

## 🎉 Done!
Your automated backend is now live for $0.00.
-   Every minute, Google checks your database.
-   If `status` is missing or `NEW`, it sends an email.
-   It marks the inquiry as `EMAILED` or `SPAM`.
