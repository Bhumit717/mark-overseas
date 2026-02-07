const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;
const HTML_FILE = path.join(BASE_DIR, 'our-products.html');
const IMG_DIR = path.join(BASE_DIR, 'images', 'products');

// Same slugify logic as the generator for consistency
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/[&/\\,]/g, ' ')
        .replace(/[\s'"()]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

const main = () => {
    console.log('🔄 Checking and fixing product links and images in our-products.html...');

    if (!fs.existsSync(HTML_FILE)) {
        console.error('❌ our-products.html not found!');
        return;
    }

    let content = fs.readFileSync(HTML_FILE, 'utf8');
    let updatedContent = content;
    let match;
    let updates = 0;

    // Regex to capture the entire anchor tag block for a product card
    // Captures: 
    // 1: href value
    // 2: image src
    // 3: product name (h2 content)
    // We use a non-greedy match for the content strings
    const cardRegex = /<a href="([^"]+)" class="product-card-link">\s*<div class="product-card">\s*<div class="image">\s*<img src="([^"]+)" alt="[^"]+" \/>\s*<\/div>\s*<div class="product-text text-center">\s*<h2>([^<]+)<\/h2>/g;

    // We can't easily use replace() with a callback for global replacement where we need async or complex logic 
    // that depends on external files, BUT checking file existence is blocking (fs.existsSync) so we can.
    // However, string.replace with regex iterates linearly.

    updatedContent = content.replace(cardRegex, (fullMatch, currentHref, currentImgBtn, productName) => {
        const slug = slugify(productName.trim());
        const expectedPage = `product-${slug}.html`;
        const expectedImage = `images/products/${slug}.png`;
        const absoluteImgPath = path.join(IMG_DIR, `${slug}.png`);

        let newHref = currentHref;
        let newImgSrc = currentImgBtn;
        let changed = false;

        // 1. Fix Link
        if (fs.existsSync(path.join(BASE_DIR, expectedPage))) {
            if (currentHref !== expectedPage) {
                newHref = expectedPage;
                changed = true;
            }
        }

        // 2. Fix Image (if the specific image exists, use it instead of placeholder/generic)
        if (fs.existsSync(absoluteImgPath)) {
            if (currentImgBtn !== expectedImage) {
                newImgSrc = expectedImage;
                changed = true;
            }
        }

        if (changed) {
            updates++;
            console.log(`✅ Fixed ${productName}:`);
            if (currentHref !== newHref) console.log(`   🔗 Link: ${currentHref} -> ${newHref}`);
            if (currentImgBtn !== newImgSrc) console.log(`   🖼️  Image: ${currentImgBtn} -> ${newImgSrc}`);

            // Reconstruct the block
            // Note: We blindly reconstruct based on the capture groups. 
            // Be careful to preserve exact whitespace if possible, but standardizing is usually fine.
            return `<a href="${newHref}" class="product-card-link">
							<div class="product-card">
								<div class="image">
									<img src="${newImgSrc}" alt="${productName}" />
								</div>
								<div class="product-text text-center">
									<h2>${productName}</h2>`;
        }

        return fullMatch;
    });

    if (updates > 0) {
        fs.writeFileSync(HTML_FILE, updatedContent, 'utf8');
        console.log(`\n🎉 Updated ${updates} product cards.`);
    } else {
        console.log('\n👍 No updates needed. All links/images appear correct.');
    }
};

main();
