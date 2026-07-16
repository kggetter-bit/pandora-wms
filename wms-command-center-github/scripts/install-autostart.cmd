@echo off
setlocal
cd /d "%~dp0"
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Run" /v "WMS Command Center Server" /t REG_SZ /d "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File \"%~dp0start-wms-server.ps1\"" /f
if errorlevel 1 powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-wms-startup-registry.ps1"
echo.
echo Done. WMS should auto-start at Windows login: http://127.0.0.1:5173
pause
