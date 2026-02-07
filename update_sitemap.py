import re
import os

def generate_sitemap():
    base_url = "https://www.mark-overseas.com/"
    
    # Static pages
    static_pages = [
        "index.html",
        "about-us.html",
        "our-products.html",
        "exports.html",
        "industries-we-serve.html",
        "contact-us.html",
        "certificates.html",
        "oil-seeds.html",
        "spices-herbs.html",
        "grains-pulses.html",
        "beans-nuts.html",
        "animal-feed.html"
    ]
    
    # Parse our-products.html for all product links
    with open("our-products.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    product_links = re.findall(r'href="(product-[^"]+\.html)"', content)
    # Remove duplicates while preserving order
    product_links = list(dict.fromkeys(product_links))
    
    all_pages = static_pages + product_links
    
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
"""
    
    for page in all_pages:
        priority = "1.0" if page == "index.html" else "0.9" if page == "our-products.html" else "0.8" if page in static_pages else "0.7"
        changefreq = "weekly" if page in ["index.html", "our-products.html"] else "monthly"
        
        sitemap_content += f"""    <url>
        <loc>{base_url}{page}</loc>
        <lastmod>2026-02-07</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
"""
    
    sitemap_content += "</urlset>"
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    
    print(f"Sitemap generated with {len(all_pages)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
