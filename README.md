# Mark Overseas - Agro Commodities Exporter Website

![Mark Overseas Logo](images/mark-logo.png)

## 🌍 Overview
**Mark Overseas** is a high-performance, static-generated website for an Agro Commodities Exporter based in India. Use this platform to showcase products (Spices, Grains, Oil Seeds) and manage customer inquiries efficiently.

The project combines the speed of **Static HTML** with the power of **Serverless Functions** and **Firebase** for dynamic features.

## 🚀 Features
- **⚡ Static Site Generation (SSG)**: 50+ Product pages generated instantly via a Python script (`generate-product-pages.py`).
- **📧 Secure Contact Form**: detailed inquiries sent via **Gmail SMTP** (processed securely on Vercel Serverless Functions).
- **🔥 Real-time Database**: All inquiries are backed up to **Google Firebase (Firestore)**.
- **🛡️ Admin Dashboard**: specific protected route (`/admin.html`) to view, manage, and delete inquiries.
- **📱 Responsive Design**: Built with Bootstrap 5, fully optimized for Mobile, Tablet, and Desktop.
- **🌍 Multi-language**: Integrated Google Translate widget for global accessibility.
- **⚡ SEO Optimized**: Unique meta tags, descriptions, and structured data for every product.

## 🏗️ System Architecture
See the detailed architecture documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)

**Core Stack:**
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla + jQuery), Bootstrap 5.
- **Backend**: Node.js (Vercel Serverless Functions).
- **Database**: Firebase Firestore (NoSQL).
- **DevOps**: Python (Automation), Git, Vercel (Hosting).

---

## 🛠️ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Bhumit717/mark-overseas.git
cd mark-overseas
```

### 2. Install Dependencies
This project uses Node.js for the API/Backend and Python for page generation.

**Node.js (for local API testing):**
```bash
npm install
```

**Python (for generating pages):**
```bash
# No external requirements, uses standard library (os, requests)
```

### 3. Environment Variables
Create a `.env` file in the root directory to store your credentials locally. **DO NOT COMMIT THIS FILE**.
```env
GMAIL_USER="your-email@gmail.com"
GMAIL_PASS="your-app-password"
```

### 4. Run Locally
You can use `live-server` or any static file server.
```bash
python -m http.server 5500
```
Visit `http://localhost:5500` in your browser.

---

## 🔄 Generating Product Pages
If you modify the product data (descriptions, new items), you must regenerate the HTML files.

1. Open `generate-product-pages.py`.
2. Update the `products_data` dictionary.
3. Run the script:
   ```bash
   python generate-product-pages.py
   ```
4. New `.html` files (e.g., `product-cumin.html`) will be created in the root folder.

---

## ☁️ Deployment (Vercel)

This project is optimized for **Vercel**.

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update site"
   git push origin main
   ```
2. **Import to Vercel**:
   - Go to Vercel Dashboard > Add New Project.
   - Import the `mark-overseas` repository.
   
3. **Configure Firebase SMTP (Automatic Rules)**:
   - Set credentials via the Firebase CLI:
     ```bash
     firebase functions:config:set gmail.user="your-email@gmail.com" gmail.pass="your-app-password"
     firebase deploy --only functions
     ```
   - This sends emails automatically on database entry.

4. **Deploy**: Vercel handles the website and the Secure Proxy API.

---

## 🛡️ Admin Dashboard & Security
Access the dashboard at: `/admin.html`

- **Architecture**: This site uses a **Server-Side Proxy**. Database keys and SMTP passwords are NEVER stored in the browser. Static scrapers (like HTTrack) cannot hack your credentials.
- **Passwords**: Change the admin password and SMTP keys in `api/creds.js` (for Vercel) or `php/gmail_credentials.php` (for PHP hosting).
- **Default Password**: `Mark@Overseas321` (Defined in `api/creds.js`).

---

## 📂 Project Structure
```
mark-overseas/
│
├── api/                    # Serverless Functions (Backend)
│   └── send-email.js       # Node.js script for sending emails via SMTP
│
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── images/                 # Assets
│
├── product-*.html          # Generated Product Pages
├── generate-product-pages.py # Python script for automation
│
├── index.html              # Homepage
├── contact-us.html         # Contact Page
├── admin.html              # Admin Dashboard
│
├── firestore.rules         # Database Security Rules
├── vercel.json             # Vercel Configuration
└── README.md               # You are here
```

## 📜 License
© 2026 Mark Overseas. All Rights Reserved.
Developed by **Bhumit Nasit**.
