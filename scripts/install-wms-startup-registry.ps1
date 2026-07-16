$ErrorActionPreference = "Stop"

$runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$valueName = "WMS Command Center Server"
$startScript = Join-Path $PSScriptRoot "start-wms-server.ps1"

if (!(Test-Path $startScript)) {
  throw "Start script not found: $startScript"
}

$command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`""
New-Item -Path $runKey -Force | Out-Null
Set-ItemProperty -Path $runKey -Name $valueName -Value $command

Write-Host "Installed HKCU Run startup entry: $valueName"
Write-Host "It will start WMS at Windows login: http://127.0.0.1:5173"
