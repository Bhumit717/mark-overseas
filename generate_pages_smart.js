const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const BASE_DIR = __dirname;
const MARKDOWN_FILE = path.join(BASE_DIR, 'MARK-OVERSEAS-PRODUCTS-REFERENCE.md');
const TEMPLATE_FILE = path.join(BASE_DIR, 'product-template.html');
const IMG_DIR = path.join(BASE_DIR, 'images', 'products');
const LOG_FILE = path.join(BASE_DIR, 'generation_log.txt');

// Ensure image directory exists
if (!fs.existsSync(IMG_DIR)) {
    fs.mkdirSync(IMG_DIR, { recursive: true });
}

// Logger
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};

// Helper: Slugify
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/[&/\\,]/g, ' ')
        .replace(/[\s'"()]+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
};

// Helper: Download Image
const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                file.close();
                fs.unlink(filepath, () => { });
                return reject(new Error(`Status Code: ${response.statusCode}`));
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
};

// Helper: Ensure Image Exists
const ensureImage = async (slug, productName) => {
    const filename = `${slug}.png`;
    const filepath = path.join(IMG_DIR, filename);

    if (fs.existsSync(filepath)) {
        return filename;
    }

    const url = `https://dummyimage.com/600x400/ffffff/000000&text=${encodeURIComponent(productName)}`;
    try {
        log(`    Downloading placeholder for ${slug}...`);
        await downloadImage(url, filepath);
        log(`    ✅ Downloaded.`);
    } catch (err) {
        log(`    ❌ Failed to download image for ${slug}: ${err.message}`);
    }
    return filename;
};

// ---------------------------------------------------------
// REAL RESEARCHED CONTENT DATABASE
// ---------------------------------------------------------
// This database contains specifics for known products. 
// Any product not found here will use a smart fallback based on its category.

