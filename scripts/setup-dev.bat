@echo off
echo [SETUP] Setting up NovelSynth Development Environment...
echo.

REM Check if we're in the right directory
if not exist "manifest.json" (
    echo [ERROR] Please run this script from the NovelSynth project root directory
    echo    Current directory: %CD%
    echo    Expected to find: manifest.json
    pause
    exit /b 1
)

echo [INSTALL] Installing dependencies...
if exist "package.json" (
    call npm install
    if errorlevel 1 (
        echo [WARN] npm install failed, continuing...
    ) else (
        echo [OK] Dependencies installed successfully
    )
) else (
    echo [WARN] package.json not found, skipping npm install
)

echo.
echo [CONFIG] Setting up Git hooks...

REM Create hooks directory if it doesn't exist
if not exist ".git\hooks" (
    mkdir ".git\hooks"
)

REM Copy pre-commit hook
if exist "scripts\pre-commit.sh" (
    copy "scripts\pre-commit.sh" ".git\hooks\pre-commit" >nul
    echo [OK] Pre-commit hook installed
) else (
    echo [WARN] Pre-commit hook script not found, skipping...
)

echo.
echo [UPDATE] Updating footer with current information...
if exist "scripts\update-footer.js" (
    node scripts\update-footer.js --force
    if errorlevel 1 (
        echo [WARN] Footer update failed, continuing...
    ) else (
        echo [OK] Footer updated successfully
    )
) else (
    echo [WARN] Footer update script not found, skipping...
)

echo.
echo [TEST] Testing extension setup...
echo.
echo Firefox Testing:
echo   1. Open Firefox
echo   2. Go to about:debugging#/runtime/this-firefox
echo   3. Click "Load Temporary Add-on..."
echo   4. Select manifest.json from: %CD%
echo.
echo Edge Testing:
echo   1. Open Edge
echo   2. Go to edge://extensions/
echo   3. Enable "Developer mode"
echo   4. Click "Load unpacked"
echo   5. Select this folder: %CD%
echo.

echo [SUCCESS] Setup completed successfully!
echo.
echo Available npm scripts:
echo   npm run update-footer     - Update footer information
echo   npm run build            - Build extension package
echo   npm run test             - Run tests
echo   npm run dev              - Start development mode
echo   npm run package          - Create distribution package
echo   npm run clean            - Clean build directory
echo   npm run clean-build      - Clean and rebuild
echo.

echo [INFO] The footer will be automatically updated before each git commit!
echo.
pause