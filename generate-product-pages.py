# Product Page Generator for Mark Overseas Website
# This script creates individual product pages for all products

import os
import requests
from urllib.parse import quote_plus

# Product data from Mark Overseas website
products_data = {
    "Herbs & Spices": {
        "bishops-weed": {
            "name": "Bishop's Weed (Ajwain)",
            "desc": "Bishop's weed or ajwain is a very popular Indian spice used to add flavor to many dishes. It has been used in Ayurvedic medicine as an antiseptic, spice, and preservative. Used for respiratory and GI ailments.",
            "uses": "Antiseptic, digestive aid, respiratory relief, food preservative",
            "image": "bishops-weed.png"
        },
        "cassia": {
            "name": "Cassia",
            "desc": "Cassia is the dried bark of a small everrgb(8, 175, 8) tree. Similar to cinnamon, it's widely used as a flavoring agent in foods, beverages, perfumery, and cosmetics.",
            "uses": "Flavoring for foods, beverages, perfumes, cosmetics",
            "image": "cassia.png"
        },
        "celery": {
            "name": "Celery Seeds",
            "desc": "Celery seeds are used as flavoring or spice. Rich in vitamin C, they help reduce cold symptoms. The seeds yield a valuable volatile oil used in perfume and pharmaceutical industries.",
            "uses": "Seasoning, flavoring, medicinal uses, perfume industry",
            "image": "celery.png"
        },
        "chilli": {
            "name": "Chilli",
            "desc": "Chilli is one of the most used spices for garnishing dishes. Extensively used in curries, it's an indispensable spice in cuisines worldwide. Available as whole dried chillies, flakes, and powder.",
            "uses": "Curries, sauces, garnishing, spice blends",
            "image": "chilli.png"
        },
        "cinnamon": {
            "name": "Cinnamon",
            "desc": "Cinnamon is the inner bark of a tropical everrgb(8, 175, 8) tree. Highly prized since ancient times, it's used in desserts, chocolate, spicy candies, tea, hot cocoa, and liqueurs.",
            "uses": "Desserts, beverages, savory dishes, medicinal",
            "image": "cinnamon.png"
        },
        "cloves": {
            "name": "Cloves",
            "desc": "Cloves are dried unopened flower buds with a strong, pungent, sweet flavor. Used worldwide in spice cookies and cakes. They're a perfect breath freshener and kill odor-causing bacteria.",
            "uses": "Spice cookies, cakes, breath freshener, medicinal",
            "image": "cloves.png"
        },
        "coriander": {
            "name": "Coriander",
            "desc": "Coriander seeds and leaves (cilantro) are used in various cuisines. The seeds are the bulkiest constituent in curry powders. Used in traditional medicine as a diuretic.",
            "uses": "Curry powder, seasoning, traditional medicine",
            "image": "coriander.png"
        },
        "curry-leaf": {
            "name": "Curry Leaf",
            "desc": "Curry leaf is a popular leafy-spice used in Asian-Indian cuisine for its authentic flavor and distinct aroma. Extensively used in South Indian cooking.",
            "uses": "South Indian dishes, curries, chutneys",
            "image": "curry-leaf.png"
        },
        "dill": {
            "name": "Dill",
            "desc": "Dill seeds and leaves are used as spice and herb. Well known as the prime flavoring in dill pickles. Popular in Scandinavian and German fish and seafood dishes.",
            "uses": "Pickles, fish dishes, soups, salads",
            "image": "dill.png"
        },
        "fennel": {
            "name": "Fennel",
            "desc": "Fennel seeds have an aniseed flavor. Used as spice, medicine, and food preservative. Helps improve eyesight, aid digestion, and cure obesity.",
            "uses": "Spice, digestive aid, medicinal, breath freshener",
            "image": "fennel.png"
        },
        "fenugreek": {
            "name": "Fenugreek",
            "desc": "Fenugreek is used as both herb (leaves) and spice (seeds). Excellent for fish and seafood dishes. Used in traditional medicine for blood sugar control and increasing breastmilk production.",
            "uses": "Curry powder, medicinal, hair conditioner",
            "image": "fenugreek.png"
        },
        "garlic": {
            "name": "Garlic",
            "desc": "Garlic is widely used for its pungent flavor as seasoning. It lowers cholesterol, reverses high blood pressure, boosts immune system, and has many other health benefits.",
            "uses": "Seasoning, medicinal, health supplement",
            "image": "garlic.png"
        },
        "ginger": {
            "name": "Ginger",
            "desc": "Ginger is used as a spice in cooking worldwide. Young ginger rhizomes are juicy and fleshy with a mild taste. Used in Asian, Indian, and Arabic herbal traditions.",
            "uses": "Cooking spice, digestive aid, medicinal",
            "image": "ginger.png"
        },
        "hyssop": {
            "name": "Hyssop",
            "desc": "Hyssop belongs to the mint family. Used to cure respiratory problems. Leaves and flowering tops flavor soups and salads. Used in liquor and perfume preparation.",
            "uses": "Medicinal, flavoring, perfumery",
            "image": "hyssop.png"
        },
        "juniper-berry": {
            "name": "Juniper Berry",
            "desc": "Juniper berries are used in gin production and as food flavoring. The oil flavors liquors and cordials. Beneficial for digestive and reproductive systems.",
            "uses": "Gin production, flavoring, medicinal",
            "image": "juniper-berry.png"
        },
        "kokam": {
            "name": "Kokam",
            "desc": "Kokam is used as garnish to add acid flavor to curries. Both ripened rind and juice are used in cooking. Kokam butter is nutritive, antiseptic, and demulcent.",
            "uses": "Curries, cooling syrups, edible fat",
            "image": "kokam.png"
        },
        "mace": {
            "name": "Mace",
            "desc": "Mace is an aromatic product used for medicinal purposes. Used in tonics, increases appetite, reduces nausea and digestive problems. Applied externally for arthritis.",
            "uses": "Medicinal, savory dishes, tonics",
            "image": "mace.png"
        },
        "mint": {
            "name": "Mint",
            "desc": "Mint leaves are used fresh or dried for flavoring soups, fish, meat, sauces, and drinks. Excellent breath freshener. Used against stomach disorders and headaches.",
            "uses": "Flavoring, breath freshener, medicinal, tea",
            "image": "mint.png"
        },
        "nutmeg": {
            "name": "Nutmeg",
            "desc": "Nutmeg is used for flavoring sweet foods. Used in soups, meat products, sauces, puddings, and confectioneries. Nutmeg oil relaxes muscles and has sedative capability.",
            "uses": "Sweet foods, medicinal, muscle relaxant",
            "image": "nutmeg.png"
        },
        "pepper-long": {
            "name": "Pepper Long",
            "desc": "Long pepper is used as spice in pickles and preserves. Has carminative and anti-helmintic properties. Used to treat respiratory infections and stomachache.",
            "uses": "Pickles, medicinal, spice mixtures",
            "image": "pepper-long.png"
        },
        "pepper": {
            "name": "Pepper (Black)",
            "desc": "Pepper is the 'King of Spices'. One of the oldest and best-known spices. Used as universal table condiment to flavor all types of cuisines worldwide.",
            "uses": "Universal seasoning, medicinal, massage oil",
            "image": "pepper.png"
        },
        "pomegranate": {
            "name": "Pomegranate Seeds",
            "desc": "Dried pomegranate seeds are used as spice in Indian and Iranian cooking. Seeds are crushed before use to add flavor. Fresh seeds used as garnish.",
            "uses": "Spice, garnish, flavoring",
            "image": "pomegranate.png"
        },
        "sweet-flag": {
            "name": "Sweet Flag",
            "desc": "Sweet flag root is used as expectorant and anesthetic. Highly valued as rejuvenatory for brain and nervous system. Used in Ayurveda for digestive disorders.",
            "uses": "Medicinal, digestive aid, perfume industry",
            "image": "sweet-flag.png"
        }
    },
    "Grains & Pulses": {
        "barley": {
            "name": "Barley",
            "desc": "Healthy barley is free from fats and a good source of protein. Serves as animal fodder, base malt for beer, and component of health foods. High in dietary fiber and selenium.",
            "uses": "Animal fodder, beer production, health foods",
            "image": "barley.png"
        },
        "sorghum": {
            "name": "Sorghum (Jwar)",
            "desc": "Sorghum is drought and heat tolerant. Used as fodder plant and for alcoholic beverage production. Especially important in arid regions.",
            "uses": "Fodder, alcoholic beverages, food grain",
            "image": "sorghum.png"
        },
        "pulses": {
            "name": "Beans & Pulses",
            "desc": "Supreme quality beans and pulses including Black Matpe, Desi Chickpeas, Kabuli Chickpeas, Lentils, and Yellow Peas. Rich in protein and nutrients.",
            "uses": "Cooking, protein source, various cuisines",
            "image": "pulses.png"
        }
    },
    "Beans & Nuts": {
        "almonds": {
            "name": "Almonds",
            "desc": "Almonds are not only tasty but a rich source of nutrition. Available at cost-effective prices in bulk quantities. High in protein, vitamins, and minerals.",
            "uses": "Snacking, baking, health foods",
            "image": "almonds.png"
        },
        "raisins": {
            "name": "Raisins (Dry Grapes)",
            "desc": "Dry grapes are a great alternative to candies. Used for garnishing dishes. Rich source of calories. Hygienically packed to remain free from moisture.",
            "uses": "Snacking, garnishing, baking",
            "image": "raisins.png"
        },
        "desiccated-coconut": {
            "name": "Desiccated Coconut",
            "desc": "Low moisture, high fat desiccated coconut. Obtained by drying shredded coconut kernel. Widely used in confectioneries, puddings, and sweets.",
            "uses": "Confectionery, baking, sweets",
            "image": "desiccated-coconut.png"
        }
    },
    "Animal Feed": {
        "cottonseed-cake": {
            "name": "Cottonseed De Oiled Cake",
            "desc": "Residual product obtained after oil extraction from cotton seed. Rich in nutrients with 48% protein content. Ideal for animal feed.",
            "uses": "Animal feed, high protein content",
            "image": "cottonseed-cake.png"
        },
        "groundnut-oil-cakes": {
            "name": "Groundnut Oil Cakes",
            "desc": "Healthy and highly nutritious groundnut oil cakes. Processed from carefully selected nuts. Known for great fragrance and health benefits.",
            "uses": "Animal feed, nutritious",
            "image": "groundnut-oil-cakes.png"
        }
    }
}

