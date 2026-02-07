import os
import datetime

def generate_sitemap():
    base_url = "https://www.mark-overseas.com/"
    cwd = os.getcwd()
    
    # Files to ignore
    ignore_files = {
        'product-template.html',
        'product-total.html',
        'subproduct-total.html',
        'exports.html'  # Re-adding it later with custom priority if needed, or keeping it as main page
    }
    
    # Main/Category pages (priority 0.9)
    main_pages = {
        'about-us.html',
        'our-products.html',
        'exports.html',
        'industries-we-serve.html',
        'contact-us.html',
        'certificates.html',
        'oil-seeds.html',
        'spices-herbs.html',
        'grains-pulses.html',
        'beans-nuts.html',
        'animal-feed.html'
    }
    
    html_files = [f for f in os.listdir(cwd) if f.endswith('.html') and f not in ignore_files]
    
    sitemap_content = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
"""
    
    today = datetime.date.today().isoformat()
    
    # Sort for consistent output
    html_files.sort()
    
    # Move index.html to front
    if 'index.html' in html_files:
        html_files.remove('index.html')
        html_files.insert(0, 'index.html')

    for page in html_files:
        if page == "index.html":
            priority = "1.0"
            changefreq = "weekly"
        elif page in main_pages:
            priority = "0.9"
            changefreq = "weekly"
        elif page.startswith("product-"):
            priority = "0.8"
            changefreq = "monthly"
        elif page.startswith("subproduct-"):
            priority = "0.7"
            changefreq = "monthly"
        else:
            priority = "0.6"
            changefreq = "monthly"
        
        sitemap_content += f"""    <url>
        <loc>{base_url}{page}</loc>
        <lastmod>{today}</lastmod>
        <changefreq>{changefreq}</changefreq>
        <priority>{priority}</priority>
    </url>
"""
    
    sitemap_content += "</urlset>"
    
    with open("sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    
    print(f"Sitemap generated with {len(html_files)} URLs.")

if __name__ == "__main__":
    generate_sitemap()
