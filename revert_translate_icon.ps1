$originalIcon = '<i class="fas fa-globe me-2"></i>Translate'

Get-ChildItem -Path "." -Filter "*.html" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # Pattern to match the SVG icon
    $svgPattern = '<svg xmlns="http://www\.w3\.org/2000/svg"[^>]*>.*?</svg>'
    
    if ($content -match $svgPattern) {
        $content = $content -replace $svgPattern, $originalIcon
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Reverted: $($_.Name)"
    }
}

Write-Host "Done! All files reverted to original Translate button."
