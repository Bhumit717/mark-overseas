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
# If you run the script, ensure you have internet access for placeholder images
```

### 3. Environment Variables
Create a `.env` file in the root directory to store your credentials locally. **DO NOT COMMIT THIS FILE**.
```env
GMAIL_USER="markoverseas28@gmail.com"
GMAIL_PASS="your-app-specific-password"
```

### 4. Run Locally
You can use `live-server` or any static file server.
```bash
# If you have VS Code Live Server extension, just "Go Live".
# Or use python:
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
   - Framework Preset: **Other** (since it's mostly static HTML).
   
3. **Configure Environment Variables (Vital)**:
   - In Vercel Project Settings > Environment Variables, add:
     - `GMAIL_USER`: `markoverseas28@gmail.com`
     - `GMAIL_PASS`: `[Your Gmail App Password]`

4. **Deploy**: Vercel will auto-detect the `/api` directory and deploy the serverless functions.

---

## 🛡️ Admin Dashboard
Access the dashboard at: `https://www.mark-overseas.com/admin.html`

- **Password**: `Mark@Overseas321` (Default)
- **Functions**:
  - View all inquiries.
  - Delete spam/test submissions.
  - Download reports as PDF.

---

## 📂 Project Structure
```
mark-overseas/
│
├── api/                    # Serverless Functions (Backend)
│   └── send-email.js       # Node.js script for sending emails via SMTP
│
├── css/                    # Stylesheets (Custom + Libs)
├── js/                     # JavaScript files
├── images/                 # Assets
│
├── product-*.html          # Generated Product Pages (do not edit manually)
├── generate-product-pages.py # Python script to generate product HTMLs
│
├── index.html              # Homepage
├── about-us.html           # About Page
├── contact-us.html         # Contact Form Page
├── admin.html              # Protected Admin Dashboard
│
├── firebase.json           # Firebase Hosting config (optional)
├── firestore.rules         # Database Security Rules
├── vercel.json             # Vercel Configuration
└── README.md               # You are here
```

## 📜 License
© 2026 Mark Overseas. All Rights Reserved.
Developed by **Bhumit Nasit**.
