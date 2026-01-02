#!/bin/bash
# Vercel Environment Variables Setup Script
# This script helps you set up environment variables in Vercel using the Vercel CLI

echo "🚀 Setting up Vercel Environment Variables..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed."
    echo "Install it with: npm i -g vercel"
    exit 1
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel."
    echo "Run: vercel login"
    exit 1
fi

echo "✅ Vercel CLI is ready"
echo ""

# Set environment variables
echo "📝 Adding environment variables..."

# Production/Preview variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production preview <<< "https://hzdralzrkkzdeumpbvdh.supabase.co"
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyNDU2MjgsImV4cCI6MjA4MjgyMTYyOH0.OqIZggdP2jRbcd3ezZfo75PFTDWqnZRus3vKCcm-xp4"
vercel env add SUPABASE_SERVICE_ROLE_KEY production preview <<< "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZHJhbHpya2t6ZGV1bXBidmRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzI0NTYyOCwiZXhwIjoyMDgyODIxNjI4fQ.1oZrlpnj8n7QOxWqJJP4XbMqoWjfKX_NzEqGBbIaNs0"
vercel env add NEXTAUTH_SECRET production preview development <<< "dc1e864f6e79e0542bb4a402351052b4eff00c5c973929bc88e5eada2a1e0d58"
vercel env add NEXTAUTH_URL production preview <<< "https://farm-managerr.vercel.app"
vercel env add NEXTAUTH_URL development <<< "http://localhost:3000"
vercel env add ADMIN_USERNAME production preview development <<< "admin"
vercel env add ADMIN_PASSWORD production preview development <<< "plantation123"

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🔄 Next steps:"
echo "1. Go to Vercel Dashboard and verify the variables"
echo "2. Redeploy your application"
echo "3. Test the deployment"
