// Generate responsive WebP variants for all <img> images referenced in the site.
// Rewrites each qualifying <img> tag with:
//   - srcset   : small -> large WebP widths + the original as the final tier
//   - sizes    : reasonable default (refined at runtime by ResponsiveImageManager)
//   - src      : the smallest variant (instant preview, "load only what is shown")
//   - data-full: the original full-resolution file (loaded only when zoomed/near full size)
// Run: node tools/responsive-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = process.cwd();
const WIDTHS = [320, 640, 960, 1280, 1600];
const MIN_WIDTH = 400; // only transform images wider than this
const MIN_BYTES = 30000; // skip tiny icons/logos
const OUT_DIR = 'images/responsive';

const IMG_RE = /<img\b[^>]*?src="(images\/[^"']+)"[^>]*>/g;

const htmlFiles = fs.readdirSync(ROOT).filter(
  (f) => f.endsWith('.html') && !fs.statSync(f).isDirectory()
);

function sizesForLine(line) {
  if (/height:\s*260|services-one__img/.test(line)) {
    return '(max-width: 767px) 50vw, 320px';
  }
  return '100vw';
}

function variantPath(src) {
  const parsed = path.parse(src);
  const rel = parsed.dir.replace(/^images[/\\]?/, '');
  return path.posix.join(OUT_DIR, rel, `${parsed.name}@`);
}

async function processFile(file, stats) {
  const absPath = path.join(ROOT, file);
  const html = fs.readFileSync(absPath, 'utf8');
  const tags = [...html.matchAll(IMG_RE)];
  if (!tags.length) return;

  const replacements = [];
  let changed = 0;

  for (const m of tags) {
    const full = m[0];
    const src = m[1];
    const abs = path.join(ROOT, src);
    if (!fs.existsSync(abs)) continue;

    let meta;
    try {
      meta = await sharp(abs).metadata();
    } catch (e) {
      continue;
    }
    if (!meta || !meta.width || meta.width <= MIN_WIDTH) continue;
    if (fs.statSync(abs).size < MIN_BYTES) continue;

    const origWidth = meta.width;
    const widths = WIDTHS.filter((w) => w < origWidth);
    if (!widths.length) continue;

    const vBase = variantPath(src);
    const variants = [];
    for (const w of widths) {
      const outFile = path.posix.join(vBase) + `${w}.webp`;
      const outAbs = path.join(ROOT, outFile);
      fs.mkdirSync(path.dirname(outAbs), { recursive: true });
      if (!fs.existsSync(outAbs)) {
        const buf = await sharp(abs)
          .resize({ width: w, withoutEnlargement: true })
          .webp({ quality: 82, alphaQuality: 90 })
          .toBuffer();
        fs.writeFileSync(outAbs, buf);
        stats.generated++;
      }
      variants.push({ w, file: outFile });
    }

    const srcsetParts = variants.map((v) => `${v.file} ${v.w}w`);
    if (origWidth > widths[widths.length - 1]) {
      srcsetParts.push(`${src} ${origWidth}w`);
    }

    const first = variants[0];
    const others = full
      .replace(/^<img\s*/i, '')
      .replace(/\s*>?$/i, '')
      .replace(/src=(["'])(.*?)\1/, ' ')
      .replace(/\/+$/, '');

    const next = `<img src="${first.file}" srcset="${srcsetParts.join(', ')}" sizes="${sizesForLine(
      full
    )}" data-full="${src}"${others} loading="lazy" decoding="async" onerror="this.onerror=null;this.src=this.dataset.full;">`;

    replacements.push({ full, next });
    changed++;
  }

  if (changed) {
    let newHtml = html;
    for (const r of replacements) {
      newHtml = newHtml.split(r.full).join(r.next);
    }
    fs.writeFileSync(absPath, newHtml);
    stats.files++;
    stats.tags += changed;
    console.log('  updated', file, '-', changed, 'imgs');
  }
}

(async () => {
  const stats = { generated: 0, files: 0, tags: 0 };
  for (const file of htmlFiles) {
    await processFile(file, stats);
  }
  let covered = 0;
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const x of html.matchAll(/data-full="(images\/[^"]+)"/g)) {
      try {
        covered += fs.statSync(path.join(ROOT, x[1])).size;
      } catch (e) {}
    }
  }
  console.log('\nVariants generated:', stats.generated);
  console.log('Files updated:', stats.files, '| img tags rewritten:', stats.tags);
  console.log('Original bytes now loaded on demand:', (covered / 1048576).toFixed(1), 'MB');
})();