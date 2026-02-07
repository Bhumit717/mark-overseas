const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');

// Configuration
const BASE_DIR = __dirname;
const MARKDOWN_FILE = path.join(BASE_DIR, 'MARK-OVERSEAS-PRODUCTS-REFERENCE.md');
const TEMPLATE_FILE = path.join(BASE_DIR, 'product-template.html');
const IMG_DIR = path.join(BASE_DIR, 'images', 'products');
const LOG_FILE = path.join(BASE_DIR, 'generation_log.txt');

// Ensure image directory exists
if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
}

// Logger
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};

// Helper: Slugify
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/[&/\\,]/g, ' ') // Replace special chars with space
        .replace(/[\s'"()]+/g, '-') // Replace spaces/quotes with hyphen
        .replace(/[^a-z0-9-]/g, '') // Remove invalid chars
        .replace(/-+/g, '-') // Collapse dashes
        .replace(/^-+|-+$/g, ''); // Trim dashes
};

// Helper: Download Image
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => { }); // Delete partial file
                return reject(new Error(`Status Code: ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

// Helper: Ensure Image Exists
const ensureImage = async (slug, productName) => {
    const filename = `${slug}.png`;
    const filepath = path.join(IMG_DIR, filename);

    if (fs.existsSync(filepath)) {
        return filename;
    }

    const url = `https://dummyimage.com/600x400/ffffff/000000&text=${encodeURIComponent(productName)}`;
    try {
        log(`    Downloading placeholder for ${slug}...`);
        await downloadImage(url, filepath);
        log(`    ✅ Downloaded.`);
    } catch (err) {
        log(`    ❌ Failed to download image for ${slug}: ${err.message}`);
    }
    return filename;
};

// Main Process
const main = async () => {
    log('🚀 Starting Page Generation Script (Node.js)...');

    if (!fs.existsSync(MARKDOWN_FILE)) {
        log(`❌ Markdown reference file not found: ${MARKDOWN_FILE}`);
        return;
    }
    if (!fs.existsSync(TEMPLATE_FILE)) {
        log(`❌ Template file not found: ${TEMPLATE_FILE}`);
        return;
    }

    const markdownContent = fs.readFileSync(MARKDOWN_FILE, 'utf8');
    const templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf8');

    const lines = markdownContent.split('\n');
    let currentCategory = 'General';
    let productCount = 0;

    // Pattern to find product rows: | **Name** |
    // Matches lines like: | **Bishop's Weed** | ...
    const productRowRegex = /\|\s*\*\*([^*]+)\*\*\s*\|/;
    const categoryRegex = /^##\s+(.+)/;

    // We process sequentially to handle image downloads nicely
    for (const line of lines) {
        // Check for Category
        const catMatch = line.match(categoryRegex);
        if (catMatch) {
            currentCategory = catMatch[1].trim();
            continue;
        }

        // Check for Product
        const prodMatch = line.match(productRowRegex);
        if (prodMatch) {
            const rawName = prodMatch[1].trim();
            const slug = slugify(rawName);

            log(`📦 Processing: ${rawName} (${currentCategory})`);

            // 1. Ensure Image
            const imageFile = await ensureImage(slug, rawName);

            // 2. Prepare Data
            const shortDesc = rawName.length > 120 ? rawName.substring(0, 120) + '...' : rawName;
            const desc = `${rawName} – High-quality premium product sourced directly from the best regions in India. Known for its purity and authentic flavor.`;
            const uses = "Extensively used in culinary dishes, traditional medicine, and industrial applications.";

            // 3. Fill Template
            let html = templateContent
                .replace(/\{name\}/g, rawName)
                .replace(/\{short_desc\}/g, shortDesc)
                .replace(/\{desc\}/g, desc)
                .replace(/\{uses\}/g, uses)
                .replace(/\{image\}/g, imageFile)
                .replace(/\{category\}/g, currentCategory)
                .replace(/\{category_upper\}/g, currentCategory.toUpperCase());

            // 4. Write Files
            const productPath = path.join(BASE_DIR, `product-${slug}.html`);
            const subProductPath = path.join(BASE_DIR, `subproduct-${slug}.html`);

            fs.writeFileSync(productPath, html, 'utf8');
            fs.writeFileSync(subProductPath, html, 'utf8'); // User requested subproduct pages too

            productCount++;
        }
    }

    log(`\n✨ Successfully generated ${productCount * 2} pages (${productCount} products).`);
    log(`✨ Check 'generation_log.txt' for details.`);
};

main().catch(err => {
    console.error(err);
    log(`❌ Fatal Error: ${err.message}`);
});
