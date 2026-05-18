# Taskify — GitHub push + Railway deploy helper

$ErrorActionPreference = "Stop"

Set-Location $PSScriptRoot\..

Write-Host "Pushing to GitHub..."
git remote set-url origin https://github.com/subhadeeplet/project_taskify.git 2>$null
git push -u origin main

Write-Host ""
Write-Host "GitHub: https://github.com/subhadeeplet/project_taskify"
Write-Host ""
Write-Host "Railway deploy:"
Write-Host "  1. Go to https://railway.com/new"
Write-Host "  2. Choose 'Deploy from GitHub repo'"
Write-Host "  3. Select subhadeeplet/project_taskify"
Write-Host "  4. Railway will use the Dockerfile + railway.toml automatically"
Write-Host "  5. Open your service -> Variables and add:"
Write-Host "       NODE_ENV       = production"
Write-Host "       SERVE_FRONTEND = true"
Write-Host "       MONGO_URI      = your MongoDB Atlas connection string"
Write-Host "       JWT_SECRET     = long random string (32+ chars)"
Write-Host "       JWT_EXPIRES_IN = 7d"
Write-Host "  6. Settings -> Networking -> Generate Domain"
Write-Host "  7. Add variable FRONTEND_URL = your Railway URL (e.g. https://xxx.up.railway.app)"
Write-Host "  8. Redeploy after setting FRONTEND_URL"
Write-Host ""
Write-Host "MongoDB Atlas: Network Access -> allow 0.0.0.0/0 (required for Railway)"
Write-Host ""
Write-Host "Verify: curl https://<your-railway-domain>/api/health"
