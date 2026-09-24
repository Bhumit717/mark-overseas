const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
const problems = [];

function check(file, html) {
  const opens = (html.match(/<div/g) || []).length;
  const closes = (html.match(/<\/div>/g) || []).length;
  const secOpen = (html.match(/<section/g) || []).length;
  const secClose = (html.match(/<\/section>/g) || []).length;
  const aOpen = (html.match(/<a /g) || []).length;
  const aClose = (html.match(/<\/a>/g) || []).length;
  if (opens !== closes) problems.push(`${file}: div mismatch ${opens}/${closes}`);
  if (secOpen !== secClose) problems.push(`${file}: section mismatch ${secOpen}/${secClose}`);
  if (aOpen !== aClose) problems.push(`${file}: a mismatch ${aOpen}/${aClose}`);
  if (!html.trim().endsWith('</html>')) problems.push(`${file}: no closing html`);
}

files.forEach(f => check(f, fs.readFileSync(path.join(ROOT, f), 'utf8')));

// verify local asset references resolve
const assets = [];
files.forEach(f => {
  const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const refs = html.match(/(src|href)="([^"#]+\.(?:png|jpg|jpeg|svg|gif|webp|css|js|ico|woff2?|eot|ttf))"/g) || [];
  refs.forEach(r => {
    const url = r.match(/="([^"]+)"/)[1];
    if (url.startsWith('http') || url.startsWith('//')) return;
    assets.push({ file: f, url });
  });
});

const missing = [];
assets.forEach(a => {
  const fp = path.join(ROOT, decodeURIComponent(a.url.split('#')[0]));
  if (!fs.existsSync(fp)) missing.push(`${a.file} -> ${a.url}`);
});

console.log('Total html files:', files.length);
console.log('Structure problems:', problems.length ? problems : 'none');
const uniqueMissing = [...new Set(missing)];
console.log('Missing local assets:', uniqueMissing.length ? uniqueMissing : 'none');