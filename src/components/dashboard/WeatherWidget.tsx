"use client";

import { Cloud, Sun, Droplets, Wind, Thermometer } from 'lucide-react';

export function WeatherWidget() {
    return (
        <div className="rounded-xl border border-border bg-gradient-to-br from-sky-500 to-blue-600 p-6 shadow-sm text-white">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-medium opacity-80">Plantation Weather</h3>
                    <p className="text-3xl font-bold mt-1">28°C</p>
                    <p className="text-sm opacity-80 mt-1">Partly Cloudy</p>
                </div>
                <div className="relative">
                    <Sun className="h-12 w-12 text-yellow-300 animate-pulse" />
                    <Cloud className="h-8 w-8 absolute -bottom-1 -left-2 text-white/80" />
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
                <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 opacity-80" />
                    <div>
                        <p className="text-xs opacity-70">Humidity</p>
                        <p className="text-sm font-semibold">72%</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 opacity-80" />
                    <div>
                        <p className="text-xs opacity-70">Wind</p>
                        <p className="text-sm font-semibold">12 km/h</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 opacity-80" />
                    <div>
                        <p className="text-xs opacity-70">Feels Like</p>
                        <p className="text-sm font-semibold">31°C</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
