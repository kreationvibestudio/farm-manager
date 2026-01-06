# Weather Forecast Setup Guide

## Overview
The weather page provides live weather forecasts and current conditions for your plantation location. It uses the OpenWeatherMap API to fetch real-time weather data.

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account (or log in if you already have one)
3. Navigate to the API Keys section in your account dashboard
4. Generate a new API key (or use an existing one)
5. The free tier includes:
   - Current weather data
   - 5-day/3-hour forecast
   - Up to 60 calls per minute
   - 1,000,000 calls per month

### 2. Add API Key to Environment Variables

#### For Local Development:
Add to your `.env.local` file:
```env
OPENWEATHER_API_KEY=your_api_key_here
```

#### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add a new variable:
   - **Name:** `OPENWEATHER_API_KEY`
   - **Value:** Your OpenWeatherMap API key
   - **Environment:** Production, Preview, and Development
4. Redeploy your application

### 3. Default Location

The weather page uses a default location (Lagos, Nigeria - 6.5244°N, 3.3792°E). 

To change the location, you can:
- Modify the default coordinates in `/src/app/api/weather/route.ts`
- Pass `lat` and `lon` query parameters to the API: `/api/weather?lat=YOUR_LAT&lon=YOUR_LON`

### 4. Features

The weather page includes:
- **Current Weather:**
  - Temperature and "feels like" temperature
  - Weather description and icon
  - Humidity, wind speed, pressure, and visibility
  
- **5-Day Forecast:**
  - Daily high/low temperatures
  - Weather conditions
  - Humidity and wind speed
  - Chance of rain

- **Auto-refresh:**
  - Data refreshes every 10 minutes automatically
  - Manual refresh button available
  - Cached for 10 minutes to reduce API calls

### 5. Fallback Behavior

If the API key is not configured, the system will:
- Display mock/sample weather data
- Allow you to test the UI without an API key
- Show a functional weather page for development

### 6. Accessing the Weather Page

You can access the weather page by:
- Clicking on the Weather Widget card on the dashboard
- Navigating to `/weather` in the URL
- Using the "Weather Forecast" link in the sidebar

## Troubleshooting

### Weather data not loading?
1. Check that `OPENWEATHER_API_KEY` is set in your environment variables
2. Verify the API key is valid and active
3. Check browser console for error messages
4. Ensure you haven't exceeded API rate limits

### Wrong location?
- Update the default coordinates in the API route
- Or pass location parameters when calling the API

### API errors?
- Check your OpenWeatherMap account for API usage limits
- Verify your API key hasn't been revoked
- Check network connectivity

## Cost

The OpenWeatherMap free tier is sufficient for most use cases:
- Free: 1,000,000 calls/month
- Paid plans available if you need more

For a farm management system, the free tier should be more than adequate.
