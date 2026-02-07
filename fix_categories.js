const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const LOG_FILE = path.join(BASE_DIR, 'fix_categories_log.txt');

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};

const CATEGORIES = {
    "BEANS & NUTS": ["almonds", "cashew", "pistachios", "raisin", "walnut", "coconut", "betel-nut"],
    "GRAINS & PULSES": ["rice", "maize", "corn", "millet", "bajra", "sorghum", "jwar", "barley", "wheat", "oats", "pulses", "chickpeas", "lentils", "peas", "beans", "gram", "black-matpe", "cereals"],
    "OIL SEEDS": ["groundnut", "peanut", "sesame", "mustard", "rapeseed", "sunflower", "soybean", "castor", "linseed", "niger"],
    "ANIMAL FEED": ["cake", "meal", "bran"],
    // Default to HERBS & SPICES
};

const getCategory = (filename) => {
    const lowerName = filename.toLowerCase();

    // Check specific priorities (e.g. rapeseed-meal is feed, not oil seed)
    if (CATEGORIES["ANIMAL FEED"].some(k => lowerName.includes(k))) return "ANIMAL FEED";
    if (CATEGORIES["OIL SEEDS"].some(k => lowerName.includes(k))) return "OIL SEEDS";
    if (CATEGORIES["GRAINS & PULSES"].some(k => lowerName.includes(k))) return "GRAINS & PULSES";
    if (CATEGORIES["BEANS & NUTS"].some(k => lowerName.includes(k))) return "BEANS & NUTS";

    return "HERBS & SPICES";
};

const main = () => {
    const files = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html') && (file.startsWith('product-') || file.startsWith('subproduct-')));
    let count = 0;

    files.forEach(file => {
        if (file === 'product-template.html') return;

        const filePath = path.join(BASE_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');

        const newCategory = getCategory(file);

        // Regex to match the breadcrumb part:
        // <a href="our-products.html">Products</a> / [Old Category] /
        // OR <a href="our-products.html">Products</a> / [Product Name] (Missing category)

        // Strategy: 
        // 1. Find the "Products" link.
        // 2. Look at what follows.

        // Case 1: Existing Category present
        // products.html">Products</a> / SOME CATEGORY / Product Name
        // Regex: (<a href="our-products\.html">Products<\/a>)\s*\/\s*([^<]+)\s*\/\s*

        const categoryRegex = /(<a href="our-products\.html">Products<\/a>)\s*\/\s*([^<]+)\s*\/\s*/i;
        const match = content.match(categoryRegex);

        if (match) {
            const oldCategory = match[2].trim();
            // Check if match[2] is actually the product name (i.e. no category present)
            // If the line ends after match[2] or hits </p>, then match[2] is the product.
            // But the regex expects a trailing slash `/`.

            // If the regex matched, it means we found: Products / Something /
            // So 'Something' is the category.

            if (oldCategory !== newCategory) {
                // Replace
                const newStr = `$1 / ${newCategory} / `;
                content = content.replace(categoryRegex, newStr);
                fs.writeFileSync(filePath, content, 'utf8');
                log(`Updated ${file}: ${oldCategory} -> ${newCategory}`);
                count++;
            }
        } else {
            // Case 2: No Category present (Directly Product Name)
            // <a href="our-products.html">Products</a> / Product Name </p>

            const noCatRegex = /(<a href="our-products\.html">Products<\/a>)\s*\/\s*([^<]+)\s*<\/p>/i;
            const noCatMatch = content.match(noCatRegex);

            if (noCatMatch) {
                // We typically assume the regex matched "Products / Product Name".
                // But wait, if it matched `Products / Category / Product`, it would also match this broad regex?
                // `[^<]+` is greedy. 
                // If breadcrumb is `Products / Cat / Prod`, `[^<]+` grabs `Cat / Prod`.

                // Let's assume consistent formatting. 
                // If we want to INSERT the category.
                // We need to parse strict.

                // Let's just find `Products</a> / ` and replace with `Products</a> / Category / `
                // BUT we must avoid double insertion.

                // If the regex `Products</a> / Category /` (with trailing slash) DID NOT MATCH (checked above),
                // then we likely have `Products</a> / Product`.

                // So we can safely replace `Products</a> / ` with `Products</a> / Category / `

                const keyStr = '<a href="our-products.html">Products</a> / ';
                if (content.includes(keyStr)) {
                    content = content.replace(keyStr, `${keyStr}${newCategory} / `);
                    fs.writeFileSync(filePath, content, 'utf8');
                    log(`Inserted Category into ${file}: ${newCategory}`);
                    count++;
                }
            }
        }
    });

    log(`Total files updated: ${count}`);
};

main();
