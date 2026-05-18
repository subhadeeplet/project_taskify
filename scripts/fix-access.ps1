# Fix Taskify Railway access when local DNS blocks *.railway.app
# Run as Administrator: Right-click PowerShell -> Run as administrator
#   cd path\to\taskify_project
#   .\scripts\fix-access.ps1

$ErrorActionPreference = "Stop"
$domain = "project-taskify-production.up.railway.app"
$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"
$marker = "# taskify-railway"

Write-Host "Resolving $domain via Google DNS..."
$ip = (Resolve-DnsName $domain -Server 8.8.8.8 -Type A).IPAddress
Write-Host "IP: $ip"

# 1. Update hosts file
$hostsContent = Get-Content $hostsPath -ErrorAction SilentlyContinue
$filtered = $hostsContent | Where-Object { $_ -notmatch [regex]::Escape($marker) -and $_ -notmatch [regex]::Escape($domain) }
$newEntry = "$ip `t$domain $marker"
$filtered + $newEntry | Set-Content $hostsPath -Encoding ASCII
Write-Host "Updated hosts file."

# 2. Set public DNS on active network adapters
$adapters = Get-NetAdapter | Where-Object { $_.Status -eq "Up" -and $_.InterfaceDescription -notmatch "Virtual|Loopback|Hyper-V" }
foreach ($adapter in $adapters) {
  Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ServerAddresses ("8.8.8.8", "1.1.1.1")
  Write-Host "Set DNS on: $($adapter.Name)"
}

ipconfig /flushdns | Out-Null
Write-Host ""
Write-Host "Done! Open: https://$domain"
Write-Host "If browser still fails, restart the browser completely."
