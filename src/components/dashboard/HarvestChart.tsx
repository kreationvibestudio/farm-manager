"use client";

import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { harvestStats } from '@/lib/data';

interface HarvestChartProps {
    onClick?: () => void;
}

export function HarvestChart({ onClick }: HarvestChartProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                if (width > 0 && height > 0) {
                    setDimensions({ width, height });
                }
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        
        // Small delay to ensure container is rendered
        const timer = setTimeout(updateDimensions, 100);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div 
            className={`rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        >
            <h3 className="mb-4 text-lg font-semibold">Weekly Harvest Trend</h3>
            <div 
                ref={containerRef}
                className="h-64 min-h-[256px] w-full"
                style={{ minHeight: '256px' }}
            >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={harvestStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorFfb" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="name" className="text-xs" tick={{ fill: 'currentColor' }} />
                        <YAxis className="text-xs" tick={{ fill: 'currentColor' }} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                            labelStyle={{ color: 'hsl(var(--foreground))' }}
                            itemStyle={{ color: '#16a34a' }}
                            formatter={(value) => [`${Number(value).toLocaleString()} bunches`, 'FFB Harvested']}
                        />
                        <Area
                            type="monotone"
                            dataKey="ffb"
                            stroke="#16a34a"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorFfb)"
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
