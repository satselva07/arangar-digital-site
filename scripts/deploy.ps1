param(
  [string]$ImageName = "arangar-digital:latest",
  [string]$ContainerName = "arangar-digital",
  [string]$EnvFile = ".env.local",
  [int]$HostPort = 3000,
  [switch]$BuildOnly
)

$ErrorActionPreference = "Stop"

function Test-Command($Name) {
  return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

if (-not (Test-Command "docker")) {
  Write-Error "Docker is not installed or not in PATH. Install Docker Desktop first."
  exit 1
}

Write-Host "Building Docker image: $ImageName"
docker build -t $ImageName .
if ($LASTEXITCODE -ne 0) {
  Write-Error "Docker image build failed."
  exit $LASTEXITCODE
}

if ($BuildOnly) {
  Write-Host "Build completed (BuildOnly mode)."
  exit 0
}

$existing = docker ps -a --format "{{.Names}}" | Where-Object { $_ -eq $ContainerName }
if ($existing) {
  Write-Host "Removing existing container: $ContainerName"
  docker rm -f $ContainerName | Out-Null
}

$runArgs = @("run", "-d", "--name", $ContainerName, "-p", "$HostPort`:3000")
if (Test-Path $EnvFile) {
  $runArgs += @("--env-file", $EnvFile)
} else {
  Write-Warning "$EnvFile not found. App will run without custom env variables."
}
$runArgs += $ImageName

Write-Host "Starting container: $ContainerName"
docker @runArgs | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Error "Container start failed."
  exit $LASTEXITCODE
}

Write-Host "Deployment successful."
Write-Host "URL: http://localhost:$HostPort"