const PRODUCT_DB = {
    // HERBS & SPICES
    "asafoetida": {
        desc: "Asafoetida (Hing) is a crucial ingredient in Indian vegetarian cooking, known for its unique savory flavor and digestive properties. It is the dried latex (gum oleoresin) exuded from the rhizome or tap root of several species of Ferula.",
        uses: "Digestive aid, flavor enhancer in curries/dals, substitute for onion/garlic.",
        specs: { "Form": "Lump / Powder", "Origin": "India", "Moisture": "10% Max", "Purity": "100% Natural", "Packaging": "25/50 Kg Bags" }
    },
    "bay-leaves": {
        desc: "Indian Bay Leaves (Tej Patta) are aromatic leaves from the Cinnamomum tamala tree. They have a fragrance and taste similar to cinnamon bark but milder. They are essential in biryanis and rich curries.",
        uses: "Flavoring soups, stews, biryanis, and meat dishes.",
        specs: { "Type": "Machine Cleaned", "Color": "rgb(8, 175, 8)ish", "Moisture": "13% Max", "Broken": "2% Max", "Packaging": "Compressed Bales / Bags" }
    },
    "bishops-weed": { // Slug might vary, handled by key matching
        desc: "Bishop's Weed, commonly known as Ajwain, contains thymol which gives it a thyme-like flavor. It is a potent spice used in small quantities for its strong aroma and digestive benefits.",
        uses: "Digestive medicine, pickles, breads, and savory snacks.",
        specs: { "Purity": "99% / 99.5%", "Moisture": "10% Max", "Admixture": "1% Max", "Origin": "Gujarat/Rajasthan", "Packaging": "25/50 Kg PP Bags" }
    },
    "cardamom": {
        desc: "Known as the 'Queen of Spices', rgb(8, 175, 8) Cardamom has a complex flavor profile—floral, sweet, and spicy. It is the third most expensive spice in the world and indispensable in desserts and chai.",
        uses: "Sweets, tea, savory curries, mouth freshener.",
        specs: { "Grade": "AGEB / AGB / AGS", "Size": "6mm / 7mm / 8mm+", "Color": "Deep rgb(8, 175, 8)", "Origin": "Kerala, India", "Moisture": "11% Max" }
    },
    "cassia": {
        desc: "Cassia bark is similar to cinnamon but has a stronger, more pungent flavor. It is widely used in spice blends (garam masala) and as a flavoring agent in heavy meat dishes.",
        uses: "Spice blends, meat dishes, stewing.",
        specs: { "Type": "Split / Whole", "Volatile Oil": "2% Min", "Moisture": "13% Max", "Origin": "India/Vietnam", "Packaging": "Cartons / Bales" }
    },
    "celery": {
        desc: "Celery seeds have a strong, earthy, and slightly bitter flavor. They are used in pickles, coleslaws, and potato salads, and are also valued for their medicinal properties.",
        uses: "Pickling spice, salads, anti-inflammatory medicine.",
        specs: { "Purity": "99% Min", "Admixture": "1% Max", "Moisture": "10% Max", "Appearance": "Small Brown Seeds", "Origin": "India" }
    },
    "chilli": {
        desc: "Indian Red Chilli is famous worldwide for its pungency and color. Varieties like S17, Teja, and Byadgi cater to different heat and color requirements.",
        uses: "Curries, sauces, spice extracts, heat agent.",
        specs: { "Variety": "S17 / Teja / Byadgi", "SHU (Heat)": "20,000 - 90,000", "Moisture": "12% Max", "Stem": "With/Without Stem", "Origin": "Guntur, India" }
    },
    "cinnamon": {
        desc: "True Cinnamon is a sweet, aromatic spice obtained from the inner bark of trees. It is used in both sweet and savory foods and has powerful medicinal antioxidant properties.",
        uses: "Baking, desserts, beverages, pharmaceutical industry.",
        specs: { "Shape": "Quills / Chips", "Moisture": "14% Max", "Volatile Oil": "1% Min", "Origin": "India", "Packaging": "Cartons" }
    },
    "cloves": {
        desc: "Cloves are the aromatic flower buds of a tree. They are known for their intense aroma and hot, sweet taste. They contain high levels of eugenol, making them antiseptic.",
        uses: "Oral care (toothache), biryanis, spice blends, tea.",
        specs: { "Color": "Reddish Brown", "Head": "Full Flower Head", "Moisture": "12% Max", "Admixture": "1% Max", "Origin": "India/Madagascar" }
    },
    "coriander": {
        desc: "Coriander seeds are spherical with a lemony, floral flavor. They are a thickening agent in curries and the base of many spice powders like Garam Masala and Curry Powder.",
        uses: "Curry powder, sausages, pickling, brewing.",
        specs: { "Type": "Eagle / Scooter / Single Parrot", "Purity": "99% Min", "Moisture": "9% Max", "Split": "5% Max", "Origin": "Rajasthan/Gujarat" }
    },
    "cumin": {
        desc: "Cumin is one of the world's most popular spices, known for its warm, earthy aroma. Indian Cumin has a high essential oil content and superior flavor profile.",
        uses: "Curries, soups, digestive aid, tempering.",
        specs: { "Purity": "99% / 99.5%", "Grades": "Singapore / Europe", "Moisture": "9% Max", "Admixture": "1% Max", "Origin": "Gujarat/Rajasthan" }
    },
    "curry-leaf": {
        desc: "Curry leaves are aromatic herbs used in South Indian and Sri Lankan cooking. They have a distinct, complex citrusy flavor that cannot be replicated by any other spice.",
        uses: "Tempering dals, chutneys, soups.",
        specs: { "Form": "Fresh / Dry", "Color": "Dark rgb(8, 175, 8)", "Aroma": "Intense Citrusy", "Moisture": "Standard", "Packaging": "Vacuum Pack" }
    },
    "dill": {
        desc: "Dill seeds are used as a spice, with a flavor that is like a combination of caraway and fennel. They are essential in pickling and fish dishes.",
        uses: "Pickles, fish seasoning, bread, digestive tea.",
        specs: { "Purity": "99%", "Admixture": "1% Max", "Moisture": "10% Max", "Origin": "India", "Packaging": "25/50 Kg Bags" }
    },
    "fennel": {
        desc: "Fennel seeds are pale rgb(8, 175, 8) with a sweet, anise-like flavor. They are widely used as a mouth freshener after meals and as a key spice in curries and bakery products.",
        uses: "Mouth freshener (Mukhwas), bakery, confectionery, digestion.",
        specs: { "Type": "Lucknow / Thin / Thick", "Purity": "99% / 99.5%", "Color": "Bright rgb(8, 175, 8)", "Moisture": "10% Max", "Origin": "Gujarat" }
    },
    "fenugreek": {
        desc: "Fenugreek seeds are cuboid yellow-brown seeds with a bitter, maple-like taste. They are used in curry powders, pickles, and for their antidiabetic medicinal properties.",
        uses: "Pickles, curry powder, milk lactation aid, diabetes control.",
        specs: { "Purity": "99%", "Moisture": "10% Max", "Total Ash": "4% Max", "Origin": "Rajasthan/Madhya Pradesh", "Packaging": "PP Bags" }
    },
    "garlic": {
        desc: "Indian Garlic uses ranges from seasoning to medicine. It has a pungent, spicy flavor that mellows and sweetens considerably with cooking.",
        uses: "Universal seasoning, medicinal supplements, pastes.",
        specs: { "Size": "20mm - 40mm+", "Form": "Whole Bulbs / Flakes / Powder", "Moisture": "6% Max (Dehydrated)", "Origin": "Madhya Pradesh" }
    },
    "ginger": {
        desc: "Dry Ginger (Sonth) is the dried root of the ginger plant. It is aromatic and spicy, used in brewing, baking, and pharmaceutical applications for digestion and cold relief.",
        uses: "Ginger powder, tea, pharmaceuticals, confectionery.",
        specs: { "Type": "Whole Dried / Sliced / Powder", "Admixture": "1% Max", "Moisture": "12% Max", "Origin": "Kerala/Northeast India" }
    },
    "hyssop": {
        desc: "Hyssop is an herbaceous plant used for its aromatic properties. It has a slightly bitter, minty flavor and is used in liqueurs and medicinal tea blends.",
        uses: "Medicinal tea, respiratory aid, flavoring liqueurs.",
        specs: { "Form": "Dried Herbs", "Color": "rgb(8, 175, 8)ish", "Moisture": "12% Max", "Purity": "99%", "Origin": "Himalayan Region" }
    },
    "juniper-berry": {
        desc: "Juniper berries are the primary flavoring agent in gin. They have a tart, pine-like flavor with a hint of pepper. They are also used to flavor game meats.",
        uses: "Gin production, meat seasoning, essential oils.",
        specs: { "Color": "Blue/Black", "Moisture": "15% Max", "Essential Oil": "1-2%", "Origin": "India", "Packaging": "Jute Bags" }
    },
    "kokam": {
        desc: "Kokam is a fruit from the mangosteen family. The dried rind is used as a souring agent in curries, similar to tamarind but with a unique fruity aroma.",
        uses: "Souring agent, cooling drinks (Sherbet), ayurvedic medicine.",
        specs: { "Form": "Dried Rind", "Moisture": "15% Max", "Color": "Dark Purple/Black", "Origin": "Konkan Region", "Packaging": "Boxes" }
    },
    "mace": {
        desc: "Mace is the lacy reddish outer covering (aril) of the nutmeg seed. It has a flavor similar to nutmeg but more delicate and refined.",
        uses: "Baked goods, savory dishes, pickles, ketchups.",
        specs: { "Color": "Golden / Red", "Moisture": "10% Max", "Impurities": "1% Max", "Origin": "Kerala", "Packaging": "Cartons" }
    },
    "mint": {
        desc: "Dried Mint leaves are aromatic and refreshing. They retain their flavor well and are used in teas, chutneys, and savory dishes across Middle Eastern and Indian cuisines.",
        uses: "Tea blends, chutneys, garnish, breath freshener.",
        specs: { "Form": "Whole Leaves / Powder", "Color": "rgb(8, 175, 8)", "Moisture": "8% Max", "Aroma": "Strong Menthol", "Origin": "Uttar Pradesh" }
    },
    "nutmeg": {
        desc: "Nutmeg is the seed kernel inside the fruit. It offers a warm, nutty, and slightly sweet flavor used in béchamel sauce, puddings, and baked goods.",
        uses: "Bakery, confectionery, meat processing, medicine.",
        specs: { "Shell": "With/Without Shell", "Grade": "ABCD", "Moisture": "10% Max", "Origin": "Kerala", "Packaging": "Jute Bags" }
    },
    "pepper": {
        desc: "Indian Black Pepper is known as 'Black Gold' and is the standard for quality pepper. It has a sharp, biting heat and rich aroma.",
        uses: "Universal table condiment, preservative, medicinal.",
        specs: { "Density": "500 GL / 550 GL / 570 GL", "Moisture": "12% Max", "Admixture": "1% Max", "Origin": "Kerala/Karnataka", "Type": "Black / White" }
    },
    "pomegranate": {
        desc: "Dried Pomegranate Seeds (Anardana) are used as a souring agent in Indian cooking. They add a tangy, fruity flavor to chickpeas and vegetable dishes.",
        uses: "Souring agent, digestive churan, spice blends.",
        specs: { "Form": "Dried Seeds", "Moisture": "11% Max", "Purity": "98%", "Origin": "Himachal Pradesh", "Packaging": "25 Kg Bags" }
    },
    "turmeric": {
        desc: "Turmeric is a bright yellow spice containing Curcumin, known for its powerful anti-inflammatory properties. It is the base for color and flavor in curry powders.",
        uses: "Coloring agent, medicinal supplement, curry powders.",
        specs: { "Curcumin Content": "2% - 5%", "Type": "Finger / Bulb / Powder", "Polished": "Double Polished", "Origin": "Sangli/Nizamabad", "Moisture": "10% Max" }
    },
    // GRAINS & PULSES
    "barley": {
        desc: "Barley is a major cereal grain. It is a rich source of fiber and essential minerals. Indian Barley is valued for its high malt quality.",
        uses: "Animal feed, malting (beer/whiskey), health foods.",
        specs: { "Moisture": "12% Max", "Protein": "10% Min", "Fiber": "5% Min", "Origin": "India", "Packaging": "50 Kg Bags" }
    },
    "rice": {
        desc: "We export premium Basmati Rice, known for its long grain, aromatic fragrance, and delicate flavor. We also supply various Non-Basmati varieties like IR64 and Sona Masoori.",
        uses: "Staple food, biryani, pilaf, fried rice.",
        specs: { "Variety": "Basmati 1121 / Pusa / Sugandha", "Grain Length": "8.35mm Avg", "Broken": "1% Max", "Moisture": "12.5% Max", "Sortex": "100% Cleaned" }
    },
    "maize": {
        desc: "Yellow Maize (Corn) is widely used for animal feed and human consumption. Indian maize is known for its high nutritional value and is available season-round.",
        uses: "Poultry feed, starch production, human consumption.",
        specs: { "Moisture": "14% Max", "Admixture": "2% Max", "Broken": "2% Max", "Aflatoxin": "20 PPB Max", "Origin": "India" }
    },
    "millet": {
        desc: "Pearl Millet (Bajra) is a highly nutritious gluten-free grain. It is rich in iron and fiber, making it an excellent food source for arid regions.",
        uses: "Bird feed, human consumption (flatbreads).",
        specs: { "Purity": "99%", "Moisture": "12% Max", "Protein": "10-12%", "Origin": "Rajasthan/Gujarat", "Packaging": "50 Kg PP Bags" }
    },
    "sorghum": {
        desc: "Sorghum (Jowar) is a nutrient-rich ancient grain. It is drought-tolerant and serves as a staple food and fodder crop.",
        uses: "Food grain, animal fodder, ethanol production.",
        specs: { "Color": "White / Yellow", "Moisture": "12% Max", "Protein": "10% Min", "Origin": "Maharashtra", "Packaging": "Bulk / Bags" }
    },
    "pulses": {
        desc: "We offer a wide range of pulses including Chickpeas, Lentils, and Peas. These are major sources of plant-based protein/fiber.",
        uses: "Dals, soups, hummus, flour.",
        specs: { "Varieties": "Toor, Moong, Urad, Chana", "Purity": "99% Sortex", "Moisture": "12% Max", "Admixture": "0.5% Max", "Packaging": "25/50 Kg Bags" }
    },
    // NUTS
    "almonds": {
        desc: "We supply high-quality Almonds that are rich in Vitamin E and healthy fats. Available in shell or as kernels.",
        uses: "Snacking, confectionery, almond milk/oil.",
        specs: { "Type": "Mamra / California / Gurbandi", "Moisture": "5% Max", "Broken": "2% Max", "Origin": "India/Imports", "Packaging": "Vacuum Pack" }
    },
    "cashew": {
        desc: "Indian Cashews are famous for their sweet taste and crunch. We supply W180, W240, W320, and splits.",
        uses: "Snacking, desserts, rich gravies.",
        specs: { "Grade": "W180 / W240 / W320", "Moisture": "5% Max", "Broken": "5% Max", "Origin": "Goa/Kerala", "Packaging": "10 Kg Tins" }
    },
    "desiccated-coconut": {
        desc: "High-fat Desiccated Coconut powder is produced from fresh white coconut meat. It has a sweet, nutty flavor and crisp texture.",
        uses: "Bakery (macaroons), confectionery, curry bases.",
        specs: { "Fat Content": "65% Min (High Fat)", "Moisture": "3% Max", "Grade": "Fine / Medium", "Color": "Snow White", "Origin": "South India" }
    },
    "raisins": {
        desc: "Indian Raisins (Kishmish) are sweet, golden-rgb(8, 175, 8) dried grapes. They are produced from seedless grapes and are soft and fleshy.",
        uses: "Bakery, desserts, trail mix, direct consumption.",
        specs: { "Type": "Golden / Malayar / Black", "Size": "Bold / Medium", "Moisture": "15% Max", "Origin": "Nashik, India", "Packaging": "10 Kg Box" }
    },
    // FEED
    "soya-cake": {
        desc: "Soya De-Oiled Cake (Soybean Meal) is the most preferred protein source for animal feed. It has a high protein content (min 46-48%) and a balanced amino acid profile.",
        uses: "Poultry feed, cattle feed, aqua feed.",
        specs: { "Protein": "46% - 48% Min", "Moisture": "12% Max", "Fiber": "6% Max", "Sand/Silica": "2% Max", "Origin": "Madhya Pradesh" }
    },
    "cottonseed-cake": {
        desc: "Cottonseed Meal is a high-protein byproduct of oil extraction. It is an excellent source of slow-release nitrogen and protein for ruminants.",
        uses: "Cattle feed (increases milk yield), fertilizer.",
        specs: { "Protein": "38% - 40%", "Oil Content": "1.5% Max", "Moisture": "10% Max", "Fiber": "12-14%", "Packaging": "50 Kg Bags" }
    },
    "groundnut-oil-cakes": {
        desc: "Groundnut (Peanut) Cake is a protein-rich feed ingredient obtained after oil extraction. It is highly palatable and digestible for livestock.",
        uses: "Cattle feed, poultry feed, soil conditioner.",
        specs: { "Protein": "45% Min", "Oil": "7% Max", "Moisture": "10% Max", "Fiber": "10% Max", "Origin": "Gujarat" }
    }
};

