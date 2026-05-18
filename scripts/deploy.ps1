# Taskify — GitHub push + Render deploy helper
# Run from project root after: gh auth login

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"

Write-Host "Checking GitHub auth..."
& $gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: gh auth login"
  exit 1
}

Set-Location $PSScriptRoot\..

Write-Host "Creating GitHub repo (if needed) and pushing..."
git remote set-url origin https://github.com/subhadeeplet/project_taskify.git 2>$null
git push -u origin main

Write-Host ""
Write-Host "GitHub push complete: https://github.com/subhadeeplet/project_taskify"
Write-Host ""
Write-Host "Render deploy:"
Write-Host "  1. Go to https://dashboard.render.com/select-repo?type=blueprint"
Write-Host "  2. Connect GitHub and select subhadeeplet/Taskify"
Write-Host "  3. Render will read render.yaml automatically"
Write-Host "  4. Set these env vars in Render dashboard:"
Write-Host "       MONGO_URI  = your MongoDB Atlas connection string"
Write-Host "       FRONTEND_URL = https://<your-render-app>.onrender.com"
Write-Host "  5. Deploy and wait for build to finish"
Write-Host ""
Write-Host "After deploy, update FRONTEND_URL to your actual Render URL if it changed."
