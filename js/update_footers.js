const fs = require('fs');
const path = require('path');

const projectDir = path.resolve(__dirname, '..'); // assuming script is in js folder
const footerPath = path.join(projectDir, 'footer.html');
const footerContent = fs.readFileSync(footerPath, 'utf8');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const footerRegex = /<footer[\s\S]*?<\/footer>/i;
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, footerContent);
  } else {
    // Insert before </body>
    const bodyClose = /<\/body>/i;
    if (bodyClose.test(content)) {
      content = content.replace(bodyClose, footerContent + '\n</body>');
    } else {
      // Append at end
      content = content + '\n' + footerContent;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated', filePath);
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skip node_modules and other irrelevant dirs
      if (['node_modules', 'js', 'css', 'images', 'api', 'php', 'upload', 'mark-overseas-react'].includes(entry.name)) continue;
      walk(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(fullPath);
    }
  }
}

walk(projectDir);
