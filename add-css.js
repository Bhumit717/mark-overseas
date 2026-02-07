const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    if (!content.includes('logo-video.css')) {
        // Add CSS link after style.css
        content = content.replace(
            /(<link href="css\/style\.css[^>]*>)/,
            '$1\n\t<link href="css/logo-video.css" rel="stylesheet" type="text/css" />'
        );

        fs.writeFileSync(f, content, 'utf8');
        console.log('✓ Added CSS to:', f);
    }
});

console.log('\n✓ Complete!');
