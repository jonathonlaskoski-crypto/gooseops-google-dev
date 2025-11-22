#!/bin/bash
echo "Building GooseOps Neural Empire..."
npm run build

echo "Deploying to Azure Static Web Apps..."
az staticwebapp apps list --query "[].{name:name, resourceGroup:resourceGroup, location:location}" -o table

echo "To deploy manually:"
echo "1. Go to Azure Portal > Static Web Apps"
echo "2. Select your app"
echo "3. Go to 'Deployment details'"
echo "4. Connect to GitHub repository"
echo "5. Set build configuration:"
echo "   - Build preset: React"
echo "   - App location: /"
echo "   - Output location: dist"
echo "   - API location: (leave empty)"

echo "Or use Azure CLI:"
echo "az staticwebapp apps create --name gooseops-neural-empire --location 'Central US' --resource-group gooseops-rg --source https://github.com/YOUR-USERNAME/YOUR-REPO --build-properties '{"appLocation":"/","apiLocation":"","outputLocation":"dist","appBuildCommand":"npm run build"}'"

echo "Deployment preparation complete!"
echo "Build output is ready in ./dist/"
