# Taskify — Railway deploy script
# Usage:
#   1. railway login
#   2. $env:RAILWAY_TOKEN = "your-token"   # optional, for CI/non-interactive
#   3. .\scripts\railway-deploy.ps1

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Checking Railway auth..."
railway whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: railway login"
  exit 1
}

$envFile = Join-Path $PWD "BACKEND\.env"
if (-not (Test-Path $envFile)) {
  Write-Host "Missing BACKEND\.env — copy from BACKEND\.env.example"
  exit 1
}

Get-Content $envFile | ForEach-Object {
  if ($_ -match '^\s*([^#=]+)=(.*)$') {
    $name = $matches[1].Trim()
    $value = $matches[2].Trim().Trim('"')
    Set-Variable -Name $name -Value $value -Scope Script
  }
}

if (-not $MONGO_URI -or -not $JWT_SECRET) {
  Write-Host "BACKEND\.env must contain MONGO_URI and JWT_SECRET"
  exit 1
}

Write-Host "Linking Railway project (creates if new)..."
railway link --project taskify 2>$null
if ($LASTEXITCODE -ne 0) {
  railway init --name taskify
}

Write-Host "Setting environment variables..."
railway variables set `
  NODE_ENV=production `
  SERVE_FRONTEND=true `
  JWT_EXPIRES_IN=7d `
  MONGO_URI="$MONGO_URI" `
  JWT_SECRET="$JWT_SECRET"

Write-Host "Deploying from GitHub-connected service or local Dockerfile..."
railway up --detach

Write-Host ""
Write-Host "Generate a public domain in Railway dashboard if not set:"
Write-Host "  Settings -> Networking -> Generate Domain"
Write-Host ""
Write-Host "Then set FRONTEND_URL to your Railway URL and redeploy:"
Write-Host "  railway variables set FRONTEND_URL=https://<your-app>.up.railway.app"
Write-Host "  railway up --detach"
