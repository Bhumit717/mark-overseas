# Get the exact footer structure from index.html
$indexContent = [System.IO.File]::ReadAllText("c:\Users\bhumi\Desktop\clone\mark-overseas\index.html")

# Extract the entire footer block from index.html
$footerPattern = '(?s)<footer>.*?</footer>'
$footerMatch = [System.Text.RegularExpressions.Regex]::Match($indexContent, $footerPattern)

if ($footerMatch.Success) {
    $newFooter = $footerMatch.Value
    
    $htmlFiles = Get-ChildItem c:\Users\bhumi\Desktop\clone\mark-overseas\*.html

    foreach ($file in $htmlFiles) {
        if ($file.Name -eq "index.html") { continue }
        
        $content = [System.IO.File]::ReadAllText($file.FullName)
        
        # Replace the existing footer in the target file with the one from index.html
        if ($content -match '(?s)<footer>.*?</footer>') {
            $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, '(?s)<footer>.*?</footer>', $newFooter)
            
            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file.FullName, $newContent)
                Write-Host "Mirrored footer in $($file.Name)"
            }
        }
    }
}
else {
    Write-Error "Could not find <footer> block in index.html"
}
