const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

const files = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html') && (file.startsWith('product-') || file.startsWith('subproduct-')));

console.log('File | Category | Product Name');
console.log('--- | --- | ---');

files.forEach(file => {
    if (file === 'product-template.html') return;

    const content = fs.readFileSync(path.join(BASE_DIR, file), 'utf8');

    // Extract Breadcrumb: Home / Products / [CATEGORY] / Product
    // Pattern: <p><a href="index.html">Home</a> / <a href="our-products.html">Products</a> / ([^<]+) /
    // Or sometimes just: Home / Products / Product (Missing category)

    const breadcrumbRegex = /<p><a href="index\.html">Home<\/a>\s*\/\s*<a href="our-products\.html">Products<\/a>\s*\/\s*([^<]+)/i;
    const match = content.match(breadcrumbRegex);

    let category = 'UNKNOWN';
    let rawBreadcrumb = '';

    if (match) {
        rawBreadcrumb = match[1].trim();
        // Check if rawBreadcrumb contains another slash, meaning it has a category
        // Encoded slash? &slash; or just / 
        // HTML often has newlines or spaces.

        // Let's strip tags just in case
        const cleanText = rawBreadcrumb.replace(/<[^>]*>/g, '');

        // If the structure is Category / Product, split by /
        // But wait, the regex captures everything after "Products / ".
        // Example: "HERBS & SPICES /\n                        Cloves"

        const parts = cleanText.split('/').map(s => s.trim());

        if (parts.length > 1) {
            category = parts[0]; // The first part is category
        } else {
            category = 'NONE (Direct Product)'; // e.g. "Rice"
        }
    }

    fs.appendFileSync('audit_log.txt', `${file} | ${category} | ${rawBreadcrumb.replace(/\s+/g, ' ').substring(0, 50)}\n`);
});
