const fs = require('fs');
const path = require('path');

const products = require('../data/products.json');
const OUT = path.join(__dirname, '..', 'data', 'site-data.json');

const CATEGORIES = [
  'Oil Seeds',
  'Herbs & Spices',
  'Grains & Pulses',
  'Edible Nuts',
  'Animal Feed',
  'Fresh Produce',
  'Snacks & Confectionery'
];

function categoryFor(slug) {
  if (/^product-sesame/.test(slug)) return 'Oil Seeds';
  if (/^product-groundnut$/.test(slug)) return 'Oil Seeds';
  if (/^product-groundnut-(bold|java)$/.test(slug)) return 'Oil Seeds';
  if (slug === 'product-peanut-blanched') return 'Oil Seeds';
  if (slug === 'product-groundnut-oil-cakes') return 'Animal Feed';
  if (/^product-mustard/.test(slug)) return 'Oil Seeds';
  if (['product-almonds', 'product-cashew', 'product-desiccated-coconut', 'product-pistachios', 'product-raisin-kismiss-dry-grapes'].includes(slug)) return 'Edible Nuts';
  if (['product-cottonseed-de-oiled-cake', 'product-rapeseed-meal', 'product-rice-bran-cake', 'product-rice-bran-de-oiled-cake', 'product-soya-cake', 'product-soya-de-oiled-cake'].includes(slug)) return 'Animal Feed';
  if (['product-barley', 'product-cereals', 'product-maize', 'product-maize-corn', 'product-millet', 'product-millet-bajra', 'product-rice', 'product-sorghum-jwar', 'product-black-matpe', 'product-desi-chickpeas', 'product-kabuli-chickpeas', 'product-lentils', 'product-yellow-peas'].includes(slug)) return 'Grains & Pulses';
  if (slug === 'product-fruits-vegetables') return 'Fresh Produce';
  if (['product-roasted-gram', 'product-roasted-peas'].includes(slug)) return 'Snacks & Confectionery';
  return 'Herbs & Spices';
}

const IMAGE_OVERRIDES = {
  'product-rice': 'images/products/rice.png',
  'product-fruits-vegetables': 'images/products/fruits and vegitables.png',
  'product-basil': 'images/products/basil.png',
  'product-chilli': 'images/products/chilli.png',
  'product-dill': 'images/products/dill.png',
  'product-dill-seeds': 'images/products/dill-seeds.png',
  'product-long-pepper': 'images/products/pepper-long.png',
  'product-sweet-flag-vacha': 'images/products/sweet-flag.png',
  'product-bishops-weed': 'images/products/bishop-s-weed-ajwain.png',
  'product-sesame': 'images/products/sesame.png',
  'product-groundnut': 'images/products/groundnut.png',
  'product-mustard': 'images/products/mustard.png',
  'product-roasted-gram': 'images/products/roasted-gram-1.png'
};

// variant pages generated but hidden from the category listing
const VARIANT_SLUGS = new Set([
  'product-sesame-natural', 'product-sesame-hulled', 'product-sesame-black', 'product-sesame-brown',
  'product-groundnut-bold', 'product-groundnut-java', 'product-peanut-blanched',
  'product-mustard-yellow', 'product-mustard-brown',
  'product-bishops-weed', 'product-pepper-long', 'product-sweet-flag-vacha',
  'product-maize', 'product-millet',
  'product-soya-cake', 'product-rice-bran-cake'
]);

