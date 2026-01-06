"use client";

import { useEffect, useState, useRef } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface OERGaugeProps {
    value?: number;
    onClick?: () => void;
}

export function OERGauge({ value = 19.2, onClick }: OERGaugeProps) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const data = [{ name: 'OER', value, fill: '#16a34a' }];

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
            className={`rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30 ${onClick ? 'cursor-pointer relative' : ''}`}
        >
            {onClick && (
                <div 
                    className="absolute inset-0 z-20 rounded-xl" 
                    onClick={onClick}
                    style={{ cursor: 'pointer' }}
                    aria-label="View harvest management"
                />
            )}
            <div className="relative z-10">
                <h3 className="mb-2 text-lg font-semibold">Oil Extraction Rate</h3>
                <div 
                    ref={containerRef}
                    className="h-48 min-h-[192px] w-full relative"
                    style={{ minHeight: '192px' }}
                >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="90%"
                        barSize={12}
                        data={data}
                        startAngle={180}
                        endAngle={0}
                    >
                        <PolarAngleAxis
                            type="number"
                            domain={[0, 30]}
                            angleAxisId={0}
                            tick={false}
                        />
                        <RadialBar
                            background={{ fill: 'hsl(var(--muted))' }}
                            dataKey="value"
                            cornerRadius={10}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </RadialBarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                )}
                {dimensions.width > 0 && dimensions.height > 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-4xl font-bold text-primary">{value}%</span>
                        <span className="text-xs text-muted-foreground">Target: 22%</span>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}
