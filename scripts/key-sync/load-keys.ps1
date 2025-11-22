<#
  GooseOps Key Loader (Non-Destructive)
  Usage:
    pwsh scripts/key-sync/load-keys.ps1          # Dry run
    pwsh scripts/key-sync/load-keys.ps1 -Apply  # Write missing vars
#>
param(
  [switch]$Apply,
  [string]$TemplatePath = "api-keys/SECURE_TEMPLATE.env",
  [string]$KeysDir = "api-keys",
  [string]$EnvPath = ".env"
)
function Parse-KeyFiles($dir){
  $kv=@{}; if(!(Test-Path $dir)){return $kv}
  Get-ChildItem -Path $dir -File -Include *.key,*.txt,*.env | ForEach-Object {
    foreach($line in Get-Content $_.FullName){ if($line -match '^[A-Z0-9_]+='){ $name=$line.Split('=')[0]; $kv[$name]=$line.Substring($name.Length+1) } }
  }; return $kv
}
if(!(Test-Path $TemplatePath)){ Write-Host "Template not found: $TemplatePath"; exit 1 }
$template = Get-Content $TemplatePath
$wanted = $template | Where-Object { $_ -match '^[A-Z0-9_]+=' } | ForEach-Object { $_.Split('=')[0] }
$keyData = Parse-KeyFiles $KeysDir
$existing=@{}; if(Test-Path $EnvPath){ foreach($l in Get-Content $EnvPath){ if($l -match '^[A-Z0-9_]+='){ $n=$l.Split('=')[0]; $existing[$n]=$true } } }
$appendLines=@(); foreach($name in $wanted){ if(-not $existing[$name]){ if($keyData.ContainsKey($name)){ $appendLines+="$name=$($keyData[$name])" } } }
Write-Host "[KeyLoader] Vars in template:" $wanted.Count
Write-Host "[KeyLoader] Vars found in key files:" $($keyData.Keys.Count)
Write-Host "[KeyLoader] Missing & available to append:" $appendLines.Count
if($appendLines.Count -eq 0){ Write-Host "[KeyLoader] Nothing to append."; exit 0 }
if($Apply){ if(!(Test-Path $EnvPath)){ New-Item -ItemType File -Path $EnvPath | Out-Null }
  Add-Content -Path $EnvPath -Value ("# Added by key loader $(Get-Date -Format o)"); $appendLines | ForEach-Object { Add-Content -Path $EnvPath -Value $_ }
  Write-Host "[KeyLoader] Appended $($appendLines.Count) vars to $EnvPath"
}else{ Write-Host "[KeyLoader] Dry run. Use -Apply to write:"; $appendLines | ForEach-Object { Write-Host "  $_" } }
