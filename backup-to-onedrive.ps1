# GooseOps Neural Empire - OneDrive Backup Script
# This PowerShell script creates a backup of the current codebase to OneDrive
# Usage: .\backup-to-onedrive.ps1 [backup-folder-name]

param (
    [string]$BackupFolderName = "GooseOps-Neural-Empire-Backup"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupName = "$BackupFolderName-$timestamp"
$oneDrivePath = [System.IO.Path]::Combine($env:USERPROFILE, "OneDrive")

Write-Host "===== GooseOps Neural Empire - OneDrive Backup =====" -ForegroundColor Cyan
Write-Host "Backup Name: $backupName" -ForegroundColor Cyan
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

# Create backup folder in OneDrive
$backupPath = [System.IO.Path]::Combine($oneDrivePath, $backupName)
Write-Host "Creating backup folder: $backupPath" -ForegroundColor Yellow

if (Test-Path $backupPath) {
    Write-Host "Backup folder already exists. Creating a new one with timestamp." -ForegroundColor Yellow
    $backupName = "$BackupFolderName-$timestamp-$(Get-Random -Maximum 1000)"
    $backupPath = [System.IO.Path]::Combine($oneDrivePath, $backupName)
}

New-Item -ItemType Directory -Path $backupPath | Out-Null

# Create a list of directories/files to exclude from backup
$excludeList = @(
    "node_modules",
    ".git",
    "dist",
    "build",
    ".DS_Store",
    "Thumbs.db"
)

# Copy files to backup folder
Write-Host "Copying files to backup folder..." -ForegroundColor Yellow
$currentPath = Get-Location

$copyParams = @{
    Path = "$currentPath\*"
    Destination = $backupPath
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
        $targetPath = $_.FullName.Replace($currentPath.Path, $backupPath)
        
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

# Create a backup info file
$infoContent = @"
GooseOps Neural Empire Backup
============================
Date: $(Get-Date)
Source: $currentPath
Backup Location: $backupPath
Excluded: $($excludeList -join ', ')
============================
"@

$infoContent | Out-File -FilePath "$backupPath\backup-info.txt"

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "Backup completed successfully!" -ForegroundColor Green
Write-Host "Backup location: $backupPath" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
