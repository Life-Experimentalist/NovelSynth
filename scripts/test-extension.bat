@echo off
echo [TEST] Starting Cross-Browser Extension Testing...
echo.

REM Check if we're in the right directory
if not exist "..\manifest.json" (
    echo [ERROR] Please run this script from the scripts directory
    echo    Current directory: %CD%
    echo    Expected to find: ..\manifest.json
    pause
    exit /b 1
)

echo [OPTIONS] Available Testing Options:
echo.
echo 1. [DEV] Development Mode (Direct from source)
echo 2. [PKG] Built Package Mode (from scripts/dist/)
echo.

set /p choice="Choose testing mode (1 or 2): "

if "%choice%"=="1" goto development
if "%choice%"=="2" goto package
echo [WARN] Invalid choice. Using development mode.

:development
echo.
echo [DEV] Development Mode Testing Instructions:
echo.
echo Firefox Testing:
echo    1. Open Firefox
echo    2. Go to: about:debugging#/runtime/this-firefox
echo    3. Click "Load Temporary Add-on..."
echo    4. Navigate to: %CD%\..
echo    5. Select: manifest.json
echo.
echo Edge Testing:
echo    1. Open Edge
echo    2. Go to: edge://extensions/
echo    3. Enable "Developer mode" (top-right toggle)
echo    4. Click "Load unpacked"
echo    5. Select folder: %CD%\..
echo.
echo Chrome Testing (if available):
echo    1. Open Chrome
echo    2. Go to: chrome://extensions/
echo    3. Enable "Developer mode" (top-right toggle)
echo    4. Click "Load unpacked"
echo    5. Select folder: %CD%\..
goto end

:package
echo.
echo [CHECK] Checking for built packages...
if not exist "dist" (
    echo [WARN] No built packages found. Building now...
    cd ..
    call npm run build
    cd scripts
)

if not exist "dist" (
    echo [ERROR] Build failed. Please run 'npm run build' manually.
    goto end
)

echo.
echo [PKG] Package Mode Testing Instructions:
echo.
echo Firefox Testing:
echo    1. Open Firefox
echo    2. Go to: about:debugging#/runtime/this-firefox
echo    3. Click "Load Temporary Add-on..."
echo    4. Navigate to: %CD%\dist\firefox
echo    5. Select: manifest.json
echo.
echo Edge Testing:
echo    1. Open Edge
echo    2. Go to: edge://extensions/
echo    3. Enable "Developer mode"
echo    4. Click "Load unpacked"
echo    5. Select folder: %CD%\dist\edge
echo.
echo Chrome Testing:
echo    1. Open Chrome
echo    2. Go to: chrome://extensions/
echo    3. Enable "Developer mode"
echo    4. Click "Load unpacked"
echo    5. Select folder: %CD%\dist\chrome
echo.

echo [PACKAGES] Available packages:
if exist "dist\*.zip" (
    dir /b "dist\*.zip"
    echo.
    echo [INFO] You can also install these ZIP packages directly in browsers
) else (
    echo    No ZIP packages found
)

:end
echo.
echo [CHECKLIST] Testing Checklist:
echo [X] Extension loads without errors
echo [X] Popup opens and displays correctly
echo [X] Content scripts inject on supported sites
echo [X] Settings save and load properly
echo [X] AI processing works with valid API keys
echo.
echo [DEBUG] For debugging: Open browser DevTools (F12) and check Console
echo.
pause