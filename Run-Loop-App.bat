@echo off
title Loop Desktop App Launcher
echo ===================================================
echo             LOOP APP - 1-CLICK LAUNCHER
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is required to run this app locally.
    echo Please install Node.js from https://nodejs.org/ and run this again.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Installing dependencies for the first time...
    call npm install
)

echo Starting local server and opening Loop app...
start http://localhost:3000
npm run dev
pause