# HTML template for product pages
html_template = '''<!doctype html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{name} Exporter India | Premium Quality | Mark Overseas</title>
    <meta name="description" content="Premium {name} from India. {short_desc} Export quality. Wholesale supplier for global markets.">
    <link rel="apple-touch-icon" sizes="180x180" href="images/favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="images/favicons/favicon-32x32.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet" type="text/css" />
    <link href="css/responsive.css" rel="stylesheet" type="text/css" />
    <link href="css/product-detail.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="page-loader"><img src="images/mark-logo.png" alt="Mark Overseas" /></div>
    <div class="contacts_link"><a href="tel:+919913305996"><img src="images/calls.svg" alt="Click to call" /></a></div>
    <div class="whatsapp_link"><span class="w_label">NEED HELP? CHAT WITH US</span><a href="https://api.whatsapp.com/send?phone=+919913305996&text=Hi%20Team"><img src="images/whatsapp.svg" alt="Click to chat" /></a></div>
    <header>
        <div class="header-main-bar">
            <div class="header-logo"><a href="index.html"><img src="images/mark-logo.png" alt="Mark Overseas" style="max-height: 80px; width: auto;" /></a></div>
            <div class="navbar-toggle"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
            <div class="menu-bar">
                <div class="navbar-toggle"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                <ul class="menu-list">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about-us.html">About Us</a></li>
                    <li class="active"><a href="our-products.html">Our Products</a></li>
                    <li><a href="contact-us.html">Contact Us</a></li>
                    <li class="language-selector"><div id="google_translate_element"></div></li>
                </ul>
            </div>
        </div>
    </header>
    <script type="text/javascript">function googleTranslateElementInit() {{ new google.translate.TranslateElement({{ pageLanguage: 'en', includedLanguages: 'en,hi,gu,es,fr,de,ar,zh-CN,ja,ko,pt,ru,it,tr,nl,pl,vi,th,id,ms,bn,ta,te,mr,ur', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false }}, 'google_translate_element'); }}</script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
    <main>
        <section class="inner-section-banner">
            <div class="container">
                <div class="inner-section-banner-text">
                    <h2>{name}</h2>
                    <p><a href="index.html">Home</a> / <a href="our-products.html">Products</a> / {category} / {name}</p>
                </div>
            </div>
        </section>
        <section class="product-detail-section">
            <div class="container">
                <div class="row align-items-start">
                    <div class="col-lg-6">
                        <div class="product-image-card"><img src="images/products/{image}" alt="{name}"></div>
                    </div>
                    <div class="col-lg-6">
                        <div class="product-info-col">
                            <div class="product-category"><i class="fas fa-tag"></i> {category_upper}</div>
                            <h1 class="product-title">{name}</h1>
                            <p class="product-short-desc">{short_desc}</p>
                            <a href="https://api.whatsapp.com/send?phone=+919913305996&text=Hi, I am interested in {name}." class="whatsapp-enquiry-btn"><i class="fab fa-whatsapp"></i> Whatsapp Enquiry</a>
                            <div class="trust-badges">
                                <div class="trust-badge-item"><i class="fas fa-check-circle text-success me-2"></i><span>Premium Quality</span></div>
                                <div class="trust-badge-item"><i class="fas fa-check-circle text-success me-2"></i><span>Export Grade</span></div>
                                <div class="trust-badge-item"><i class="fas fa-check-circle text-success me-2"></i><span>Hygienic Processing</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-tabs-section">
                    <div class="product-tabs-nav">
                        <div class="product-tab-btn active" data-tab="desc-tab">DESCRIPTION</div>
                        <div class="product-tab-btn specification-btn" data-tab="spec-tab">USES & BENEFITS</div>
                    </div>
                    <div class="product-tab-content">
                        <div id="desc-tab" class="tab-pane active">
                            <h3 class="product-detail-title-center">Description</h3>
                            <p>{desc}</p>
                            <p>Our {name} is sourced from the best regions in India and processed under strict hygiene conditions to maintain quality and freshness.</p>
                        </div>
                        <div id="spec-tab" class="tab-pane">
                            <h3 class="product-detail-title-center">Uses & Benefits</h3>
                            <table class="spec-table">
                                <tr><td>Primary Uses</td><td>{uses}</td></tr>
                                <tr><td>Origin</td><td>India</td></tr>
                                <tr><td>Quality</td><td>Premium Export Grade</td></tr>
                                <tr><td>Processing</td><td>Hygienic, Quality Controlled</td></tr>
                                <tr><td>Packaging</td><td>Available in various sizes</td></tr>
                                <tr><td>Availability</td><td>Year-round</td></tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <footer class="text-center p-4">
        <a href="index.html"><img src="images/mark-logo.png" alt="Mark Overseas" style="max-height: 60px;" /></a>
        <p class="mt-3">Copyright © 2026 Mark Overseas - All Rights Reserved.</p>
    </footer>
    <script src="js/jquery-2.2.4.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/custom.js"></script>
</body>
</html>'''

