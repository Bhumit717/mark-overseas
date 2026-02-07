const fs = require('fs');
const path = require('path');

// Configuration
const BASE_DIR = __dirname;
const LOG_FILE = path.join(BASE_DIR, 'add_tabs_log.txt');

// Logger
const log = (msg) => {
    console.log(msg);
    fs.appendFileSync(LOG_FILE, msg + '\n');
};

// ---------------------------------------------------------
// PRODUCT DATABASE (Copied from generate_pages_smart.js)
// ---------------------------------------------------------
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
        specs: { "Type": "Machine Cleaned", "Color": "Greenish", "Moisture": "13% Max", "Broken": "2% Max", "Packaging": "Compressed Bales / Bags" }
    },
    "bishops-weed": {
        desc: "Bishop's Weed, commonly known as Ajwain, contains thymol which gives it a thyme-like flavor. It is a potent spice used in small quantities for its strong aroma and digestive benefits.",
        uses: "Digestive medicine, pickles, breads, and savory snacks.",
        specs: { "Purity": "99% / 99.5%", "Moisture": "10% Max", "Admixture": "1% Max", "Origin": "Gujarat/Rajasthan", "Packaging": "25/50 Kg PP Bags" }
    },
    "cardamom": {
        desc: "Known as the 'Queen of Spices', Green Cardamom has a complex flavor profile—floral, sweet, and spicy. It is the third most expensive spice in the world and indispensable in desserts and chai.",
        uses: "Sweets, tea, savory curries, mouth freshener.",
        specs: { "Grade": "AGEB / AGB / AGS", "Size": "6mm / 7mm / 8mm+", "Color": "Deep Green", "Origin": "Kerala, India", "Moisture": "11% Max" }
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
        specs: { "Form": "Fresh / Dry", "Color": "Dark Green", "Aroma": "Intense Citrusy", "Moisture": "Standard", "Packaging": "Vacuum Pack" }
    },
    "dill": {
        desc: "Dill seeds are used as a spice, with a flavor that is like a combination of caraway and fennel. They are essential in pickling and fish dishes.",
        uses: "Pickles, fish seasoning, bread, digestive tea.",
        specs: { "Purity": "99%", "Admixture": "1% Max", "Moisture": "10% Max", "Origin": "India", "Packaging": "25/50 Kg Bags" }
    },
    "fennel": {
        desc: "Fennel seeds are pale green with a sweet, anise-like flavor. They are widely used as a mouth freshener after meals and as a key spice in curries and bakery products.",
        uses: "Mouth freshener (Mukhwas), bakery, confectionery, digestion.",
        specs: { "Type": "Lucknow / Thin / Thick", "Purity": "99% / 99.5%", "Color": "Bright Green", "Moisture": "10% Max", "Origin": "Gujarat" }
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
        specs: { "Form": "Dried Herbs", "Color": "Greenish", "Moisture": "12% Max", "Purity": "99%", "Origin": "Himalayan Region" }
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
        specs: { "Form": "Whole Leaves / Powder", "Color": "Green", "Moisture": "8% Max", "Aroma": "Strong Menthol", "Origin": "Uttar Pradesh" }
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
        desc: "Indian Raisins (Kishmish) are sweet, golden-green dried grapes. They are produced from seedless grapes and are soft and fleshy.",
        uses: "Bakery, desserts, trail mix, direct consumption.",
        specs: { "Type": "Golden / Malayar / Black", "Size": "Bold / Medium", "Moisture": "15% Max", "Origin": "Nashik, India", "Packaging": "10 Kg Box" }
    },
    "groundnut": {
        desc: "India is the second largest producer of groundnuts in the world. We export premium Hand Picked Selected (HPS) groundnuts, including Bold and Java varieties, as well as high-quality blanched peanuts.",
        uses: "Direct consumption, oil extraction, peanut butter.",
        specs: { "Type": "Bold / Java / Blanched", "Moisture": "7% Max", "Admixture": "1% Max", "Origin": "Gujarat/Saurashtra", "Packaging": "50 Kg Jute/PP Bags" }
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
    },
    "rice-bran-cake": {
        desc: "Rice Bran De-Oiled Cake is produced after extracting oil from rice bran. It is rich in protein and ideal for cattle and fish feed.",
        uses: "Cattle feed, fish feed, poultry feed.",
        specs: { "Protein": "15-16%", "Moisture": "10% Max", "Sand/Silica": "2.5% Max", "Packaging": "50 Kg Bags" }
    },
    "rapeseed-meal": {
        desc: "Rapeseed Meal (Mustard Cake) is a coarse powdery material, produced after removing oil from mustard seeds. It has a good amino acid balance.",
        uses: "Cattle feed, poultry feed, aqua feed.",
        specs: { "Protein": "38% Min", "Moisture": "10% Max", "Oil Content": "1.5% Max", "Origin": "Rajasthan" }
    }
};

// Generic Fallback Generation
const getDetails = (slug, rawName) => {
    // Try exact match
    if (PRODUCT_DB[slug]) return PRODUCT_DB[slug];

    // Try partial match key
    const keys = Object.keys(PRODUCT_DB);
    const match = keys.find(k => slug.includes(k) || k.includes(slug));
    if (match) return PRODUCT_DB[match];

    return {
        desc: `${rawName} is sourced from premium growers in India. We select only the finest quality produce, processed under strict hygienic conditions to ensure export-quality standards. It is one of our flagship products known for its purity.`,
        uses: "Culinary, medicinal, and industrial applications.",
        specs: { "Origin": "India", "Quality": "Premium Export Grade", "Moisture": "Standard", "Packaging": "As per client requirement" }
    };
};

