[CmdletBinding()]
param(
  [string]$AppId = 'f3d8bfeb-3712-4ca1-ab4c-72317e96d297',
  [int]$TimeoutSeconds = 300,
  [switch]$CheckOnly
)

$ErrorActionPreference = 'Stop'

function Resolve-CranlExecutable {
  $cranlCommand = Get-Command cranl -ErrorAction SilentlyContinue

  if ($cranlCommand) {
    return $cranlCommand.Source
  }

  $cranlCandidate = Join-Path $env:LOCALAPPDATA 'cranl\cranl.exe'

  if (Test-Path -LiteralPath $cranlCandidate) {
    return $cranlCandidate
  }

  throw 'Cranl CLI is not installed. Install it from https://docs.cranl.com/cli/ and sign in first.'
}

$cranlExecutable = Resolve-CranlExecutable
$cranlConfigPath = Join-Path $env:USERPROFILE '.cranl\config.json'

if (-not (Test-Path -LiteralPath $cranlConfigPath)) {
  throw 'Cranl credentials were not found. Run: cranl login <api-key>'
}

$cranlConfig = Get-Content -Raw -LiteralPath $cranlConfigPath | ConvertFrom-Json

if (-not $cranlConfig.api_key) {
  throw 'The Cranl configuration does not contain an API key. Sign in again with the Cranl CLI.'
}

$cranlApiRoot = if ($cranlConfig.api_url) {
  ([string]$cranlConfig.api_url).TrimEnd('/')
} else {
  'https://app.cranl.com'
}

$deploymentEndpoint = "$cranlApiRoot/api/applications/$AppId/deployments"
$purgeCacheEndpoint = "$cranlApiRoot/api/applications/$AppId/purge-cache"
$cranlHeaders = @{
  Authorization = 'Bearer ' + $cranlConfig.api_key
  Accept = 'application/json'
}

function Get-LatestDeployment {
  $deploymentResponse = Invoke-RestMethod -Method Get -Uri $deploymentEndpoint -Headers $cranlHeaders
  $deploymentItems = if ($deploymentResponse.deployments) {
    @($deploymentResponse.deployments)
  } else {
    @($deploymentResponse)
  }

  return $deploymentItems |
    Sort-Object { [DateTimeOffset]$_.createdAt } -Descending |
    Select-Object -First 1
}

function Clear-ApplicationCache {
  $purgeResponse = Invoke-RestMethod -Method Post -Uri $purgeCacheEndpoint -Headers $cranlHeaders

  if (-not $purgeResponse.success) {
    throw 'The deployment completed, but Cranl did not confirm that the application cache was cleared.'
  }

  Write-Host 'Application cache cleared.'
}

$previousDeployment = Get-LatestDeployment

if ($CheckOnly) {
  if (-not $previousDeployment) {
    Write-Host 'No Cranl deployments were found.'
    exit 0
  }

  Write-Host "Latest deployment: $($previousDeployment.status)"
  Write-Host "Title: $($previousDeployment.title)"
  Write-Host "Created: $($previousDeployment.createdAt)"
  exit 0
}

Write-Host 'Triggering Cranl deployment...'
& $cranlExecutable apps deploy $AppId

if ($LASTEXITCODE -ne 0) {
  throw 'Cranl rejected the deployment request.'
}

$deploymentDeadline = [DateTimeOffset]::UtcNow.AddSeconds($TimeoutSeconds)
$lastReportedStatus = ''

do {
  Start-Sleep -Seconds 5
  $latestDeployment = Get-LatestDeployment

  if ($latestDeployment -and $latestDeployment.deploymentId -ne $previousDeployment.deploymentId) {
    $currentStatus = [string]$latestDeployment.status

    if ($currentStatus -ne $lastReportedStatus) {
      Write-Host "Deployment status: $currentStatus"
      $lastReportedStatus = $currentStatus
    }

    if ($currentStatus -eq 'done') {
      Clear-ApplicationCache
      Write-Host "Deployment completed: $($latestDeployment.title)"
      exit 0
    }

    if ($currentStatus -eq 'error') {
      throw "Deployment failed: $($latestDeployment.title)"
    }
  }
} while ([DateTimeOffset]::UtcNow -lt $deploymentDeadline)

throw "Deployment did not finish within $TimeoutSeconds seconds. Check Cranl deployment logs."
