import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/api-auth';

// OpenWeatherMap API configuration
// You'll need to set OPENWEATHER_API_KEY in your environment variables
// Get a free API key from: https://openweathermap.org/api

interface WeatherData {
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    description: string;
    icon: string;
    pressure: number;
    visibility: number;
    uvIndex?: number;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    chanceOfRain: number;
  }>;
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) {
      return authResult; // Unauthorized response
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // Return mock data if API key is not configured
      return NextResponse.json({
        current: {
          temp: 28,
          feelsLike: 31,
          humidity: 72,
          windSpeed: 12,
          description: 'Partly Cloudy',
          icon: '02d',
          pressure: 1013,
          visibility: 10,
          uvIndex: 6,
        },
        forecast: [
          {
            date: new Date(Date.now() + 86400000).toISOString(),
            temp: { min: 24, max: 30 },
            description: 'Partly Cloudy',
            icon: '02d',
            humidity: 68,
            windSpeed: 10,
            chanceOfRain: 20,
          },
          {
            date: new Date(Date.now() + 172800000).toISOString(),
            temp: { min: 25, max: 32 },
            description: 'Sunny',
            icon: '01d',
            humidity: 65,
            windSpeed: 8,
            chanceOfRain: 10,
          },
          {
            date: new Date(Date.now() + 259200000).toISOString(),
            temp: { min: 23, max: 29 },
            description: 'Light Rain',
            icon: '10d',
            humidity: 75,
            windSpeed: 15,
            chanceOfRain: 60,
          },
          {
            date: new Date(Date.now() + 345600000).toISOString(),
            temp: { min: 24, max: 31 },
            description: 'Cloudy',
            icon: '03d',
            humidity: 70,
            windSpeed: 12,
            chanceOfRain: 30,
          },
          {
            date: new Date(Date.now() + 432000000).toISOString(),
            temp: { min: 25, max: 33 },
            description: 'Sunny',
            icon: '01d',
            humidity: 62,
            windSpeed: 9,
            chanceOfRain: 15,
          },
        ],
        location: {
          name: 'Plantation Location',
          country: 'NG',
          lat: 6.5244,
          lon: 3.3792,
        },
      } as WeatherData);
    }

    // Get location from query params or use default (Lagos, Nigeria)
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat') || '6.5244';
    const lon = searchParams.get('lon') || '3.3792';

    // Fetch current weather
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current weather');
    }
    
    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast');
    }
    
    const forecastData = await forecastResponse.json();

    // Process current weather
    const current: WeatherData['current'] = {
      temp: Math.round(currentData.main.temp),
      feelsLike: Math.round(currentData.main.feels_like),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      pressure: currentData.main.pressure,
      visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10, // Convert to km
    };

    // Process forecast (group by day and get daily min/max)
    const dailyForecast: { [key: string]: any } = {};
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      
      if (!dailyForecast[dateKey]) {
        dailyForecast[dateKey] = {
          date: date.toISOString(),
          temps: [],
          descriptions: [],
          icons: [],
          humidities: [],
          windSpeeds: [],
          chancesOfRain: [],
        };
      }
      
      dailyForecast[dateKey].temps.push(item.main.temp);
      dailyForecast[dateKey].descriptions.push(item.weather[0].description);
      dailyForecast[dateKey].icons.push(item.weather[0].icon);
      dailyForecast[dateKey].humidities.push(item.main.humidity);
      dailyForecast[dateKey].windSpeeds.push(item.wind.speed * 3.6);
      if (item.rain && item.rain['3h']) {
        dailyForecast[dateKey].chancesOfRain.push(Math.min(100, item.rain['3h'] * 10));
      } else {
        dailyForecast[dateKey].chancesOfRain.push(0);
      }
    });

    const forecast: WeatherData['forecast'] = Object.values(dailyForecast)
      .slice(0, 5)
      .map((day: any) => ({
        date: day.date,
        temp: {
          min: Math.round(Math.min(...day.temps)),
          max: Math.round(Math.max(...day.temps)),
        },
        description: day.descriptions[Math.floor(day.descriptions.length / 2)],
        icon: day.icons[Math.floor(day.icons.length / 2)],
        humidity: Math.round(day.humidities.reduce((a: number, b: number) => a + b, 0) / day.humidities.length),
        windSpeed: Math.round(day.windSpeeds.reduce((a: number, b: number) => a + b, 0) / day.windSpeeds.length),
        chanceOfRain: Math.round(Math.max(...day.chancesOfRain)),
      }));

    const weatherData: WeatherData = {
      current,
      forecast,
      location: {
        name: currentData.name,
        country: currentData.sys.country,
        lat: currentData.coord.lat,
        lon: currentData.coord.lon,
      },
    };

    // Cache for 10 minutes
    return NextResponse.json(weatherData, {
      headers: {
        'Cache-Control': 'private, max-age=600, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}
