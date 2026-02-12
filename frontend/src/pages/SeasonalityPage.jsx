import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function SeasonalityPage({ forecastData, loading }) {
    const seasonalData = useMemo(() => {
        if (!forecastData?.history_values) return [];

        const monthData = {};
        forecastData.history_dates.forEach((date, index) => {
            const month = new Date(date).getMonth();
            if (!monthData[month]) monthData[month] = [];
            monthData[month].push(forecastData.history_values[index]);
        });

        return Object.keys(monthData).map(month => ({
            month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month],
            avg: Math.round(monthData[month].reduce((a, b) => a + b, 0) / monthData[month].length),
            max: Math.max(...monthData[month]),
            min: Math.min(...monthData[month]),
        }));
    }, [forecastData]);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Seasonality Analysis</h2>
                <p className="text-slate-600">Monthly patterns and seasonal variations</p>
            </div>

            <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Monthly Passenger Distribution</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={seasonalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Bar dataKey="avg" fill="#4f46e5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Seasonal Radar</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={seasonalData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="month" stroke="#64748b" style={{ fontSize: '10px' }} />
                                <PolarRadiusAxis stroke="#64748b" />
                                <Radar name="Average" dataKey="avg" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.3} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Seasonal Insights</h3>
                    <div className="space-y-4">
                        {seasonalData.slice(0, 6).map((month, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div>
                                    <div className="font-semibold text-slate-800">{month.month}</div>
                                    <div className="text-xs text-slate-500">Avg: {month.avg.toLocaleString()}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-green-600">Max: {month.max.toLocaleString()}</div>
                                    <div className="text-sm text-red-600">Min: {month.min.toLocaleString()}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
