$ErrorActionPreference = "Stop"

$projectDir = Split-Path -Parent $PSScriptRoot
$nodeExe = Join-Path $HOME ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$viteJs = Join-Path $projectDir "node_modules\vite\bin\vite.js"
$logDir = Join-Path $projectDir ".server-logs"
$outLog = Join-Path $logDir "vite-out.log"
$errLog = Join-Path $logDir "vite-err.log"

New-Item -ItemType Directory -Path $logDir -Force | Out-Null

$existing = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue |
  Where-Object { $_.State -eq "Listen" -or $_.State -eq "Established" }
if ($existing) {
  "WMS server already listening on http://127.0.0.1:5173 at $(Get-Date -Format s)" | Out-File -FilePath $outLog -Append -Encoding utf8
  exit 0
}

if (!(Test-Path $nodeExe)) {
  "Node runtime not found: $nodeExe" | Out-File -FilePath $errLog -Append -Encoding utf8
  exit 1
}

if (!(Test-Path $viteJs)) {
  "Vite entry not found: $viteJs" | Out-File -FilePath $errLog -Append -Encoding utf8
  exit 1
}

$nodeBin = Split-Path -Parent $nodeExe
$cmd = "set PATH=$nodeBin;%PATH% && cd /d `"$projectDir`" && start `"WMS Command Center`" /min cmd.exe /c `"`"$nodeExe`" `"$viteJs`" --host 127.0.0.1 --port 5173 --strictPort 1>>`"$outLog`" 2>>`"$errLog`"`""
Start-Process -FilePath "$env:ComSpec" `
  -ArgumentList @("/c", $cmd) `
  -WorkingDirectory $projectDir `
  -WindowStyle Hidden

"Started WMS server on http://127.0.0.1:5173 at $(Get-Date -Format s)" | Out-File -FilePath $outLog -Append -Encoding utf8
