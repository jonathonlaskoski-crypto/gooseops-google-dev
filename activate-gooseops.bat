@echo off
REM 🚀 GooseOps Neural Empire Activation Script (Windows)
REM Activates all systems and validates configuration

echo 🦆 Starting GooseOps Neural Empire Activation...

REM Create .env file from template if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.template .env
    echo ✅ .env file created. Please add your API keys!
) else (
    echo ✅ .env file exists
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Check configuration health
echo 🔍 Validating configuration...
npm run config:check

REM Start development server
echo 🚀 Starting GooseOps development server...
echo 📍 Access your platform at: http://localhost:5173
echo 🤖 ARES will be available in the ARES tab for business accounts
echo ⚡ All AI agents are ready for deployment!

npm run dev