@echo off
title Start MongoDB Service
echo ===================================================
echo   Shree Chamunda Associates - MongoDB Service Starter
echo ===================================================
echo.
echo Starting MongoDB Windows Service with Administrator rights...
echo (If prompted, please click 'Yes' on the UAC dialog)
echo.

powershell -Command "Start-Process cmd -ArgumentList '/c net start MongoDB & pause' -Verb RunAs"

echo.
echo Please check the elevated window to confirm the service started.
echo Once started, your backend will automatically connect within 5 seconds!
echo ===================================================
pause
