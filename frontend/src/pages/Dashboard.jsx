import React from 'react';
import { TrendingUp, Users, Calendar, Target } from 'lucide-react';

export default function Dashboard({ forecastData, metrics, loading }) {
    const stats = [
        {
            label: 'Total Data Points',
            value: forecastData?.history_values?.length?.toLocaleString() || '0',
            icon: Database,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            label: 'Forecast Horizon',
            value: '730 Days',
            icon: Calendar,
            color: 'from-purple-500 to-pink-500',
        },
        {
            label: 'Model RMSE',
            value: metrics?.rmse?.toFixed(2) || 'N/A',
            icon: Target,
            color: 'from-green-500 to-emerald-500',
        },
        {
            label: 'Avg Daily Passengers',
            value: forecastData?.history_values
                ? Math.round(forecastData.history_values.reduce((a, b) => a + b, 0) / forecastData.history_values.length).toLocaleString()
                : '0',
            icon: Users,
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Dashboard Overview</h2>
                <p className="text-slate-600">Key metrics and insights from your forecasting model</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="glass-card p-6 hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</div>
                            <div className="text-sm text-slate-500">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {forecastData && (
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Forecast Preview</h3>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <div className="text-sm text-slate-500 mb-2">Last Historical Value</div>
                            <div className="text-4xl font-bold text-indigo-600">
                                {forecastData.history_values[forecastData.history_values.length - 1]?.toLocaleString()}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {forecastData.history_dates[forecastData.history_dates.length - 1]}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-slate-500 mb-2">Forecast (1 Year Ahead)</div>
                            <div className="text-4xl font-bold text-purple-600">
                                {forecastData.forecast_values[365]?.toFixed(0).toLocaleString() || 'N/A'}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                {forecastData.forecast_dates[365] || 'N/A'}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

import { Database } from 'lucide-react';
