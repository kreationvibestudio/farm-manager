"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Sun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Eye, 
  Gauge, 
  ArrowLeft,
  CloudRain,
  CloudLightning,
  Snowflake,
  Sunrise,
  Sunset
} from "lucide-react";
import { format } from "date-fns";

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

export default function WeatherPage() {
  const router = useRouter();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchWeatherData();
    // Refresh every 10 minutes
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  const fetchWeatherData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/weather');
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to load weather data');
      console.error('Weather fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeatherIcon = (iconCode: string, size: string = "h-8 w-8") => {
    const iconMap: { [key: string]: React.ReactNode } = {
      '01d': <Sun className={size} />,
      '01n': <Sun className={size} />,
      '02d': <Cloud className={size} />,
      '02n': <Cloud className={size} />,
      '03d': <Cloud className={size} />,
      '03n': <Cloud className={size} />,
      '04d': <Cloud className={size} />,
      '04n': <Cloud className={size} />,
      '09d': <CloudRain className={size} />,
      '09n': <CloudRain className={size} />,
      '10d': <CloudRain className={size} />,
      '10n': <CloudRain className={size} />,
      '11d': <CloudLightning className={size} />,
      '11n': <CloudLightning className={size} />,
      '13d': <Snowflake className={size} />,
      '13n': <Snowflake className={size} />,
      '50d': <Cloud className={size} />,
      '50n': <Cloud className={size} />,
    };
    return iconMap[iconCode] || <Sun className={size} />;
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (isLoading && !weatherData) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading weather data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchWeatherData}>Retry</Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!weatherData) return null;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">Weather Forecast</h1>
              <p className="text-muted-foreground">
                {weatherData.location.name}, {weatherData.location.country}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={fetchWeatherData} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-sky-500 to-blue-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm opacity-80 mb-2">Current Weather</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-6xl font-bold">{weatherData.current.temp}°C</h2>
                  <span className="text-2xl opacity-80">/ {weatherData.current.feelsLike}°C</span>
                </div>
                <p className="text-xl mt-2">{capitalizeFirst(weatherData.current.description)}</p>
              </div>
              <div className="text-white">
                {getWeatherIcon(weatherData.current.icon, "h-20 w-20")}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <Droplets className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-xs opacity-70">Humidity</p>
                  <p className="text-lg font-semibold">{weatherData.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wind className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-xs opacity-70">Wind Speed</p>
                  <p className="text-lg font-semibold">{weatherData.current.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gauge className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-xs opacity-70">Pressure</p>
                  <p className="text-lg font-semibold">{weatherData.current.pressure} hPa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 opacity-80" />
                <div>
                  <p className="text-xs opacity-70">Visibility</p>
                  <p className="text-lg font-semibold">{weatherData.current.visibility} km</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 5-Day Forecast */}
        <div>
          <h2 className="text-2xl font-bold mb-4">5-Day Forecast</h2>
          <div className="grid gap-4 md:grid-cols-5">
            {weatherData.forecast.map((day, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      {index === 0 ? 'Today' : format(new Date(day.date), 'EEE')}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {format(new Date(day.date), 'MMM d')}
                    </p>
                    <div className="flex justify-center mb-3 text-primary">
                      {getWeatherIcon(day.icon, "h-12 w-12")}
                    </div>
                    <p className="text-sm font-medium mb-2">{capitalizeFirst(day.description)}</p>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-xl font-bold">{day.temp.max}°</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-muted-foreground">{day.temp.min}°</span>
                    </div>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Droplets className="h-3 w-3" />
                          Humidity
                        </span>
                        <span>{day.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Wind className="h-3 w-3" />
                          Wind
                        </span>
                        <span>{day.windSpeed} km/h</span>
                      </div>
                      {day.chanceOfRain > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <CloudRain className="h-3 w-3" />
                            Rain
                          </span>
                          <span>{day.chanceOfRain}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5" />
                Temperature Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Temperature</span>
                  <span className="font-semibold">{weatherData.current.temp}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feels Like</span>
                  <span className="font-semibold">{weatherData.current.feelsLike}°C</span>
                </div>
                {weatherData.current.uvIndex !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">UV Index</span>
                    <span className="font-semibold">{weatherData.current.uvIndex}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Atmospheric Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pressure</span>
                  <span className="font-semibold">{weatherData.current.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity</span>
                  <span className="font-semibold">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility</span>
                  <span className="font-semibold">{weatherData.current.visibility} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind Speed</span>
                  <span className="font-semibold">{weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Last Updated */}
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {format(lastUpdated, 'PPpp')}
        </div>
      </main>
    </div>
  );
}
