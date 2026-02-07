const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'src', 'styles');
const files = ['style.css', 'responsive.css', 'product-detail.css'];

files.forEach(file => {
    const filePath = path.join(stylesDir, file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace relative paths with absolute public paths
        content = content.replace(/\.\.\/images\//g, '/images/');
        // Also handle "images/" just in case
        content = content.replace(/url\("images\//g, 'url("/images/');
        content = content.replace(/url\('images\//g, 'url(\'/images/');
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
