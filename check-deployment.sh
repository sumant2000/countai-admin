#!/bin/bash

# CountAI Admin - Deployment Status Checker
echo "🔍 Checking CountAI Admin Deployment Status..."
echo "=============================================="

# Check Azure Static Web App status
echo "📊 Azure Static Web App Status:"
az staticwebapp environment list --name countai-admin --resource-group countai-admin-rg --output table

echo ""
echo "🌐 Application URL: https://victorious-smoke-04148400f.2.azurestaticapps.net"
echo ""
echo "📋 To check GitHub Actions build status:"
echo "   Visit: https://github.com/sumant2000/countai-admin/actions"
echo ""
echo "⏱️  Deployment typically takes 3-5 minutes"
echo ""

# Check if deployment is complete
status=$(az staticwebapp environment list --name countai-admin --resource-group countai-admin-rg --query "[0].status" --output tsv)

if [ "$status" = "Ready" ]; then
    echo "✅ Deployment Complete! Your app is live."
    echo "🚀 Visit: https://victorious-smoke-04148400f.2.azurestaticapps.net"
elif [ "$status" = "WaitingForDeployment" ]; then
    echo "🔄 Deployment in progress... Please wait a few minutes."
elif [ "$status" = "Failed" ]; then
    echo "❌ Deployment failed. Check GitHub Actions for details."
else
    echo "📊 Current status: $status"
fi