# Generate product pages
output_dir = r"c:\Users\bhumi\Desktop\clone\lime"
generated_count = 0

used_images = set()
for category, products in products_data.items():
    for slug, data in products.items():
        # Determine unique image filename
        original_image = data.get('image', f"{slug}.png")
        image_name = original_image
        # If image already used or file missing, generate a new placeholder image
        image_path = os.path.join(output_dir, "images", "products", image_name)
        if image_name in used_images or not os.path.isfile(image_path):
            # Create a unique image filename based on slug
            image_name = f"{slug}.png"
            image_path = os.path.join(output_dir, "images", "products", image_name)
            # Download placeholder white background image with product name
            placeholder_url = f"https://dummyimage.com/600x400/ffffff/000000&text={quote_plus(data['name'])}"
            try:
                resp = requests.get(placeholder_url, timeout=10)
                if resp.status_code == 200:
                    os.makedirs(os.path.dirname(image_path), exist_ok=True)
                    with open(image_path, 'wb') as img_file:
                        img_file.write(resp.content)
                    print(f"Downloaded placeholder for {slug} as {image_name}")
                else:
                    print(f"Failed to download placeholder for {slug}, status {resp.status_code}")
            except Exception as e:
                print(f"Error downloading placeholder for {slug}: {e}")
        used_images.add(image_name)
        # Update data image reference
        data['image'] = image_name
        
        filename = f"product-{slug}.html"
        filepath = os.path.join(output_dir, filename)
        
        # Create HTML content
        html_content = html_template.format(
            name=data['name'],
            short_desc=data['desc'][:100] + "...",
            desc=data['desc'],
            uses=data['uses'],
            image=data['image'],
            category=category,
            category_upper=category.upper()
        )
        
        # Write file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        generated_count += 1
        print(f"Created: {filename}")

print(f"\n✅ Successfully generated {generated_count} product pages!")
