@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall-wms-startup-registry.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall-wms-startup-shortcut.ps1"
echo.
echo Done. WMS autostart entries removed if they existed.
pause