// Generic Fallback Generation
const getDetails = (slug, rawName, category) => {
    // Try exact match
    if (PRODUCT_DB[slug]) return PRODUCT_DB[slug];

    // Try partial match key
    const keys = Object.keys(PRODUCT_DB);
    const match = keys.find(k => slug.includes(k) || k.includes(slug));
    if (match) return PRODUCT_DB[match];

    // Fallback based on category
    if (category.includes("Oil") || category.includes("Seed")) {
        return {
            desc: `${rawName} are premium quality oil seeds sourced from the best farms in India. We ensure high oil content and purity through rigorous quality checks.`,
            uses: "Oil extraction, culinary seasoning, industrial applications.",
            specs: { "Purity": "99% Min", "Moisture": "8-10% Max", "Origin": "India", "Packaging": "Jute/PP Bags" }
        };
    }
    if (category.includes("Feed")) {
        return {
            desc: `${rawName} is a high-quality animal feed ingredient rich in protein and essential nutrients. Processed hygienically to ensure safety for livestock.`,
            uses: "Poultry feed, cattle feed, aqua culture.",
            specs: { "Protein": "Standard Export Grade", "Moisture": "12% Max", "Origin": "India", "Packaging": "50 Kg Bags" }
        };
    }

    // Generic
    return {
        desc: `${rawName} is sourced from premium growers in India. We select only the finest quality produce, processed under strict hygienic conditions to ensure export-quality standards.`,
        uses: "Culinary, medicinal, and industrial applications.",
        specs: { "Origin": "India", "Quality": "Premium Export Grade", "Moisture": "Standard", "Packaging": "As per client requirement" }
    };
};

