import os
import re

def update_branding():
    cwd = os.getcwd()
    old_phone_display = "99133 05996"
    new_phone_display = "99789 25996"
    
    old_phone_clean = "9913305996"
    new_phone_clean = "9978925996"
    
    old_cta = "Start Trading With Us"
    new_cta = "Let's build business together"
    
    # Regex to catch variations of phone number
    # +91 99133 05996, 99133 05996, 9913305996
    phone_pattern = re.compile(r'(\+91\s*)?99133(\s*)05996|9913305996')
    
    # Regex for CTA (case insensitive)
    cta_pattern = re.compile(re.escape(old_cta), re.IGNORECASE)

    count_files = 0
    count_replacements = 0

    for root, dirs, files in os.walk(cwd):
        # Skip hidden directories like .git
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        
        for file in files:
            if file.endswith('.html'):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content
                
                # Replace CTA
                new_content = cta_pattern.sub(new_cta, new_content)
                
                # Replace Phone variants
                # Handling tel: links and WhatsApp links (no spaces)
                new_content = new_content.replace(old_phone_clean, new_phone_clean)
                
                # Handling display formats (with spaces)
                new_content = new_content.replace(old_phone_display, new_phone_display)
                
                # Handling hyphenated variants (e.g., +91-99133-05996)
                new_content = new_content.replace("99133-05996", "99789-25996")
                
                # Catch-all for other variants using regex if needed, 
                # but direct replace is safer for common patterns.
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count_files += 1
                    count_replacements += 1 # Rough count per file
                    print(f"Updated: {file}")

    print(f"Total files updated: {count_files}")

if __name__ == "__main__":
    update_branding()
