# CountAI Admin Dashboard - Azure Deployment Guide

## 🚀 Azure Deployment Options

Choose the deployment method that best fits your needs:

### Option 1: Azure Static Web Apps (Recommended for Frontend)
Best for: Static hosting with global CDN, automatic SSL, and GitHub integration

### Option 2: Azure App Service
Best for: Full-stack applications with server-side rendering and database connections

### Option 3: Azure Container Instances
Best for: Containerized deployments with Docker

---

## 📋 Prerequisites

1. **Azure Account**: Ensure you have an active Azure subscription
2. **Azure CLI**: Install the Azure CLI on your machine
3. **Node.js**: Version 18+ installed locally
4. **Git**: For version control and deployment

### Install Azure CLI (if not installed)
```bash
# macOS
brew install azure-cli

# Verify installation
az --version
```

---

## 🌐 Option 1: Azure Static Web Apps Deployment

### Step 1: Prepare for Static Export
```bash
# Install dependencies
pnpm install

# Build for static export
pnpm build
pnpm export
```

### Step 2: Login to Azure
```bash
az login
```

### Step 3: Create Azure Static Web App
```bash
# Create resource group
az group create --name countai-admin-rg --location "East US"

# Create static web app
az staticwebapp create \
  --name countai-admin \
  --resource-group countai-admin-rg \
  --source https://github.com/YOUR_USERNAME/countai-admin \
  --location "East US2" \
  --branch main \
  --app-location "/" \
  --output-location "out"
```

### Step 4: Configure GitHub Integration
1. Fork or push your code to a GitHub repository
2. Connect your GitHub repo to Azure Static Web Apps
3. The deployment will trigger automatically on push to main branch

### Step 5: Configure Environment Variables
```bash
# Set environment variables in Azure Static Web Apps
az staticwebapp appsettings set \
  --name countai-admin \
  --setting-names API_BASE_URL=https://your-api.azurewebsites.net
```

---

## 🖥️ Option 2: Azure App Service Deployment

### Step 1: Create App Service Plan
```bash
# Create resource group
az group create --name countai-admin-rg --location "East US"

# Create App Service plan
az appservice plan create \
  --name countai-admin-plan \
  --resource-group countai-admin-rg \
  --sku B1 \
  --is-linux
```

### Step 2: Create Web App
```bash
# Create web app
az webapp create \
  --resource-group countai-admin-rg \
  --plan countai-admin-plan \
  --name countai-admin-app \
  --runtime "NODE|18-lts" \
  --deployment-local-git
```

### Step 3: Configure App Settings
```bash
# Configure Node.js settings
az webapp config appsettings set \
  --resource-group countai-admin-rg \
  --name countai-admin-app \
  --settings WEBSITE_NODE_DEFAULT_VERSION="18.17.0" \
              SCM_DO_BUILD_DURING_DEPLOYMENT=true \
              API_BASE_URL="https://your-api-endpoint.com"
```

### Step 4: Deploy via Git
```bash
# Add Azure remote
git remote add azure https://YOUR_USERNAME@countai-admin-app.scm.azurewebsites.net/countai-admin-app.git

# Deploy to Azure
git push azure main
```

---

## 🐳 Option 3: Docker Container Deployment

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
```

### Step 2: Build and Push to Azure Container Registry
```bash
# Create container registry
az acr create \
  --resource-group countai-admin-rg \
  --name countaiadmin \
  --sku Basic

# Login to registry
az acr login --name countaiadmin

# Build and push image
docker build -t countaiadmin.azurecr.io/countai-admin:latest .
docker push countaiadmin.azurecr.io/countai-admin:latest
```

### Step 3: Deploy to Container Instances
```bash
# Create container instance
az container create \
  --resource-group countai-admin-rg \
  --name countai-admin-container \
  --image countaiadmin.azurecr.io/countai-admin:latest \
  --cpu 1 \
  --memory 1.5 \
  --registry-login-server countaiadmin.azurecr.io \
  --registry-username $(az acr credential show --name countaiadmin --query username --output tsv) \
  --registry-password $(az acr credential show --name countaiadmin --query passwords[0].value --output tsv) \
  --dns-name-label countai-admin \
  --ports 3000
```

---

## 🔧 Environment Configuration

### Create Production Environment File
```bash
# Create .env.production
cp .env.example .env.production
```

### Configure Azure Database Connection
Update your environment variables:
```env
AZURE_SQL_CONNECTION_STRING=Server=tcp:your-server.database.windows.net,1433;Initial Catalog=countai;Persist Security Info=False;User ID=your-username;Password=your-password;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
API_BASE_URL=https://your-api.azurewebsites.net
NEXT_PUBLIC_APP_ENV=production
```

---

## 🗄️ Database Setup

### Option A: Azure SQL Database
```bash
# Create Azure SQL server
az sql server create \
  --name countai-sql-server \
  --resource-group countai-admin-rg \
  --location "East US" \
  --admin-user sqladmin \
  --admin-password YourPassword123!

# Create database
az sql db create \
  --resource-group countai-admin-rg \
  --server countai-sql-server \
  --name countai \
  --service-objective Basic
```

### Option B: Azure Cosmos DB
```bash
# Create Cosmos DB account
az cosmosdb create \
  --name countai-cosmos \
  --resource-group countai-admin-rg \
  --kind GlobalDocumentDB
```

---

## 🔍 Monitoring and Logging

### Enable Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app countai-admin-insights \
  --location "East US" \
  --resource-group countai-admin-rg \
  --application-type web
```

---

## 🚀 Quick Deploy Script

Run this script for automated deployment:

```bash
#!/bin/bash

# Quick deployment script
echo "🚀 Starting CountAI Admin Dashboard deployment..."

# Build the application
echo "📦 Building application..."
pnpm install
pnpm build

# Choose deployment method
echo "Choose deployment method:"
echo "1) Azure Static Web Apps"
echo "2) Azure App Service"
read -p "Enter choice (1-2): " choice

case $choice in
  1)
    echo "🌐 Deploying to Azure Static Web Apps..."
    # Deploy to Static Web Apps
    ;;
  2)
    echo "🖥️ Deploying to Azure App Service..."
    # Deploy to App Service
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo "✅ Deployment complete!"
echo "🔗 Your app will be available at: https://countai-admin.azurestaticapps.net"
```

---

## 📋 Post-Deployment Checklist

- [ ] Verify the application loads correctly
- [ ] Test worker authentication functionality
- [ ] Confirm dashboard displays mock data
- [ ] Test photo gallery filtering
- [ ] Verify CSV export works
- [ ] Check environment variables are set
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Configure Azure SQL database connection
- [ ] Test production API endpoints

---

## 🔗 Useful Azure Resources

- **Azure Portal**: https://portal.azure.com
- **Azure CLI Documentation**: https://docs.microsoft.com/en-us/cli/azure/
- **Static Web Apps Documentation**: https://docs.microsoft.com/en-us/azure/static-web-apps/
- **App Service Documentation**: https://docs.microsoft.com/en-us/azure/app-service/

## 🆘 Troubleshooting

### Common Issues:
1. **Build failures**: Check Node.js version compatibility
2. **Environment variables**: Ensure all required variables are set
3. **Database connection**: Verify connection strings and firewall rules
4. **Static export issues**: Check next.config.js configuration

Your CountAI Admin Dashboard is now ready for Azure deployment! 🎉
