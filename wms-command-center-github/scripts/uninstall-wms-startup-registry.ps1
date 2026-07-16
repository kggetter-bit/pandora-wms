$ErrorActionPreference = "Stop"

$runKey = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
$valueName = "WMS Command Center Server"

if (Get-ItemProperty -Path $runKey -Name $valueName -ErrorAction SilentlyContinue) {
  Remove-ItemProperty -Path $runKey -Name $valueName
  Write-Host "Removed HKCU Run startup entry: $valueName"
} else {
  Write-Host "HKCU Run startup entry not found: $valueName"
}
