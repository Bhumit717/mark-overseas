# Product Catalog Update Plan - Mark Overseas

## Overview
This document outlines the complete product catalog from the Mark Overseas website that needs to be implemented on the current website.

## Product Categories & Items

### 1. OIL SEEDS

#### Sesame Seeds (Product Page: product-sesame.html)
- **Natural Sesame Seeds** ✓ (Already exists)
  - Color: Whitish
  - Origin: India
  - Description: From Sesamum Indicum L., suited for human consumption
  
- **Hulled Sesame Seeds** (NEW)
  - Color: White
  - Origin: India
  - Description: Hulled seeds from Sesamum Indicum L.
  
- **Black Sesame Seeds** ✓ (Already exists)
  - Color: Black to Jet black
  - Origin: India
  
- **Brown Sesame Seeds** (NEW)
  - Color: Brown
  - Origin: India

#### HPS Groundnut (Product Page: product-groundnut.html)
- **HPS Groundnut Shelled** ✓ (Already exists - update to show all variants)
- **HPS Groundnut Kernels Java** (NEW - add as variant)
- **HPS Groundnut Kernels Bold** (NEW - add as variant)
- **Blanched Peanut Splits** (NEW - add as variant)
- **Blanched Peanut** (NEW - add as variant)

#### Mustard Seeds (Product Page: product-mustard.html)
- **Yellow Mustard Seeds** ✓ (Already exists)
- **Mustard Seed** (Regular) - add as variant

---

### 2. HERBS & SPICES

#### Existing Products to Keep:
- ✓ Asafoetida
- ✓ Cardamom (Large & Small)
- ✓ Cumin
- ✓ Turmeric

#### NEW Products to Add:

1. **Bay Leaves** (product-bay-leaves.html)
   - Description: Dried bay leaves for hearty cooking, soups, stews
   
2. **Bishop's Weed (Ajwain)** (product-bishops-weed.html)
   - Description: Popular Indian spice, antiseptic properties
   
3. **Cassia** (product-cassia.html)
   - Description: Dried bark, similar to cinnamon
   
4. **Celery** (product-celery.html)
   - Description: Seeds and stalks for seasoning
   
5. **Chilli** (product-chilli.html)
   - Description: Red chilli peppers, powder, flakes
   
6. **Cinnamon** (product-cinnamon.html)
   - Description: Inner bark of tropical everrgb(8, 175, 8) tree
   
7. **Cloves** (product-cloves.html)
   - Description: Dried unopened flower buds
   
8. **Coriander** (product-coriander.html)
   - Description: Seeds and leaves (cilantro)
   
9. **Curry Leaf** (product-curry-leaf.html)
   - Description: Popular in Asian-Indian cuisine
   
10. **Dill** (product-dill.html)
    - Description: Seeds and leaves for pickles and fish dishes
    
11. **Fennel** (product-fennel.html)
    - Description: Seeds for spice and medicinal uses
    
12. **Fenugreek** (product-fenugreek.html)
    - Description: Seeds and leaves, used in curry powder
    
13. **Garlic** (product-garlic.html)
    - Description: Bulbs for seasoning and health benefits
    
14. **Ginger** (product-ginger.html)
    - Description: Fresh and dried rhizomes
    
15. **Hyssop** (product-hyssop.html)
    - Description: Mint family herb for respiratory problems
    
16. **Juniper Berry** (product-juniper-berry.html)
    - Description: Used in gin production and cooking
    
17. **Kokam** (product-kokam.html)
    - Description: Dried rind for curries and syrups
    
18. **Mace** (product-mace.html)
    - Description: Aromatic spice for medicinal and culinary use
    
19. **Mint** (product-mint.html)
    - Description: Fresh and dried leaves
    
20. **Nutmeg** (product-nutmeg.html)
    - Description: For flavoring sweet and savory foods
    
21. **Pepper Long** (product-pepper-long.html)
    - Description: Used in pickles and preserves
    
22. **Pepper** (product-pepper.html)
    - Description: Black pepper, "King of Spices"
    
23. **Pomegranate** (product-pomegranate.html)
    - Description: Seeds used as spice and garnish
    
24. **Sweet Flag** (product-sweet-flag.html)
    - Description: Root used as expectorant and anesthetic

---

### 3. ANIMAL FEED

#### Existing Products:
- ✓ Soya De Oiled Cake
- ✓ Rapeseed Meal
- ✓ Rice Bran De Oiled Cake

#### NEW Products to Add:

1. **Cottonseed De Oiled Cake** (product-cottonseed-cake.html)
   - Description: 48% protein content, residual product after oil extraction
   
2. **Groundnut Oil Cakes** (product-groundnut-oil-cakes.html)
   - Description: Nutritious, great fragrance, health benefits

---

### 4. GRAINS & PULSES

#### Cereals (Existing):
- ✓ Maize (Corn)
- ✓ Millet (Bajra)
- ✓ Rice

#### NEW Cereals to Add:

1. **Barley** (product-barley.html)
   - Description: Free from fats, good source of protein, high dietary fiber
   
2. **Sorghum (Jwar)** (product-sorghum.html)
   - Description: Drought and heat tolerant, used for fodder and alcoholic beverages

#### Beans & Pulses:
- ✓ Beans & Pulses (General) - UPDATE to show specific varieties:
  - Black Matpe
  - Desi Chickpeas
  - Kabuli Chickpeas
  - Lentils
  - Yellow Peas

---

### 5. BEANS & NUTS

#### Existing Products:
- ✓ Cashew
- ✓ Pistachios

#### NEW Products to Add:

