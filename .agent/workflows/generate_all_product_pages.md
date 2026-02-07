---
description: Generate all product pages and view a sample page in agent mode
---
1. Ensure Python 3 is installed and added to your system PATH.
2. Run the script to update product links:
   ```
   python update_product_links.py
   ```
3. Run the script to generate all product pages and download placeholder images:
   ```
   python generate-product-pages.py
   ```
4. Open a sample product page in the browser (agent mode). Replace `<slug>` with any product slug, e.g., `bishops-weed`:
   ```
   open_browser_url file:///c:/Users/bhumi/Desktop/clone/lime/product-bishops-weed.html
   ```
   The agent will capture a video of the page rendering.
5. Verify that each product card on `our-products.html` now links to its own page and that each page displays a unique image.