const cleaned = products.map(p => {
  const category = categoryFor(p.slug);
  let image = IMAGE_OVERRIDES[p.slug] || p.image || 'images/products/' + p.slug.replace('product-', '') + '.png';
  const imagePath = path.join(__dirname, '..', image.replace(/^\.\//, ''));
  if (!fs.existsSync(imagePath)) {
    image = 'images/products/1000_F_158424089_mpOpMsJTiWpZTU7gRSbna4KncvYdkzzN-removebg-preview.png';
  }
  const name = p.title
    .replace(/^Premium\s+/i, '')
    .replace(/\s+\(.*\)$/, '');
  const short = p.shortDesc || p.variantIntro || p.titleTag || name;
  return {
    slug: p.slug,
    name,
    rawTitle: p.title,
    category,
    image,
    short,
    description: p.description.length ? p.description : [short],
    specs: p.specs || [],
    whatsapp: p.whatsapp
      || 'https://api.whatsapp.com/send?phone=+919978925996&text=Hi, I am interested in ' + encodeURIComponent(name) + '.',
    showInListing: !VARIANT_SLUGS.has(p.slug)
  };
});

const CATEGORY_META = [
  { name: 'Oil Seeds', id: 'oil-seeds', label: 'Oil Seeds' },
  { name: 'Herbs & Spices', id: 'spices-herbs', label: 'Spices & Herbs' },
  { name: 'Grains & Pulses', id: 'grains-pulses', label: 'Grains & Pulses' },
  { name: 'Edible Nuts', id: 'edible-nuts', label: 'Edible Nuts' },
  { name: 'Animal Feed', id: 'animal-feed', label: 'Animal Feed' },
  { name: 'Fresh Produce', id: 'fresh-produce', label: 'Fresh Produce' },
  { name: 'Snacks & Confectionery', id: 'snacks', label: 'Snacks & Confectionery' }
];

const categoryGroups = CATEGORY_META
  .map(meta => ({
    name: meta.name,
    label: meta.label,
    id: meta.id,
    items: cleaned.filter(p => p.category === meta.name && p.showInListing)
  }))
  .filter(g => g.items.length);

const data = {
  site: {
    name: 'Mark Overseas',
    tagline: 'Think Agro. Think Mark',
    title: 'Mark Overseas - Agro Commodities Exporter & Supplier',
    description: 'Mark Overseas is a prominent Export-Import Representative company based in India. We specialize in agricultural commodities like Oil Seeds, Spices, Grains, Pulses and Animal Feed.',
    phoneDisplay: '+91 99789 25996',
    phone: '+919978925996',
    whatsapp: 'https://api.whatsapp.com/send?phone=+919978925996&text=Hi%20Team',
    email: 'info@mark-overseas.com',
    email2: 'markoverseas28@gmail.com',
    address: '#202-B, Imperial Heights, 150 Ft. Ring Road, Rajkot - 360005 (Gujarat), India',
    addressLines: ['#202-B, Imperial Heights,', '150 Ft. Ring Road,', 'Rajkot – 360005, Gujarat, India'],
    mapEmbed: 'https://maps.google.com/maps?q=Imperial%20Heights%20150%20Ft%20Ring%20Road%20Rajkot%20Gujarat&t=&z=15&ie=UTF8&iwloc=&output=embed',
    social: {
      facebook: 'https://www.facebook.com/markoverseas',
      linkedin: 'https://www.linkedin.com/company/mark-overseas'
    },
    credits: 'Designed & Developed By : BHUMIT NASIT',
    creditsLink: 'https://bhumitnasit.vercel.app/'
  },
  nav: [
    { label: 'Home', href: 'index.html' },
    { label: 'About Us', href: 'about-us.html' },
    { label: 'Our Products', href: 'our-products.html', active: 'our-products' },
    { label: 'Exports', href: 'exports.html' },
    { label: 'Industries We Serve', href: 'industries-we-serve.html' },
    { label: 'Certificates', href: 'certificates.html' },
    { label: 'Contact Us', href: 'contact-us.html' }
  ],
  productsDropdown: [
    { label: 'Oil Seeds', href: 'our-products.html#oil-seeds' },
    { label: 'Spices & Herbs', href: 'our-products.html#spices-herbs' },
    { label: 'Grains & Pulses', href: 'our-products.html#grains-pulses' },
    { label: 'Edible Nuts', href: 'our-products.html#edible-nuts' },
    { label: 'Animal Feed', href: 'our-products.html#animal-feed' },
    { label: 'Fresh Produce', href: 'our-products.html#fresh-produce' }
  ],
  categories: categoryGroups,
  products: cleaned,
  featured: [
    'product-sesame',
    'product-cumin',
    'product-groundnut',
    'product-turmeric',
    'product-rice',
    'product-soya-de-oiled-cake'
  ],
  markets: {
    overseas: ['India', 'Vietnam', 'Thailand', 'Africa', 'South America', 'Middle East', 'Europe', 'USA', 'Southeast Asia', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Malaysia', 'Singapore', 'Oman', 'Qatar'],
    domestic: ['Gujarat', 'Rajkot', 'Mumbai', 'Ahmedabad', 'Delhi', 'Chennai', 'Hyderabad', 'Bengaluru', 'Kolkata']
  },
  certificates: [
    { name: 'FSSAI', desc: 'Food Safety and Standards Authority of India' },
    { name: 'APEDA', desc: 'Agricultural and Processed Food Products Export Development Authority' },
    { name: 'Spices Board', desc: 'Spices Board of India' }
  ]
};

fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log('Wrote site-data.json');
console.log('Products:', data.products.length);
data.categories.forEach(g => console.log('  ' + g.name + ': ' + g.items.length));
const missing = data.products.filter(p => !fs.existsSync(path.join(__dirname, '..', 'images', p.image.replace(/^images\//, ''))));
console.log('Products with possibly missing image files:', missing.length);
missing.forEach(p => console.log('   ', p.slug, '->', p.image));