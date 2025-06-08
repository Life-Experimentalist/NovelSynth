# NovelSynth Development Helper Script
# Usage: .\dev-helper.ps1 [command]
# Commands: build, clean, test, package, help

param(
    [Parameter(Position = 0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "NovelSynth Development Helper" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Available commands:" -ForegroundColor Yellow
    Write-Host "  build    - Build the extension for production" -ForegroundColor Green
    Write-Host "  clean    - Clean build artifacts" -ForegroundColor Green
    Write-Host "  test     - Run validation tests" -ForegroundColor Green
    Write-Host "  package  - Create distributable package" -ForegroundColor Green
    Write-Host "  dev      - Start development server" -ForegroundColor Green
    Write-Host "  help     - Show this help message" -ForegroundColor Green
    Write-Host ""
    Write-Host "Example: .\dev-helper.ps1 build" -ForegroundColor Gray
}

function Build-Extension {
    Write-Host "Building NovelSynth Extension..." -ForegroundColor Cyan
    npm run build:extension
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build completed successfully!" -ForegroundColor Green
        Write-Host "Extension files are in the 'dist' folder" -ForegroundColor Gray
    }
    else {
        Write-Host "❌ Build failed!" -ForegroundColor Red
    }
}

function Clean-Build {
    Write-Host "Cleaning build artifacts..." -ForegroundColor Cyan
    npm run clean
    Write-Host "✅ Clean completed!" -ForegroundColor Green
}

function Test-Validation {
    Write-Host "Running validation tests..." -ForegroundColor Cyan
    npm run test:validation
    Write-Host "✅ Tests completed!" -ForegroundColor Green
}

function Start-Dev {
    Write-Host "Starting development server..." -ForegroundColor Cyan
    npm run dev
}

function Create-Package {
    Write-Host "Creating distributable package..." -ForegroundColor Cyan

    # Clean and build first
    npm run build:extension

    if ($LASTEXITCODE -eq 0) {
        # Create package directory
        $packageDir = "package-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

        # Copy dist contents
        Copy-Item -Path "dist\*" -Destination $packageDir -Recurse -Force

        # Create ZIP file
        $zipName = "NovelSynth-v2.0.0-$(Get-Date -Format 'yyyyMMdd').zip"
        Compress-Archive -Path "$packageDir\*" -DestinationPath $zipName -Force

        # Cleanup temp directory
        Remove-Item -Path $packageDir -Recurse -Force

        Write-Host "✅ Package created: $zipName" -ForegroundColor Green
        Write-Host "Ready for browser extension store submission!" -ForegroundColor Gray
    }
    else {
        Write-Host "❌ Package creation failed due to build errors!" -ForegroundColor Red
    }
}

# Execute command
switch ($Command.ToLower()) {
    "build" { Build-Extension }
    "clean" { Clean-Build }
    "test" { Test-Validation }
    "package" { Create-Package }
    "dev" { Start-Dev }
    "help" { Show-Help }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Show-Help
    }
}
