@echo off
echo ================================
echo   ChatMe Frontend Setup
echo   Next.js 16.2.6
echo ================================
echo.
echo [1/4] Cleaning old cache...
if exist ".next" rmdir /s /q ".next"
echo.
echo [2/4] Installing dependencies...
npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)
echo.
echo [3/4] Setup complete!
echo.
echo [4/4] Starting dev server...
echo    Open http://localhost:3000 in your browser
echo    Backend should be running on http://localhost:8000
echo.
npm run dev
pause
