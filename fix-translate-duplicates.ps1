# Fix duplicate Google Translate scripts in HTML files
$files = @(
    "C:\Users\bhumi\Desktop\clone\lime\product-maize.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-millet.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-mustard.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-pulses.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-rice-bran-cake.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-sesame-black.html",
    "C:\Users\bhumi\Desktop\clone\lime\product-soya-cake.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Remove the first occurrence of the script tag (the one without the function)
        $pattern = '\s*<script type="text/javascript"\s+src="https://translate\.google\.com/translate_a/element\.js\?cb=googleTranslateElementInit"><\/script>\s*\n\s*\n'
        $content = $content -replace $pattern, "`n"
        
        # Add autoDisplay: false to the configuration
        $content = $content -replace '(layout:\s*google\.translate\.TranslateElement\.InlineLayout\.SIMPLE)\s*\n', '$1,`n                autoDisplay: false`n'
        
        # Save the file
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "Fixed: $file"
    }
}

Write-Host "All files fixed!"
