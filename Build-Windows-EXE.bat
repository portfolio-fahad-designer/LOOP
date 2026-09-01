@echo off
title Loop Desktop - Building Windows .EXE
echo ===================================================
echo        LOOP DESKTOP - WINDOWS .EXE BUILDER
echo ===================================================
echo.

echo [1/3] Checking Node.js installation...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [2/3] Installing dependencies and building web assets...
call npm install
call npm run build

echo.
echo [3/3] Packaging into Windows Standalone .EXE...
npx --yes electron-packager . Loop --platform=win32 --arch=x64 --out=dist-exe --overwrite --prune=true

echo.
echo ===================================================
echo [SUCCESS] .EXE file generated in "dist-exe\Loop-win32-x64\Loop.exe"
echo ===================================================
echo.
pause
