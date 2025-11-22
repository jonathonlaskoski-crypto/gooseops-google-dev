# GooseOps Neural Empire - Digital Preservation System
# This PowerShell script creates an enhanced preservation archive of the current codebase to OneDrive
# Usage: .\gooseops-neural-empire-preservation.ps1 [archive-name]

param (
    [string]$ArchiveName = "GooseOps-Neural-Empire-Enhanced-Archive"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$preservationName = "$ArchiveName-$timestamp"
$oneDrivePath = [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive")

Write-Host "===== GooseOps Neural Empire - Digital Preservation System =====" -ForegroundColor Cyan
Write-Host "Archive Name: $preservationName" -ForegroundColor Cyan
Write-Host "OneDrive Path: $oneDrivePath" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Check if OneDrive folder exists
if (-not (Test-Path $oneDrivePath)) {
    Write-Host "Error: OneDrive folder not found at $oneDrivePath" -ForegroundColor Red
    
    # Try to find OneDrive in common alternative locations
    $alternativePaths = @(
        [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive - Business"),
        [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive - Personal"),
        [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive - Microsoft")
    )
    
    foreach ($path in $alternativePaths) {
        if (Test-Path $path) {
            $oneDrivePath = $path
            Write-Host "Found OneDrive at alternative location: $oneDrivePath" -ForegroundColor Green
            break
        }
    }
    
    if (-not (Test-Path $oneDrivePath)) {
        Write-Host "Could not find OneDrive folder. Please specify the correct path manually." -ForegroundColor Red
        exit 1
    }
}

# Create preservation folder in OneDrive
$preservationPath = [System.IO.Path]::Combine($oneDrivePath, $preservationName)
Write-Host "Creating preservation archive: $preservationPath" -ForegroundColor Yellow

if (Test-Path $preservationPath) {
    Write-Host "Archive folder already exists. Creating a new one with timestamp." -ForegroundColor Yellow
    $preservationName = "$ArchiveName-$timestamp-$(Get-Random -Maximum 1000)"
    $preservationPath = [System.IO.Path]::Combine($oneDrivePath, $preservationName)
}

New-Item -ItemType Directory -Path $preservationPath | Out-Null

# Create a list of directories/files to exclude from preservation
$excludeList = @(
    "node_modules",
    ".git",
    "dist",
    "build",
    ".DS_Store",
    "Thumbs.db"
)

# Copy files to preservation folder
Write-Host "Preserving codebase to archive folder..." -ForegroundColor Yellow
$currentPath = Get-Location

$copyParams = @{
    Path = "$currentPath\*"
    Destination = $preservationPath
    Recurse = $true
    Force = $true
}

# Add exclude filter
$excludeFilter = { 
    $item = $_.Name
    foreach ($exclude in $excludeList) {
        if ($item -eq $exclude) { return $false }
    }
    return $true
}

# Copy files with exclusions
Get-ChildItem -Path $currentPath -Recurse | 
    Where-Object $excludeFilter |
    ForEach-Object {
        $targetPath = $_.FullName.Replace($currentPath.Path, $preservationPath)
        
        if ($_.PSIsContainer) {
            if (-not (Test-Path $targetPath)) {
                New-Item -ItemType Directory -Path $targetPath | Out-Null
            }
        } else {
            $targetDir = [System.IO.Path]::GetDirectoryName($targetPath)
            if (-not (Test-Path $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            Copy-Item -Path $_.FullName -Destination $targetPath -Force
        }
    }

# Create a preservation manifest file
$manifestContent = @"
GooseOps Neural Empire - Digital Preservation System
============================
Creation Date: $(Get-Date)
Source: $currentPath
Archive Location: $preservationPath
Excluded Elements: $($excludeList -join ', ')
============================
"@

$manifestContent | Out-File -FilePath "$preservationPath\preservation-manifest.txt"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Digital preservation completed successfully!" -ForegroundColor Green
Write-Host "Archive location: $preservationPath" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
