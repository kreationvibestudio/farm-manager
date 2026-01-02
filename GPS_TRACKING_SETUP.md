# GPS Vehicle Tracking Setup Guide

## 🎯 Overview

The vehicle GPS tracking system allows you to monitor the real-time location of all vehicles in your plantation using Mapbox maps.

## 📋 Setup Steps

### 1. Database Setup

Run the GPS tracking schema in Supabase:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the contents of `supabase-gps-tracking.sql`
3. Click **Run**

This creates:
- `vehicle_locations` table for storing GPS coordinates
- Indexes for fast queries
- Function to get latest locations
- RLS policies

### 2. Environment Variables

Add to `.env.local`:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1Ijoic2Rrb25jZXB0IiwiYSI6ImNtamtvaDNqejIzeHIzZ3F4bXo0bXN3MDgifQ.GAkm6kW5nBlWe8H8RbT0rg
```

**For Vercel**, also add this to your environment variables:
- Name: `NEXT_PUBLIC_MAPBOX_TOKEN`
- Value: `pk.eyJ1Ijoic2Rrb25jZXB0IiwiYSI6ImNtamtvaDNqejIzeHIzZ3F4bXo0bXN3MDgifQ.GAkm6kW5nBlWe8H8RbT0rg`
- Environments: Production, Preview, Development

### 3. Install Dependencies

```bash
npm install
```

This will install:
- `mapbox-gl` - Mapbox GL JS library
- `react-map-gl` - React wrapper for Mapbox
- `@types/mapbox-gl` - TypeScript types

### 4. Access the Tracking Page

Visit: `http://localhost:3000/tracking`

Or in production: `https://your-app.vercel.app/tracking`

## 🧪 Testing GPS Data

### Option 1: Use Test Script

```bash
npm run test-gps
```

This will send sample GPS coordinates to all active vehicles.

### Option 2: Manual API Call

Send a POST request to:

```
POST /api/vehicles/[vehicle-id]/location
```

Example using curl:

```bash
curl -X POST http://localhost:3000/api/vehicles/[vehicle-id]/location \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 6.5244,
    "longitude": 3.3792,
    "speed": 45.5,
    "heading": 180,
    "accuracy": 5.0
  }'
```

### Option 3: Using JavaScript

```javascript
const response = await fetch('/api/vehicles/[vehicle-id]/location', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    latitude: 6.5244,
    longitude: 3.3792,
    speed: 45.5,
    heading: 180,
    accuracy: 5.0
  })
});
```

## 📡 GPS Tracker Integration

### How GPS Trackers Send Data

GPS trackers need to send HTTP POST requests to your API endpoint:

**Endpoint:** `https://your-app.vercel.app/api/vehicles/[vehicle-id]/location`

**Method:** POST

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "latitude": 6.5244,
  "longitude": 3.3792,
  "speed": 45.5,
  "heading": 180,
  "accuracy": 5.0
}
```

### GPS Tracker Configuration

Most GPS trackers support HTTP POST webhooks. Configure them to:

1. **URL:** Your API endpoint (see above)
2. **Method:** POST
3. **Format:** JSON
4. **Frequency:** Every 30 seconds to 5 minutes (depending on your needs)
5. **Fields to send:**
   - `latitude` (required)
   - `longitude` (required)
   - `speed` (optional, in km/h)
   - `heading` (optional, in degrees 0-360)
   - `accuracy` (optional, in meters)

### Popular GPS Tracker Services

1. **Traccar** - Open-source GPS tracking platform
2. **GPSWOX** - Commercial GPS tracking service
3. **GPS Insight** - Fleet management platform
4. **Custom IoT Devices** - ESP32, Raspberry Pi with GPS modules

### Example: Traccar Integration

In Traccar, configure a webhook:
- URL: `https://your-app.vercel.app/api/vehicles/[vehicle-id]/location`
- Method: POST
- Body: 
```json
{
  "latitude": ${latitude},
  "longitude": ${longitude},
  "speed": ${speed},
  "heading": ${course},
  "accuracy": ${accuracy}
}
```

## 🗺️ Map Features

- **Satellite View:** Shows plantation terrain
- **Real-time Updates:** Auto-refreshes every 5 seconds
- **Vehicle Markers:** Shows vehicle position with direction indicator
- **Click to Select:** Click a vehicle on map or in sidebar to focus
- **Vehicle Info:** Shows coordinates, speed, and last seen time
- **Status Indicators:** Color-coded by vehicle status

## 📊 API Endpoints

### Get Latest Locations (All Vehicles)
```
GET /api/vehicles/locations
```

Returns array of latest locations for all vehicles.

### Get Location (Single Vehicle)
```
GET /api/vehicles/[id]/location
```

Returns latest location for a specific vehicle.

### Send GPS Data
```
POST /api/vehicles/[id]/location
```

Body:
```json
{
  "latitude": number,
  "longitude": number,
  "speed": number (optional),
  "heading": number (optional),
  "accuracy": number (optional)
}
```

## 🔧 Customization

### Change Map Center

Edit `src/components/tracking/MapContainer.tsx`:

```typescript
center: [longitude, latitude], // Your plantation coordinates
zoom: 13, // Adjust zoom level
```

### Change Refresh Interval

Edit `src/app/tracking/page.tsx`:

```typescript
setInterval(() => {
  fetchLocations();
}, 5000); // Change 5000 to desired milliseconds
```

### Change Map Style

Edit `src/components/tracking/MapContainer.tsx`:

```typescript
style: 'mapbox://styles/mapbox/satellite-streets-v12', // Change style
```

Available styles:
- `mapbox://styles/mapbox/satellite-streets-v12` - Satellite with streets
- `mapbox://styles/mapbox/streets-v12` - Standard street map
- `mapbox://styles/mapbox/outdoors-v12` - Outdoor/topographic

## 🐛 Troubleshooting

### Map Not Loading
- Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set
- Verify Mapbox token is valid
- Check browser console for errors

### No Vehicles Showing
- Ensure vehicles have GPS data (run test script)
- Check that vehicles exist in database
- Verify API endpoint is working

### GPS Data Not Saving
- Check Supabase RLS policies
- Verify vehicle_id exists in vehicles table
- Check API logs for errors

## 📝 Next Steps

1. ✅ Database schema created
2. ✅ Mapbox integration complete
3. ✅ Tracking page ready
4. ⏳ Configure GPS trackers to send data
5. ⏳ Adjust map center to your plantation location
6. ⏳ Set up monitoring/alerts if needed

## 🔒 Security Notes

- The GPS endpoint is currently open (no authentication)
- For production, consider adding API key authentication
- Rate limiting recommended for GPS endpoints
- Validate GPS coordinates (latitude: -90 to 90, longitude: -180 to 180)
