# PowerShell script to add Google Translate widget to all product pages

$productPages = @(
    "product-asafoetida.html",
    "product-cardamom.html",
    "product-cashew.html",
    "product-cumin.html",
    "product-groundnut.html",
    "product-maize.html",
    "product-millet.html",
    "product-mustard.html",
    "product-pistachios.html",
    "product-pulses.html",
    "product-rapeseed-meal.html",
    "product-rice-bran-cake.html",
    "product-rice.html",
    "product-sesame-black.html",
    "product-soya-cake.html",
    "product-turmeric.html"
)

$languageSelectorHTML = @"
                    <li class="language-selector">
                        <div id="google_translate_element"></div>
                    </li>
"@

$translateScript = @"
    <script type="text/javascript">
        function googleTranslateElementInit() {
            new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,hi,gu,es,fr,de,ar,zh-CN,ja,ko,pt,ru,it,tr,nl,pl,vi,th,id,ms,bn,ta,te,mr,ur',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
"@

foreach ($page in $productPages) {
    $filePath = $page
    
    if (Test-Path $filePath) {
        Write-Host "Processing $page..." -ForegroundColor rgb(8, 175, 8)
        
        $content = Get-Content $filePath -Raw
        
        # Add language selector to menu if not already present
        if ($content -notmatch 'google_translate_element') {
            # Add language selector before </ul>
            $content = $content -replace '(\s*<li><a href="contact-us\.html">Contact Us</a></li>\s*</ul>)', 
                "`$1`n$languageSelectorHTML                </ul>"
            
            # Add translate script before </header>
            $content = $content -replace '(\s*</div>\s*</div>\s*</header>)', 
                "`$1`n$translateScript"
            
            # Save the file
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "✓ Updated $page" -ForegroundColor Cyan
        } else {
            Write-Host "○ $page already has Google Translate" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ File not found: $page" -ForegroundColor Red
    }
}

Write-Host "`nAll product pages updated successfully!" -ForegroundColor rgb(8, 175, 8)
