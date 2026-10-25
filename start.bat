@echo off
title Nebula AI Chatbot
echo ===================================================
echo   Starting Nebula AI Chatbot (Client + Server)
echo ===================================================
echo.
echo 1. Starting Express backend on http://localhost:5000...
start "Nebula Backend Server" cmd /k "cd server && npm run dev"

echo 2. Starting Vite frontend on http://localhost:5173...
start "Nebula Frontend Client" cmd /k "cd client && npm run dev"

timeout /t 3 /nobreak >nul
echo 3. Opening Nebula in your default web browser...
start http://localhost:5173

echo.
echo Nebula is running! Enjoy chatting.
