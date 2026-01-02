"use client";

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { vehicleStats } from '@/lib/data';

export function FleetStatus() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold">Fleet Status</h3>
                <div className="h-48 min-h-[192px] flex items-center justify-center">
                    <div className="text-muted-foreground">Loading chart...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold">Fleet Status</h3>
            <div className="h-48 min-h-[192px] w-full">
                <ResponsiveContainer width="100%" height="100%" minHeight={192}>
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
            </div>
        </div>
    );
}
