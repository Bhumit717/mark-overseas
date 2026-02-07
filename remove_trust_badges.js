const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

const files = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html') && (file.startsWith('product-') || file.startsWith('subproduct-')));

let updatedCount = 0;

files.forEach(file => {
    const filePath = path.join(BASE_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Find the start of the trust badges section
    // Use regex to find the start index
    const startRegex = /<div\s+class=["']trust-badges/i;
    const match = content.match(startRegex);

    if (match) {
        const startIndex = match.index;
        let currentIndex = startIndex + match[0].length;
        let openDivs = 1;

        while (openDivs > 0 && currentIndex < content.length) {
            // Check for next tag
            const nextOpen = content.indexOf('<div', currentIndex);
            const nextClose = content.indexOf('</div>', currentIndex);

            if (nextClose === -1) break; // Should not happen in valid HTML

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
            // Remove the block
            const before = content.substring(0, startIndex);
            const after = content.substring(currentIndex);

            fs.writeFileSync(filePath, before + after, 'utf8');
            console.log(`Removed trust-badges from ${file}`);
            updatedCount++;
        } else {
            console.log(`Could not find closing div for trust-badges in ${file}`);
        }
    }
});

console.log(`Total files updated: ${updatedCount}`);