1. **Almonds** (product-almonds.html)
   - Description: Rich source of nutrition, tasty Indian dry fruit
   
2. **Raisin (Kismiss) / Dry Grapes** (product-raisins.html)
   - Description: Alternative to candies, rich in calories
   
3. **Desiccated Coconut** (product-desiccated-coconut.html)
   - Description: Low moisture, high fat, used in confectioneries

---

## Implementation Steps

### Phase 1: Update Existing Product Pages with Variants

1. **product-sesame-natural.html** → **product-sesame.html**
   - Create vertical sections for each sesame type:
     * Natural Sesame Seeds (whitish)
     * Hulled Sesame Seeds (white)
     * Black Sesame Seeds (jet black)
     * Brown Sesame Seeds (brown)
   - Each section should have:
     * Product image with white background
     * Full description
     * Specifications table
     * Color and origin details

2. **product-groundnut.html**
   - Create vertical sections for each groundnut type:
     * HPS Groundnut Shelled
     * HPS Groundnut Kernels Java
     * HPS Groundnut Kernels Bold
     * Blanched Peanut Splits
     * Blanched Peanut
   - Each section with image and details

3. **product-rice.html**
   - Add variants:
     * Basmati Rice
     * Basmati Golden Rice
     * Basmati Brown Rice
     * Non-Basmati varieties

4. **product-pulses.html**
   - Add vertical sections for:
     * Black Matpe
     * Desi Chickpeas
     * Kabuli Chickpeas
     * Lentils
     * Yellow Peas

### Phase 2: Create New Product Pages

Create individual product pages for all NEW products listed above. Each page should follow the template structure of `product-sesame-natural.html` with:
- SEO meta tags
- Schema.org JSON-LD
- Product image
- Description
- Specifications
- WhatsApp enquiry button
- Trust badges

### Phase 3: Update our-products.html

Add all new products to the main products page, organized by category:

1. **Oil Seeds Section** - Add:
   - Hulled Sesame Seeds card
   - Brown Sesame Seeds card
   - Update Groundnut card to show it has multiple variants

2. **Herbs & Spices Section** - Add 24 new product cards for all spices

3. **Animal Feed Section** - Add:
   - Cottonseed De Oiled Cake card
   - Groundnut Oil Cakes card

4. **Grains & Pulses Section** - Add:
   - Barley card
   - Sorghum card
   - Update Pulses card to show varieties

5. **Beans & Nuts Section** - Add:
   - Almonds card
   - Raisins card
   - Desiccated Coconut card

### Phase 4: Product Images

All product images should be sourced with white backgrounds. Search format:
- "[Product Name] white background image"
- Professional product photography style
- High resolution
- Clean, clear presentation

**Images needed:**
- Hulled sesame seeds ✓ (generated)
- Brown sesame seeds ✓ (generated)
- Groundnut variants ✓ (generated - Java, Bold, Splits)
- All 24 spice products
- Cottonseed cake
- Groundnut oil cakes
- Barley
- Sorghum
- Almonds
- Raisins
- Desiccated coconut
- Pulse varieties

### Phase 5: Update Navigation & Sitemap

1. Update `sitemap.xml` with all new product pages
2. Ensure all product pages are linked from `our-products.html`
3. Add breadcrumb navigation to all product pages

---

## Product Page Template Structure

Each product detail page should have:

```html
<!-- Vertical Variant Sections (if product has multiple types) -->
<div class="product-variants-section">
    <div class="variant-item">
        <div class="variant-image">
            <img src="images/products/[variant-name].png" alt="[Variant Name]">
        </div>
        <div class="variant-details">
            <h3>[Variant Name]</h3>
            <p class="variant-description">[Description]</p>
            <div class="variant-specs">
                <table>
                    <!-- Specifications -->
                </table>
            </div>
        </div>
    </div>
    <!-- Repeat for each variant -->
</div>
```

---

## Notes

- All products must match exactly what's on the Mark Overseas website
- No products should be removed unless they're not on the source website
- Maintain the same premium design aesthetic
- Ensure mobile responsiveness
- Add proper SEO for each product page
- Include WhatsApp inquiry links for all products
- Use consistent naming conventions

---

## Priority Order

1. **HIGH**: Update existing product pages with variants (Sesame, Groundnut, Rice, Pulses)
2. **HIGH**: Add all 24 spice products (major category expansion)
3. **MEDIUM**: Add missing nuts (Almonds, Raisins, Desiccated Coconut)
4. **MEDIUM**: Add missing grains (Barley, Sorghum)
5. **LOW**: Add missing animal feed products

---

## Image Sources

Since image generation quota is exhausted, images should be:
1. Downloaded from free stock photo sites (Unsplash, Pexels, Pixabay)
2. Search term: "[product name] white background"
3. Ensure commercial use is allowed
4. Resize to consistent dimensions (800x800px recommended)
5. Optimize for web (compress to reduce file size)

---

## Completion Checklist

- [ ] Update product-sesame.html with 4 variants
- [ ] Update product-groundnut.html with 5 variants
- [ ] Update product-rice.html with rice varieties
- [ ] Update product-pulses.html with 5 pulse types
- [ ] Create 24 new spice product pages
- [ ] Create 3 new nut product pages
- [ ] Create 2 new grain product pages
- [ ] Create 2 new animal feed product pages
- [ ] Update our-products.html with all new products
- [ ] Source and add all product images
- [ ] Update sitemap.xml
- [ ] Test all product page links
- [ ] Verify mobile responsiveness
- [ ] Check SEO meta tags on all pages
