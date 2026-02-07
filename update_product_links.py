import os
import re
import json

# Load product data from generate-product-pages.py (same dict definition)
products_data = {
    "Herbs & Spices": {
        "bishops-weed": {"image": "bishops-weed.png"},
        "cassia": {"image": "cassia.png"},
        "celery": {"image": "celery.png"},
        "chilli": {"image": "chilli.png"},
        "cinnamon": {"image": "cinnamon.png"},
        "cloves": {"image": "cloves.png"},
        "coriander": {"image": "coriander.png"},
        "curry-leaf": {"image": "curry-leaf.png"},
        "dill": {"image": "dill.png"},
        "fennel": {"image": "fennel.png"},
        "fenugreek": {"image": "fenugreek.png"},
        "garlic": {"image": "garlic.png"},
        "ginger": {"image": "ginger.png"},
        "hyssop": {"image": "hyssop.png"},
        "juniper-berry": {"image": "juniper-berry.png"},
        "kokam": {"image": "kokam.png"},
        "mace": {"image": "mace.png"},
        "mint": {"image": "mint.png"},
        "nutmeg": {"image": "nutmeg.png"},
        "pepper-long": {"image": "pepper-long.png"},
        "pepper": {"image": "pepper.png"},
        "pomegranate": {"image": "pomegranate.png"},
        "sweet-flag": {"image": "sweet-flag.png"},
    },
    "Grains & Pulses": {
        "barley": {"image": "barley.png"},
        "sorghum": {"image": "sorghum.png"},
        "pulses": {"image": "pulses.png"},
    },
    "Beans & Nuts": {
        "almonds": {"image": "almonds.png"},
        "raisins": {"image": "raisins.png"},
        "desiccated-coconut": {"image": "desiccated-coconut.png"},
    },
    "Animal Feed": {
        "cottonseed-cake": {"image": "cottonseed-cake.png"},
        "groundnut-oil-cakes": {"image": "groundnut-oil-cakes.png"},
    }
}

# Build a mapping from image filename to product slug
image_to_slug = {}
for category, products in products_data.items():
    for slug, info in products.items():
        img = info.get('image')
        if img:
            image_to_slug[img] = slug

# Path to the our-products.html file
html_path = os.path.join(os.path.dirname(__file__), 'our-products.html')

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Regex to find product card links with contact-us and capture the image src inside
pattern = re.compile(r'<a href="contact-us\.html" class="product-card-link">\s*<div class="product-card">\s*<div class="image">\s*<img src="images/products/([^\"]+)"', re.MULTILINE)

def replace_link(match):
    img_file = match.group(1)
    slug = image_to_slug.get(img_file)
    if slug:
        new_href = f'product-{slug}.html'
        return match.group(0).replace('contact-us.html', new_href)
    return match.group(0)

new_content = pattern.sub(replace_link, content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated product links in our-products.html')
