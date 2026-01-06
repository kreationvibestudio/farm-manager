# Add Weather API Key

## Your OpenWeatherMap API Key
```
fe10e9f9aa5ef5fa4c37774dd4975e08
```

## Local Development

Add this line to your `.env.local` file:

```env
OPENWEATHER_API_KEY=fe10e9f9aa5ef5fa4c37774dd4975e08
```

**Steps:**
1. Open `.env.local` in your project root
2. Add the line above (or update if it already exists)
3. Save the file
4. Restart your development server (`npm run dev`)

## Vercel Deployment

Add the environment variable in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `farm-manager`
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Enter:
   - **Key:** `OPENWEATHER_API_KEY`
   - **Value:** `fe10e9f9aa5ef5fa4c37774dd4975e08`
   - **Environment:** Select all (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your application for the changes to take effect

## Verify It's Working

1. Navigate to the Weather page (`/weather`)
2. You should see live weather data instead of mock data
3. The data will refresh automatically every 10 minutes

## Note

The API key is now configured. The weather page will fetch real-time weather data from OpenWeatherMap API.
