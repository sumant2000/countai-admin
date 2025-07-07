#!/bin/bash

# CountAI Admin Dashboard - Azure Deployment Script
echo "🚀 CountAI Admin Dashboard - Azure Deployment"
echo "=============================================="

# Check prerequisites
command -v az >/dev/null 2>&1 || { echo ❌ "Azure CLI is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo ❌ "pnpm is required but not installed. Aborting." >&2; exit 1; }

# Login to Azure
echo "🔐 Logging into Azure..."
az login

# Set variables
RESOURCE_GROUP="countai-admin-rg"
LOCATION="eastus"
APP_NAME="countai-admin-$(date +%s)"

echo "📝 Using the following configuration:"
echo "   Resource Group: $RESOURCE_GROUP"
echo "   Location: $LOCATION"
echo "   App Name: $APP_NAME"

# Create resource group
echo "📦 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION

# Choose deployment method
echo ""
echo "🚀 Choose deployment method:"
echo "1) Azure Static Web Apps (Recommended)"
echo "2) Azure App Service"
echo "3) Azure Container Instances"
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo "🌐 Deploying to Azure Static Web Apps..."
    
    # Build for static export
    echo "📦 Building application for static export..."
    pnpm install
    pnpm run build
    
    # Create static web app
    echo "🚀 Creating Azure Static Web App..."
    az staticwebapp create \
      --name $APP_NAME \
      --resource-group $RESOURCE_GROUP \
      --location "eastus2" \
      --source . \
      --branch main \
      --app-location "/" \
      --output-location "out"
    
    echo "✅ Static Web App created successfully!"
    echo "🔗 Your app will be available at: https://$APP_NAME.azurestaticapps.net"
    ;;
    
  2)
    echo "🖥️ Deploying to Azure App Service..."
    
    # Create App Service plan
    echo "📋 Creating App Service plan..."
    az appservice plan create \
      --name "$APP_NAME-plan" \
      --resource-group $RESOURCE_GROUP \
      --sku B1 \
      --is-linux
    
    # Create web app
    echo "🌐 Creating Web App..."
    az webapp create \
      --resource-group $RESOURCE_GROUP \
      --plan "$APP_NAME-plan" \
      --name $APP_NAME \
      --runtime "NODE|18-lts" \
      --deployment-local-git
    
    # Configure app settings
    echo "⚙️ Configuring app settings..."
    az webapp config appsettings set \
      --resource-group $RESOURCE_GROUP \
      --name $APP_NAME \
      --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
                SCM_DO_BUILD_DURING_DEPLOYMENT=true \
                WEBSITE_RUN_FROM_PACKAGE=1
    
    echo "✅ App Service created successfully!"
    echo "🔗 Your app will be available at: https://$APP_NAME.azurewebsites.net"
    echo "📤 To deploy your code, run:"
    echo "   git remote add azure https://\$username@$APP_NAME.scm.azurewebsites.net/$APP_NAME.git"
    echo "   git push azure main"
    ;;
    
  3)
    echo "🐳 Deploying to Azure Container Instances..."
    
    # Create container registry
    echo "🗃️ Creating Container Registry..."
    ACR_NAME="countaiadmin$(date +%s)"
    az acr create \
      --resource-group $RESOURCE_GROUP \
      --name $ACR_NAME \
      --sku Basic
    
    # Build and push Docker image
    echo "🔨 Building Docker image..."
    az acr build \
      --registry $ACR_NAME \
      --image countai-admin:latest \
      .
    
    # Create container instance
    echo "🚀 Creating Container Instance..."
    az container create \
      --resource-group $RESOURCE_GROUP \
      --name $APP_NAME \
      --image $ACR_NAME.azurecr.io/countai-admin:latest \
      --cpu 1 \
      --memory 1.5 \
      --registry-login-server $ACR_NAME.azurecr.io \
      --registry-username $(az acr credential show --name $ACR_NAME --query username --output tsv) \
      --registry-password $(az acr credential show --name $ACR_NAME --query passwords[0].value --output tsv) \
      --dns-name-label $APP_NAME \
      --ports 3000
    
    echo "✅ Container Instance created successfully!"
    echo "🔗 Your app will be available at: http://$APP_NAME.eastus.azurecontainer.io:3000"
    ;;
    
  *)
    echo "❌ Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Visit your deployed application"
echo "2. Configure environment variables in Azure Portal"
echo "3. Set up your Azure database connection"
echo "4. Configure custom domain (optional)"
echo ""
echo "📚 For detailed configuration, see AZURE_DEPLOYMENT.md"
