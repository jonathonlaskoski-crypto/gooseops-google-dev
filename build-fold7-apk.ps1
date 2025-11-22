# ========================================
# FOLD 7 APK - ONE-CLICK BUILD & INSTALL
# ========================================
# Run this script when you're safely stopped
# It will build the APK and install it on your Fold 7

Write-Host "🚀 Building Gem Personal AI for Samsung Fold 7..." -ForegroundColor Cyan

# Step 1: Build web assets
Write-Host "`n📦 Step 1/3: Building web assets..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Sync to Android
Write-Host "`n🔄 Step 2/3: Syncing to Android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Sync failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Find Android Studio's Java and build APK
Write-Host "`n🔨 Step 3/3: Building APK..." -ForegroundColor Yellow

# Find Android Studio's JDK
$knownJdkPath = "C:\Program Files\Android\Android Studio1\jbr"
if (Test-Path $knownJdkPath) {
    $javaHome = $knownJdkPath
    Write-Host "✅ Found Java at: $javaHome" -ForegroundColor Green
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;$env:PATH"
}
else {
    # Fallback to search if hardcoded path fails
    $androidStudioPath = "C:\Program Files\Android\Android Studio"
    $jdkPath = Get-ChildItem -Path $androidStudioPath -Recurse -Filter "java.exe" -ErrorAction SilentlyContinue | Select-Object -First 1

    if ($jdkPath) {
        $javaHome = $jdkPath.Directory.Parent.FullName
        Write-Host "✅ Found Java at: $javaHome" -ForegroundColor Green
        $env:JAVA_HOME = $javaHome
        $env:PATH = "$javaHome\bin;$env:PATH"
    }
    else {
        Write-Host "⚠️ Java not found in Android Studio. Opening Android Studio instead..." -ForegroundColor Yellow
        npx cap open android
        Write-Host "`n📱 In Android Studio:" -ForegroundColor Cyan
        Write-Host "   1. Wait for Gradle sync to complete" -ForegroundColor White
        Write-Host "   2. Click Build → Build APK" -ForegroundColor White
        Write-Host "   3. APK will be at: android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
        exit 0
    }
}

# Build APK
cd android
.\gradlew assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ APK BUILD SUCCESSFUL!" -ForegroundColor Green
    
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
    if (Test-Path $apkPath) {
        $fullPath = (Resolve-Path $apkPath).Path
        Write-Host "`n📱 APK Location:" -ForegroundColor Cyan
        Write-Host "   $fullPath" -ForegroundColor White
        
        # Try to install if phone is connected
        Write-Host "`n🔌 Checking for connected Fold 7..." -ForegroundColor Yellow
        
        # Find ADB in Android SDK
        $adbPath = Get-ChildItem -Path "$env:LOCALAPPDATA\Android\Sdk" -Recurse -Filter "adb.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        
        if ($adbPath) {
            $devices = & $adbPath.FullName devices
            if ($devices -match "device$") {
                Write-Host "✅ Fold 7 detected! Installing APK..." -ForegroundColor Green
                & $adbPath.FullName install -r $fullPath
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "`n🎉 APK INSTALLED ON FOLD 7!" -ForegroundColor Green
                    Write-Host "`n📱 Your Gem Personal AI app is ready with:" -ForegroundColor Cyan
                    Write-Host "   ✅ Claude Pro" -ForegroundColor White
                    Write-Host "   ✅ Gemini 3.0 Pro" -ForegroundColor White
                    Write-Host "   ✅ Azure OpenAI (GPT-4)" -ForegroundColor White
                    Write-Host "   ✅ Microsoft Copilot (Free)" -ForegroundColor White
                    Write-Host "   ✅ Local AI (RTX 4090 Remote)" -ForegroundColor White
                }
                else {
                    Write-Host "⚠️ Install failed. Copy APK to phone manually:" -ForegroundColor Yellow
                    Write-Host "   $fullPath" -ForegroundColor White
                }
            }
            else {
                Write-Host "⚠️ Fold 7 not detected via USB" -ForegroundColor Yellow
                Write-Host "`n📱 To install manually:" -ForegroundColor Cyan
                Write-Host "   1. Copy this file to your Fold 7:" -ForegroundColor White
                Write-Host "      $fullPath" -ForegroundColor White
                Write-Host "   2. Open file manager on Fold 7" -ForegroundColor White
                Write-Host "   3. Tap the APK file to install" -ForegroundColor White
            }
        }
        else {
            Write-Host "⚠️ ADB not found" -ForegroundColor Yellow
            Write-Host "`n📱 Copy APK to Fold 7:" -ForegroundColor Cyan
            Write-Host "   $fullPath" -ForegroundColor White
        }
    }
}
else {
    Write-Host "`n❌ APK build failed!" -ForegroundColor Red
    Write-Host "Opening Android Studio for manual build..." -ForegroundColor Yellow
    cd ..
    npx cap open android
}

cd ..
Write-Host "`n✅ Done!" -ForegroundColor Green
