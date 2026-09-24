const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\bhumi\\Desktop\\clone\\mark-overseas';
const OUT = path.join(__dirname, '..', 'data', 'products.json');

const files = fs.readdirSync(SRC).filter(f => /^product-.+\.html$/.test(f) && !/product-(template|total)\.html$/i.test(f));

const clean = s => (s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function extractText(html, openTag, closeTag) {
  const i = html.indexOf(openTag);
  if (i === -1) return '';
  const start = i + openTag.length;
  const j = html.indexOf(closeTag, start);
  if (j === -1) return '';
  return html.slice(start, j);
}

const products = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(SRC, file), 'utf8');
  const slug = file.replace(/\.html$/, '');

  const title = clean(extractText(html, '<h1 class="product-title">', '</h1>'));
  const pageTitleMatch = html.match(/inner-section-banner-text">\s*<h[12]>([\s\S]*?)<\/h[12]>/);
  const pageTitle = pageTitleMatch ? clean(pageTitleMatch[1]) : '';
  const catRaw = clean(extractText(html, '/ <a href="our-products.html">Products</a>', '</p>'));
  const shortDesc = clean(extractText(html, '<p class="product-short-desc">', '</p>'));

  const catMatch = html.match(/<div class="product-category"><i class="fas fa-tag"><\/i>\s*([^<]+)/);
  const category = catMatch ? clean(catMatch[1]) : (catRaw.split('/').filter(Boolean).slice(-1)[0] || '');

  const imgMatch = html.match(/<div class="product-image-card"><img[^>]+src="([^"]+)"/);
  let image = imgMatch ? imgMatch[1] : '';

  const vImgMatch = html.match(/<div class="variant-image">[\s\S]*?<img[^>]+src="([^"]+)"/);
  if (!image && vImgMatch) image = vImgMatch[1];

  // variant intro paragraph
  const vIntroMatch = html.match(/<p class="text-center mb-5"\s*(?:style="[^"]*")?>([\s\S]*?)<\/p>/);
  const variantIntro = vIntroMatch ? clean(vIntroMatch[1]) : '';

  // variant title + description
  const vTitleMatch = html.match(/<div class="variant-details">[\s\S]*?<span class="variant-badge">[^<]*<\/span>\s*<h3>([^<]*)<\/h3>/);
  const variantTitle = vTitleMatch ? clean(vTitleMatch[1]) : '';
  const vDescMatch = html.match(/<p class="variant-description">([\s\S]*?)<\/p>/);
  const variantDesc = vDescMatch ? clean(vDescMatch[1].replace(/<[^>]+>/g, '')) : '';

  // variant specs table rows
  const variantSpecs = [];
  const vSpecBlock = extractText(html, '<div class="variant-specs">', '</table>');
  let start = vSpecBlock.indexOf('<table>');
  if (start !== -1) {
    const st = html.indexOf('<div class="variant-specs">') + '<div class="variant-specs">'.length;
    const tableStart = html.indexOf('<table', st);
    const tableEnd = html.indexOf('</table>', tableStart);
    const tableHtml = html.slice(tableStart, tableEnd);
    for (const m of tableHtml.matchAll(/<tr>\s*<td>([\s\S]*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<\/tr>/gs)) {
      variantSpecs.push({ label: clean(m[1]), value: clean(m[2]) });
    }
  }

  const titleTag = clean(extractText(html, '<title>', '</title>'));

  // description paragraphs inside premium-description
  const descBlock = extractText(html, '<div class="premium-description">', '</div>');
  const descParas = [...descBlock.matchAll(/<p>(.*?)<\/p>/gs)].map(m => clean(m[1]));

  const specBlock = extractText(html, '<table class="spec-table">', '</table>');
  const specRows = [];
  for (const m of specBlock.matchAll(/<tr>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<\/tr>/gs)) {
    specRows.push({ label: clean(m[1]), value: clean(m[2]) });
  }

  const accordion = [];
  const accBlocks = [...html.matchAll(/<div class="accordion-body">(.*?)<\/div>/gs)];
  accBlocks.forEach((m, idx) => {
    accordion.push({ id: idx === 0 ? 'shipping' : 'contact', text: clean(m[1]) });
  });

  const waMatch = html.match(/href="(https:\/\/api\.whatsapp\.com\/[^"]+)"/g);
  const whatsapp = waMatch ? waMatch[0].replace(/^href="/, '').replace(/"$/, '') : '';

  products.push({
    slug,
    title: title || pageTitle || variantTitle || slug,
    pageTitle,
    variantTitle,
    variantIntro,
    variantDesc,
    titleTag,
    category,
    breadcrumb: catRaw,
    shortDesc,
    image,
    description: descParas.length ? descParas : (variantDesc ? [variantDesc] : [shortDesc]),
    specs: specRows.length ? specRows : variantSpecs,
    accordion,
    whatsapp
  });
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(products, null, 2));
console.log('Wrote', products.length, 'products to', OUT);
const cats = [...new Set(products.map(p => p.category))];
console.log('Categories:', cats.join(' | '));