"use client";

import { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppStore } from '@/lib/store';

interface FleetStatusProps {
    onClick?: () => void;
}

export function FleetStatus({ onClick }: FleetStatusProps) {
    const { vehicles } = useAppStore();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate vehicle stats from real data
    const vehicleStats = [
        { name: 'Active', value: vehicles.filter(v => v.status === 'Active').length, color: '#16a34a' },
        { name: 'Maintenance', value: vehicles.filter(v => v.status === 'Maintenance').length, color: '#ca8a04' },
        { name: 'OutOfService', value: vehicles.filter(v => v.status === 'OutOfService').length, color: '#dc2626' },
    ].filter(stat => stat.value > 0); // Only show statuses with vehicles

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
            <div className="relative z-10">
                <h3 className="mb-4 text-lg font-semibold">Fleet Status</h3>
                <div 
                    ref={containerRef}
                    className="h-48 min-h-[192px] w-full"
                    style={{ minHeight: '192px', width: '100%' }}
                >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width={dimensions.width} height={dimensions.height}>
                    <PieChart>
                        <Pie
                            data={vehicleStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            animationDuration={1200}
                            animationEasing="ease-out"
                        >
                            {vehicleStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                            formatter={(value, name) => [`${value} vehicles`, name]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading chart...</div>
                    </div>
                )}
                </div>
            </div>
            {onClick && (
                <div 
                    className="absolute inset-0 z-20 rounded-xl" 
                    onClick={onClick}
                    style={{ cursor: 'pointer' }}
                    aria-label="View fleet management"
                />
            )}
        </div>
    );
}
