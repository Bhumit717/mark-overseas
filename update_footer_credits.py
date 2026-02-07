import re
import os

def update_footers_and_images():
    cwd = os.getcwd()
    html_files = [f for f in os.listdir(cwd) if f.endswith('.html')]
    
    # URL Update
    old_url = 'https://www.bhumit.site'
    new_url = 'https://bhumitnasit.vercel.app/'
    
    # Image Updates
    # Note: Using regex to catch various path styles if any (like images/products/tamarind.png)
    image_updates = {
        r'images/products/tamarind\.png': 'images/products/Tamarind.png',
        r'images/products/fruits-vegetables\.png': 'images/products/fruits and vegitables.png'
    }
    
    count_files = 0
    count_url = 0
    count_img = 0
    
    for filename in html_files:
        filepath = os.path.join(cwd, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # Update URL
            if old_url in new_content:
                new_content = new_content.replace(old_url, new_url)
                count_url += 1
            
            # Update Images
            for old_img_pattern, new_img_path in image_updates.items():
                if re.search(old_img_pattern, new_content, re.IGNORECASE):
                    new_content = re.sub(old_img_pattern, new_img_path, new_content, flags=re.IGNORECASE)
                    count_img += 1
                
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count_files += 1
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    print(f"Updated {count_files} files.")
    print(f"URL occurrences updated: {count_url}")
    print(f"Image paths updated: {count_img}")

if __name__ == "__main__":
    update_footers_and_images()
            
    print(f"Updated {count} files with developer credits.")

if __name__ == "__main__":
    update_footers()
