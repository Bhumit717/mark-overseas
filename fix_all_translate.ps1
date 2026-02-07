Get-ChildItem -Path "." -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # Replace any SVG that's part of the language selector
    if ($content -match 'id="lang-selector-btn"[^>]*><svg') {
        # Replace the entire link content
        $content = $content -replace '(id="lang-selector-btn"[^>]*>)<svg[^<]*(?:<[^/][^>]*>[^<]*</[^>]*>)*</svg>', '$1<i class="fas fa-globe me-2"></i>Translate'
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($_.Name)"
    }
}

Write-Host "`nDone!"
