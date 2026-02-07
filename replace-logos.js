const fs = require('fs');
const path = require('path');

// Video path
const videoPath = 'images/grok-video-29b235bf-6771-4c9c-8ccd-4c35d317a66a (online-video-cutter.com).mp4';

// Video HTML template
const videoTemplate = `<video class="logo-video" muted playsinline webkit-playsinline>
					<source src="${videoPath}" type="video/mp4">
					<img src="images/mark-logo.png" alt="Mark Overseas" style="max-height: 80px; width: auto;" />
				</video>`;

// Function to replace logo in a file
function replaceLogo(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // First, remove any existing video tags to avoid duplication
        const existingVideoPattern = /<video class="logo-video"[^>]*>[\s\S]*?<\/video>/g;
        const hasExistingVideo = existingVideoPattern.test(content);

        if (hasExistingVideo) {
            console.log(`- Already has video: ${path.basename(filePath)}`);
            return false;
        }

        // Replace all img tags with mark-logo.png
        const logoPattern = /<img[^>]*src="images\/mark-logo\.png"[^>]*>/g;
        const matches = content.match(logoPattern);

        if (matches && matches.length > 0) {
            content = content.replace(logoPattern, videoTemplate);
            modified = true;
        }

        // Add CSS link if not present
        if (!content.includes('logo-video.css')) {
            const cssPattern = /<link href="css\/custom_translate\.css[^>]*>/;
            if (cssPattern.test(content)) {
                content = content.replace(
                    cssPattern,
                    '$&\n\t<link href="css/logo-video.css" rel="stylesheet" type="text/css" />'
                );
                modified = true;
            }
        }

        // Add JS link if not present
        if (!content.includes('logo-video.js')) {
            const jsPattern = /<script src="js\/owl\.carousel\.min\.js"><\/script>/;
            if (jsPattern.test(content)) {
                content = content.replace(
                    jsPattern,
                    '$&\n\t<script src="js/logo-video.js"></script>'
                );
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✓ Updated: ${path.basename(filePath)}`);
            return true;
        } else {
            console.log(`- Skipped: ${path.basename(filePath)} (no changes needed)`);
            return false;
        }
    } catch (error) {
        console.error(`✗ Error processing ${filePath}:`, error.message);
        return false;
    }
}

// Get all HTML files
const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(rootDir, file));

console.log(`Found ${htmlFiles.length} HTML files\n`);

let updatedCount = 0;
htmlFiles.forEach(file => {
    if (replaceLogo(file)) {
        updatedCount++;
    }
});

console.log(`\n✓ Complete! Updated ${updatedCount} files`);
