import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendsPage({ forecastData, loading }) {
    const trendData = useMemo(() => {
        if (!forecastData?.history_dates) return [];

        // Sample data for performance (every 30th point)
        return forecastData.history_dates
            .map((date, index) => ({
                date: date.substring(0, 7), // YYYY-MM
                passengers: forecastData.history_values[index],
            }))
            .filter((_, index) => index % 30 === 0);
    }, [forecastData]);

    const monthlyAvg = useMemo(() => {
        if (!forecastData?.history_values) return {};

        const monthData = {};
        forecastData.history_dates.forEach((date, index) => {
            const month = new Date(date).getMonth();
            if (!monthData[month]) monthData[month] = [];
            monthData[month].push(forecastData.history_values[index]);
        });

        return Object.keys(monthData).map(month => ({
            month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month],
            avg: Math.round(monthData[month].reduce((a, b) => a + b, 0) / monthData[month].length),
        }));
    }, [forecastData]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Trends & Patterns</h2>
                <p className="text-slate-600">Historical trends and pattern analysis</p>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Long-term Trend</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorPassengers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="passengers"
                                stroke="#4f46e5"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorPassengers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Monthly Average Patterns</h3>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyAvg}>
                            <defs>
                                <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="avg"
                                stroke="#ec4899"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorMonthly)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
