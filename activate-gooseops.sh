#!/bin/bash

# 🚀 GooseOps Neural Empire Activation Script
# Activates all systems and validates configuration

echo "🦆 Starting GooseOps Neural Empire Activation..."

# Create .env file from template if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.template .env
    echo "✅ .env file created. Please add your API keys!"
else
    echo "✅ .env file exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check configuration health
echo "🔍 Validating configuration..."
npm run config:check

# Start development server
echo "🚀 Starting GooseOps development server..."
echo "📍 Access your platform at: http://localhost:5173"
echo "🤖 ARES will be available in the ARES tab for business accounts"
echo "⚡ All AI agents are ready for deployment!"

npm run dev