const generateSpecsHTML = (specs) => {
    let match = '<table class="spec-table">';
    for (const [key, value] of Object.entries(specs)) {
        match += `<tr><td>${key}</td><td>${value}</td></tr>`;
    }
    match += '</table>';
    return match;
};

// Main Process
const main = async () => {
    log('🚀 Starting Tab Injection...');

    const files = fs.readdirSync(BASE_DIR).filter(file => file.endsWith('.html') && (file.startsWith('product-') || file.startsWith('subproduct-')));
    let count = 0;

    for (const file of files) {
        if (file === 'product-template.html') continue;

        const filePath = path.join(BASE_DIR, file);
        let content = fs.readFileSync(filePath, 'utf8');

        // Check if Tabs already exist
        if (content.includes('class="product-tabs-section"')) {
            // log(`⏩ Skipping ${file} (Tabs already exist)`);
            continue;
        }

        log(`🛠️ Processing ${file}...`);

        // Extract Product Name for DB Lookup
        const slugMatch = file.match(/(?:sub)?product-(.+)\.html/);
        const slug = slugMatch ? slugMatch[1] : 'unknown';

        // Extract clean name from title or h1 if possible, or simple fallback
        let prettyName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const titleMatch = content.match(/<h1 class="product-title">([^<]+)<\/h1>/) || content.match(/<title>([^<]+)\|/);
        if (titleMatch) {
            prettyName = titleMatch[1].trim();
        }

        const details = getDetails(slug, prettyName);

        const tabSectionHTML = `
                <div class="product-tabs-section">
                    <div class="product-tabs-nav">
                        <div class="product-tab-btn active" data-tab="desc-tab">DESCRIPTION</div>
                        <div class="product-tab-btn specification-btn" data-tab="spec-tab">SPECIFICATION</div>
                    </div>
                    <div class="product-tab-content">
                        <div id="desc-tab" class="tab-pane active">
                            <h3 class="product-detail-title-center">Description</h3>
                            <p>${details.desc.replace(/\{name\}/g, prettyName)}</p>
                        </div>
                        <div id="spec-tab" class="tab-pane">
                            <h3 class="product-detail-title-center">Specification</h3>
                            ${generateSpecsHTML(details.specs)}
                        </div>
                    </div>
                </div>`;

        // Insertion Point: Inside .product-detail-section .container, at the end.
        // We look for the closing div of the container inside product-detail-section.
        // A robust way usually is to find the Trust Badges div and append after it, or just before section close.

        // Pattern: ... </section> ...
        // Let's try to insert before the closing </section> tag of product-detail-section
        // But we need to be inside the .container.
        // Looking at files:
        // ...
        // <div class="trust-badges ..."> ... </div>
        // </div> <!-- End of container -->
        // </section>

        // So we want to replace the LAST "</div>" before "</section>" with "tabs... </div>"

        // Let's use a reliable anchor. "trust-badges" seems common in all files?
        // Let's check a file content again.
        // Yes, trust-badges triggers an update.

        if (content.includes('class="trust-badges')) {
            // Find the trust badges div and its closing. This is risky with regex.
            // Safer: Find the </section> tag for product-detail-section.
            // The container closes right before it.

            // Strategy: Find `</section>` which closes `.product-detail-section`.
            // The line before it usually contains `</div>` (closing container) or `</div>` is a few lines up.

            // Let's look for the trust-badges section closing.
            // Regex to match the trust badges block is hard.

            // ALTERNATIVE: Match `</div>\s*</section>` (end of container, end of section)
            // and replace with `[TabsHTML]</div></section>`

            const closingPattern = /<\/div>\s*<\/section>\s*<\/main>/;
            const closingPattern2 = /<\/div>\s*<\/section>/; // Broader

            // Many files have:
            //             </div>
            //         </section>
            //     </main>

            if (closingPattern.test(content)) {
                content = content.replace(closingPattern, `    ${tabSectionHTML}\n            </div>\n        </section>\n    </main>`);
                fs.writeFileSync(filePath, content, 'utf8');
                count++;
                log(`    ✅ Injected tabs into ${file}`);
            } else if (closingPattern2.test(content)) {
                // Try to be careful not to match inner sections if any, but product-detail-section is usually the last one in main or huge.
                // We can search for the specific section start to be sure, but regex replace on the Last Occurrence is better.

                const lastIndex = content.lastIndexOf('</section>');
                if (lastIndex !== -1) {
                    // Find the closing div before this section close
                    const beforeSection = content.substring(0, lastIndex);
                    const lastDivIndex = beforeSection.lastIndexOf('</div>');

                    if (lastDivIndex !== -1) {
                        const prefix = beforeSection.substring(0, lastDivIndex);
                        const suffix = beforeSection.substring(lastDivIndex); // This is </div> + whitespace

                        const newContent = prefix + tabSectionHTML + suffix + content.substring(lastIndex);
                        fs.writeFileSync(filePath, newContent, 'utf8');
                        count++;
                        log(`    ✅ Injected tabs into ${file} (Method 2)`);
                    } else {
                        log(`    ❌ Could not find closing div for container in ${file}`);
                    }
                }
            } else {
                log(`    ❌ Pattern not found in ${file}`);
            }

        } else {
            log(`    ⚠️ No trust badges found in ${file}, layout might be different.`);
        }
    }

    log(`✨ Updated ${count} files.`);
};

main();
