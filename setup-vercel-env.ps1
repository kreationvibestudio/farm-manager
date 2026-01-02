# Vercel Environment Variables Setup Script (PowerShell)
# This script helps you set up environment variables in Vercel using the Vercel CLI

Write-Host "🚀 Setting up Vercel Environment Variables..." -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "Install it with: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if logged in
try {
    vercel whoami 2>&1 | Out-Null
    Write-Host "✅ Logged in to Vercel" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in to Vercel." -ForegroundColor Red
    Write-Host "Run: vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📝 Adding environment variables..." -ForegroundColor Cyan
Write-Host ""

# Note: Vercel CLI doesn't support non-interactive env add in PowerShell easily
# This script provides instructions instead

Write-Host "⚠️  Vercel CLI environment variable setup requires interactive input." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please use one of these methods:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Method 1: Use Vercel Dashboard (Recommended)" -ForegroundColor Green
Write-Host "  1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "  2. Select your project: farm-managerr" -ForegroundColor White
Write-Host "  3. Go to Settings → Environment Variables" -ForegroundColor White
Write-Host "  4. Add each variable from VERCEL_ENV_VARIABLES.md" -ForegroundColor White
Write-Host ""
Write-Host "Method 2: Use Vercel CLI manually" -ForegroundColor Green
Write-Host "  Run these commands one by one:" -ForegroundColor White
Write-Host ""
Write-Host "  vercel env add NEXT_PUBLIC_SUPABASE_URL production preview" -ForegroundColor Gray
Write-Host "  (Enter: https://hzdralzrkkzdeumpbvdh.supabase.co)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production preview" -ForegroundColor Gray
Write-Host "  (Enter the anon key from VERCEL_ENV_VARIABLES.md)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  ... and so on for each variable" -ForegroundColor DarkGray
Write-Host ""
Write-Host "See VERCEL_ENV_VARIABLES.md for all variable names and values." -ForegroundColor Cyan
