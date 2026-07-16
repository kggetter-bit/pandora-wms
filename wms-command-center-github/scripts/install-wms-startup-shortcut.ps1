$ErrorActionPreference = "Stop"

$shortcutName = "WMS Command Center Server.lnk"
$startupDir = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Startup"
$shortcutPath = Join-Path $startupDir $shortcutName
$startScript = Join-Path $PSScriptRoot "start-wms-server.ps1"

if (!(Test-Path $startScript)) {
  throw "Start script not found: $startScript"
}

New-Item -ItemType Directory -Path $startupDir -Force | Out-Null

$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`""
$shortcut.WorkingDirectory = Split-Path -Parent $PSScriptRoot
$shortcut.Description = "Start WMS Command Center Vite server on http://127.0.0.1:5173"
$shortcut.Save()

Write-Host "Installed startup shortcut: $shortcutPath"
Write-Host "It will start WMS at Windows login: http://127.0.0.1:5173"
