const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

const files = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html') && (file.startsWith('product-') || file.startsWith('subproduct-')));

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(BASE_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the start of the footer-top section
    const startRegex = /<div\s+class=["']footer-top["']\s*>/i;
    // Note: The previous file view showed <div class="footer-top"> exactly.
    // But let's be flexible.

    // Actually, looking at the file view: <div class="footer-top">
    // Let's use a simpler match first, but valid.

    const match = content.match(/<div\s+class=["']footer-top/i);

    if (match) {
        const startIndex = match.index;
        let currentIndex = startIndex + match[0].length;
        let openDivs = 1;

        while (openDivs > 0 && currentIndex < content.length) {
            const nextOpen = content.indexOf('<div', currentIndex);
            const nextClose = content.indexOf('</div>', currentIndex);

            if (nextClose === -1) break;

            if (nextOpen !== -1 && nextOpen < nextClose) {
                openDivs++;
                currentIndex = nextOpen + 4;
            } else {
                openDivs--;
                currentIndex = nextClose + 6;
            }
        }

        if (openDivs === 0) {
            // Found the end
            const before = content.substring(0, startIndex);
            const after = content.substring(currentIndex);

            // Optional: Clean up extra empty lines if any
            // but simple concatenation is safer to preserve other formatting

            fs.writeFileSync(filePath, before + after, 'utf8');
            console.log(`Removed footer-top from ${file}`);
            updatedCount++;
        } else {
            console.log(`Could not find closing div for footer-top in ${file}`);
        }
    }
});

console.log(`Total files updated: ${updatedCount}`);
