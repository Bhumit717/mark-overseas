$svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" style="margin-right: 5px; vertical-align: middle;"><path fill="#4285f4" d="M32 10h14v28h-14z"></path><path fill="#34a853" d="M2 10h14v28H2z"></path><path fill="#fbbc04" d="M16 10h14v14H16z"></path><path fill="#ea4335" d="M16 24h14v14H16z"></path><path fill="#fff" d="M22 18h-4v-2h4v-2h2v2h4v2h-4v4h-2z"></path><path fill="#fff" d="M38 30h-8v2h6.5c-.3 1.7-1.7 3-3.5 3-2.2 0-4-1.8-4-4s1.8-4 4-4c1 0 1.9.4 2.6 1l1.4-1.4C35.9 25.6 34.5 25 33 25c-3.3 0-6 2.7-6 6s2.7 6 6 6c3.2 0 5.8-2.4 6-5.5V30z"></path></svg>'

Get-ChildItem -Path "." -Filter "*.html" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # Pattern 1: Multi-line format
    $pattern1 = '<i\s+class="fas fa-globe me-2"></i>Translate'
    $pattern2 = '<i[\r\n\s]+class="fas fa-globe me-2"></i>Translate'
    
    if ($content -match $pattern1 -or $content -match $pattern2) {
        $content = $content -replace '<i\s+class="fas fa-globe me-2"></i>Translate', $svgIcon
        $content = $content -replace '<i[\r\n\s]+class="fas fa-globe me-2"></i>Translate', $svgIcon
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($_.Name)"
    }
}

Write-Host "Done!"
