# PowerShell script to generate product and subproduct pages from the markdown reference
# --------------------------------------------------------------
# generate_pages_ps.ps1
# --------------------------------------------------------------

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$markdownPath = Join-Path $baseDir "MARK-OVERSEAS-PRODUCTS-REFERENCE.md"
$templatePath = Join-Path $baseDir "product-template.html"
$imgDir = Join-Path $baseDir "images\products"

# Load template
$template = Get-Content $templatePath -Raw

# Ensure image directory exists
if (-not (Test-Path $imgDir)) { New-Item -ItemType Directory -Path $imgDir | Out-Null }

function Slugify([string]$name) {
    $slug = $name.ToLower()
    # Replace &, /, \\, , with a space
    $slug = $slug -replace '[&/\\,]', ' '
    # Replace spaces, quotes, parentheses with hyphen
    $slug = $slug -replace '[\s''"()]', '-'
    # Remove any character that is not a‑z, 0‑9 or hyphen
    $slug = $slug -replace '[^a-z0-9-]', ''
    # Collapse multiple hyphens and trim leading/trailing hyphens
    $slug = $slug -replace '-+', '-'
    $slug = $slug.Trim('-')
    return $slug
}

function Ensure-Image([string]$slug, [string]$productName) {
    $targetFile = "$slug.png"
    $targetPath = Join-Path $imgDir $targetFile
    if (Test-Path $targetPath) { return $targetFile }
    $url = "https://dummyimage.com/600x400/ffffff/000000&text=" + [System.Net.WebUtility]::UrlEncode($productName)
    try {
        Invoke-WebRequest -Uri $url -OutFile $targetPath -UseBasicParsing -ErrorAction Stop
        Write-Host "✅ Placeholder created -> $targetFile"
    }
    catch {
        Write-Warning "Failed to download placeholder for $slug: $_"
    }
    return $targetFile
}

# Parse markdown – look for lines with **Product** inside a table
$category = ""
Get-Content $markdownPath | ForEach-Object {
    $line = $_
    if ($line -match "^##\s+(.+)") {
        $category = $Matches[1].Trim()
    }
    elseif ($line -match '\|\s*\*\*([^*]+)\*\*\s*\|') {
        $rawName = $Matches[1].Trim()
        $slug = Slugify $rawName
        $imageFile = Ensure-Image $slug $rawName
        $shortDesc = if ($rawName.Length -gt 120) { $rawName.Substring(0, 120) + "..." } else { $rawName }
        $desc = "$rawName – high‑quality product sourced from India."
        $uses = "Culinary, medicinal, industrial applications."
        $filled = $template -replace "\{name\}", $rawName
        $filled = $filled -replace "\{short_desc\}", $shortDesc
        $filled = $filled -replace "\{desc\}", $desc
        $filled = $filled -replace "\{uses\}", $uses
        $filled = $filled -replace "\{image\}", $imageFile
        $filled = $filled -replace "\{category\}", $category
        $filled = $filled -replace "\{category_upper\}", $category.ToUpper()
        $productPath = Join-Path $baseDir "product-$slug.html"
        $subPath = Join-Path $baseDir "subproduct-$slug.html"
        Set-Content -Path $productPath -Value $filled -Encoding UTF8
        Set-Content -Path $subPath -Value $filled -Encoding UTF8
        Write-Host "🗂️ Created: product-$slug.html & subproduct-$slug.html"
    }
}

Write-Host "✅ All pages generated."
