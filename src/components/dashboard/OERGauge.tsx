"use client";

import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

interface OERGaugeProps {
    value?: number;
}

export function OERGauge({ value = 19.2 }: OERGaugeProps) {
    const data = [{ name: 'OER', value, fill: '#16a34a' }];

    return (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold">Oil Extraction Rate</h3>
            <div className="h-48 relative">
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
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-primary">{value}%</span>
                    <span className="text-xs text-muted-foreground">Target: 22%</span>
                </div>
            </div>
        </div>
    );
}
