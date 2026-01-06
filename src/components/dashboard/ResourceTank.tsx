"use client";

import { useEffect, useState } from 'react';
import { Fuel } from 'lucide-react';

interface ResourceTankProps {
    current?: number;
    max?: number;
    unit?: string;
    lowThreshold?: number;
    onClick?: () => void;
}

export function ResourceTank({ current = 1200, max = 3000, unit = 'L', lowThreshold = 0.3, onClick }: ResourceTankProps) {
    const [animatedLevel, setAnimatedLevel] = useState(0);
    const percentage = (current / max) * 100;
    const isLow = percentage / 100 < lowThreshold;

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedLevel(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    return (
        <div 
            className={`rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Diesel Reserve</h3>
                <Fuel className={`h-5 w-5 ${isLow ? 'text-red-500' : 'text-primary'}`} />
            </div>

            <div className="relative h-32 w-full rounded-lg bg-muted overflow-hidden border border-border">
                {/* Liquid */}
                <div
                    className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-out ${isLow ? 'bg-gradient-to-t from-red-500 to-red-400' : 'bg-gradient-to-t from-amber-600 to-amber-400'}`}
                    style={{ height: `${animatedLevel}%` }}
                >
                    {/* Wave effect */}
                    <div className="absolute top-0 left-0 right-0 h-3 animate-pulse opacity-50 bg-white/20 rounded-full" />
                </div>

                {/* Level markers */}
                <div className="absolute inset-0 flex flex-col justify-between p-2 text-xs text-muted-foreground pointer-events-none">
                    <span>Full</span>
                    <span>50%</span>
                    <span>Empty</span>
                </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
                <span className={`text-2xl font-bold ${isLow ? 'text-red-500' : ''}`}>
                    {current.toLocaleString()} {unit}
                </span>
                <span className="text-sm text-muted-foreground">
                    / {max.toLocaleString()} {unit}
                </span>
            </div>

            {isLow && (
                <div className="mt-2 flex items-center gap-1 text-xs text-red-500 font-medium">
                    <span className="inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Low Stock Alert
                </div>
            )}
        </div>
    );
}
