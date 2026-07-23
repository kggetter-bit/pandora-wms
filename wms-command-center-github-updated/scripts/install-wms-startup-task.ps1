$ErrorActionPreference = "Stop"

$taskName = "WMS Command Center Dev Server"
$startScript = Join-Path $PSScriptRoot "start-wms-server.ps1"

if (!(Test-Path $startScript)) {
  throw "Start script not found: $startScript"
}

$action = New-ScheduledTaskAction `
  -Execute "powershell.exe" `
  -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$startScript`""

$trigger = New-ScheduledTaskTrigger -AtLogOn
$settings = New-ScheduledTaskSettingsSet `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit (New-TimeSpan -Hours 12)

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Settings $settings `
  -Description "Start the WMS Command Center Vite server on http://127.0.0.1:5173 when this Windows user logs in." `
  -Force | Out-Null

Write-Host "Installed scheduled task: $taskName"
Write-Host "It will start WMS at logon: http://127.0.0.1:5173"
