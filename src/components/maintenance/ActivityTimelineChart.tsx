"use client";

import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { MaintenanceLog } from '@/types';

interface ActivityTimelineChartProps {
    logs: MaintenanceLog[];
}

export function ActivityTimelineChart({ logs }: ActivityTimelineChartProps) {
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
        const timer = setTimeout(updateDimensions, 100);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            clearTimeout(timer);
        };
    }, []);

    // Group logs by date and activity type for the last 30 days
    const getLast30Days = () => {
        const days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const last30Days = getLast30Days();
    const chartData = last30Days.map(date => {
        const dayLogs = logs.filter(log => log.date === date);
        return {
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: date,
            'Pruning': dayLogs.filter(l => l.activity === 'Pruning').length,
            'Fertilizer Application': dayLogs.filter(l => l.activity === 'Fertilizer Application').length,
            'Herbicide Application': dayLogs.filter(l => l.activity === 'Herbicide Application').length,
            'Slashing': dayLogs.filter(l => l.activity === 'Slashing').length,
            'Ring Weeding': dayLogs.filter(l => l.activity === 'Ring Weeding').length,
        };
    });

    const colors = {
        'Pruning': '#3b82f6',
        'Fertilizer Application': '#a855f7',
        'Herbicide Application': '#eab308',
        'Slashing': '#f97316',
        'Ring Weeding': '#22c55e',
    };

    // Custom tooltip to show all values clearly
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border bg-card p-3 shadow-md">
                    <p className="font-semibold mb-2">{label}</p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: entry.color }}
                                />
                                <span className="text-muted-foreground">{entry.name}:</span>
                                <span className="font-medium">{entry.value} {entry.value === 1 ? 'activity' : 'activities'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Activity Timeline (Last 30 Days)</h3>
                <p className="text-sm text-muted-foreground mt-1">
                    Daily count of maintenance activities by type - grouped bars show activities per day
                </p>
            </div>
            <div
                ref={containerRef}
                className="h-80 min-h-[320px] w-full"
                style={{ minHeight: '320px' }}
            >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={chartData} 
                            margin={{ top: 10, right: 10, left: 20, bottom: 50 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                            <XAxis 
                                dataKey="date" 
                                className="text-xs" 
                                tick={{ fill: 'currentColor', fontSize: 10 }}
                                label={{ 
                                    value: 'Date', 
                                    position: 'insideBottom', 
                                    offset: -5,
                                    style: { textAnchor: 'middle', fill: 'currentColor', fontSize: 12, fontWeight: 500 }
                                }}
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                className="text-xs" 
                                tick={{ fill: 'currentColor', fontSize: 11 }}
                                label={{ 
                                    value: 'Number of Activities', 
                                    angle: -90, 
                                    position: 'insideLeft',
                                    style: { textAnchor: 'middle', fill: 'currentColor', fontSize: 12, fontWeight: 500 }
                                }}
                                width={80}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                verticalAlign="top"
                                height={50}
                                wrapperStyle={{ paddingBottom: '10px' }}
                                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                            />
                            <Bar
                                dataKey="Pruning"
                                fill={colors['Pruning']}
                                name="Pruning"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Fertilizer Application"
                                fill={colors['Fertilizer Application']}
                                name="Fertilizer Application"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Herbicide Application"
                                fill={colors['Herbicide Application']}
                                name="Herbicide Application"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Slashing"
                                fill={colors['Slashing']}
                                name="Slashing"
                                radius={[4, 4, 0, 0]}
                            />
                            <Bar
                                dataKey="Ring Weeding"
                                fill={colors['Ring Weeding']}
                                name="Ring Weeding"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
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