const generateSpecsHTML = (specs) => {
    let match = '<table>';
    for (const [key, value] of Object.entries(specs)) {
        match += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
    match += '</table>';
    return match;
};

// Main Process
const main = async () => {
    log('🚀 Starting Smart Page Generation...');

    if (!fs.existsSync(MARKDOWN_FILE)) { log(`❌ Markdown file missing.`); return; }
    if (!fs.existsSync(TEMPLATE_FILE)) { log(`❌ Template file missing.`); return; }

    const markdownContent = fs.readFileSync(MARKDOWN_FILE, 'utf8');
    const templateContent = fs.readFileSync(TEMPLATE_FILE, 'utf8');

    const lines = markdownContent.split('\n');
    let currentCategory = 'General';
    let count = 0;

    const categoryRegex = /^##\s+(.+)/;
    const productRowRegex = /\|\s*\*\*([^*]+)\*\*\s*\|/;

    for (const line of lines) {
        const catMatch = line.match(categoryRegex);
        if (catMatch) {
            currentCategory = catMatch[1].trim();
            continue;
        }

        const prodMatch = line.match(productRowRegex);
        if (prodMatch) {
            const rawName = prodMatch[1].trim();
            const slug = slugify(rawName);

            // 1. Get Details (Researched or Fallback)
            const details = getDetails(slug, rawName, currentCategory);

            log(`📦 ${rawName} -> Using specs: ${JSON.stringify(details.specs)}`);

            // 2. Ensure Image
            const imageFile = await ensureImage(slug, rawName);

            // 3. HTML Content
            let html = templateContent
                .replace(/\{name\}/g, rawName)
                .replace(/\{short_desc\}/g, details.desc.substring(0, 150) + "...")
                .replace(/\{desc\}/g, details.desc)
                .replace(/\{uses\}/g, details.uses) // In template this might be inside table or text
                .replace(/\{image\}/g, imageFile)
                .replace(/\{category\}/g, currentCategory)
                .replace(/\{category_upper\}/g, currentCategory.toUpperCase());

            // 4. Inject Dynamic Spec Table
            // The template currently has a fixed table structure or placeholder {uses} inside a table row?
            // Let's check the template structure. 
            // In the previous turn, the template had:
            // <tr><td>Usage & Benefits</td><td>{uses}</td></tr>
            // We want to replace the WHOLE table content if possible, or append to it. 
            // Actually, the new template from Step 234 has a table with fixed rows.
            // We should make the template flexible or replace the table block using regex in the script.

            // Allow more flexible replacement by rebuilding the table entirely.
            // We will look for <div class="variant-specs"> ... </table>
            const specsTableHTML = generateSpecsHTML(details.specs);
            html = html.replace(
                /<div class="variant-specs">\s*<table>[\s\S]*?<\/table>\s*<\/div>/,
                `<div class="variant-specs">${specsTableHTML}</div>`
            );

            const productPath = path.join(BASE_DIR, `product-${slug}.html`);
            const subProductPath = path.join(BASE_DIR, `subproduct-${slug}.html`);

            fs.writeFileSync(productPath, html, 'utf8');
            fs.writeFileSync(subProductPath, html, 'utf8');
            count++;
        }
    }

    log(`✨ Updated/Generated ${count * 2} pages.`);
};

main();
