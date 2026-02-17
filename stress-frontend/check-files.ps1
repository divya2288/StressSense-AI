Write-Host "Checking component files..." -ForegroundColor Cyan

$components = @(
    "AIChat.js",
    "StressHeatmap.js",
    "MeditationPlayer.js",
    "WeeklyReport.js"
)

$styles = @(
    "AIChat.css",
    "StressHeatmap.css",
    "MeditationPlayer.css",
    "WeeklyReport.css"
)

Write-Host "`nComponents:" -ForegroundColor Yellow
foreach ($file in $components) {
    $path = "src\components\$file"
    if (Test-Path $path) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file MISSING" -ForegroundColor Red
    }
}

Write-Host "`nStyles:" -ForegroundColor Yellow
foreach ($file in $styles) {
    $path = "src\styles\$file"
    if (Test-Path $path) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file MISSING" -ForegroundColor Red
    }
}

Write-Host "`nDone!" -ForegroundColor Cyan