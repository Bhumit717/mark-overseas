$globeHtml = '						<div class="col-lg-4 col-md-12 order-3 order-lg-2 my-4 my-lg-0">
							<div class="footer-globe-col" style="background-color: #2596be; border: none; padding: 15px; display: flex; justify-content: center; align-items: center;">
								<video autoplay muted loop playsinline style="width: 300%; max-width: 650px; border: none; outline: none;">
									<source src="upload/4K Planet Earth Globe Rotating   rgb(8, 175, 8) Screen   1 - SL Blizzard (720p, h264).mp4" type="video/mp4">
								</video>
							</div>
						</div>'

$htmlFiles = Get-ChildItem c:\Users\bhumi\Desktop\clone\mark-overseas\*.html

foreach ($file in $htmlFiles) {
    if ($file.Name -eq "index.html") { continue }
    $content = [System.IO.File]::ReadAllText($file.FullName)
    
    if ($content -notmatch 'footer-globe-col') {
        # Find the column containing Quick Links and insert the globe after it
        # We look for the closing </div> of the Quick Links column
        $pattern = '(<div class="footer-menu">[\s\S]*?<\/div>\s*<\/div>)'
        $newContent = [System.Text.RegularExpressions.Regex]::Replace($content, $pattern, "${1}`n$globeHtml")
        
        if ($content -ne $newContent -and $newContent -match 'footer-globe-col') {
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Injected into $($file.Name)"
        }
    }
    else {
        # Update existing
        $newContent = $content -replace '(<div class="footer-globe-col".*?style=").*?(".*?>)', "${1}background-color: #2596be; border: none; padding: 15px; display: flex; justify-content: center; align-items: center;${2}"
        $newContent = $newContent -replace '(<video.*?style=").*?(".*?>)', "${1}width: 300%; max-width: 650px; border: none; outline: none;${2}"
        if ($content -ne $newContent) {
            [System.IO.File]::WriteAllText($file.FullName, $newContent)
            Write-Host "Updated in $($file.Name)"
        }
    }
}
