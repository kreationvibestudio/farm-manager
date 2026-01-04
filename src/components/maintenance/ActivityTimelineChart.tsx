"use client";

import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
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

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Activity Timeline (Last 30 Days)</h3>
            <div
                ref={containerRef}
                className="h-64 min-h-[256px] w-full"
                style={{ minHeight: '256px' }}
            >
                {dimensions.width > 0 && dimensions.height > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPruning" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors['Pruning']} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors['Pruning']} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFertilizer" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors['Fertilizer Application']} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors['Fertilizer Application']} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorHerbicide" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors['Herbicide Application']} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors['Herbicide Application']} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSlashing" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors['Slashing']} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors['Slashing']} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorRingWeeding" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={colors['Ring Weeding']} stopOpacity={0.8} />
                                    <stop offset="95%" stopColor={colors['Ring Weeding']} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="date" className="text-xs" tick={{ fill: 'currentColor' }} />
                            <YAxis className="text-xs" tick={{ fill: 'currentColor' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                            />
                            <Area
                                type="monotone"
                                dataKey="Pruning"
                                stackId="1"
                                stroke={colors['Pruning']}
                                fill="url(#colorPruning)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="Fertilizer Application"
                                stackId="1"
                                stroke={colors['Fertilizer Application']}
                                fill="url(#colorFertilizer)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="Herbicide Application"
                                stackId="1"
                                stroke={colors['Herbicide Application']}
                                fill="url(#colorHerbicide)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="Slashing"
                                stackId="1"
                                stroke={colors['Slashing']}
                                fill="url(#colorSlashing)"
                                strokeWidth={2}
                            />
                            <Area
                                type="monotone"
                                dataKey="Ring Weeding"
                                stackId="1"
                                stroke={colors['Ring Weeding']}
                                fill="url(#colorRingWeeding)"
                                strokeWidth={2}
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
