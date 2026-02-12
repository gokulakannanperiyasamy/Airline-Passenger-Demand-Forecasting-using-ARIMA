import React from 'react';
import ForecastChart from '../components/ForecastChart';

export default function ForecastPage({ forecastData, loading }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Forecast Analysis</h2>
                <p className="text-slate-600">Detailed view of historical data and future predictions</p>
            </div>

            <div className="glass-card p-8">
                <div className="h-[600px] w-full">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-slate-600">Loading forecast data...</p>
                            </div>
                        </div>
                    ) : (
                        <ForecastChart
                            historyDates={forecastData?.history_dates}
                            historyValues={forecastData?.history_values}
                            forecastDates={forecastData?.forecast_dates}
                            forecastValues={forecastData?.forecast_values}
                        />
                    )}
                </div>
            </div>

            {forecastData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Historical Range</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Start Date</span>
                                <span className="font-semibold text-slate-800">{forecastData.history_dates[0]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">End Date</span>
                                <span className="font-semibold text-slate-800">
                                    {forecastData.history_dates[forecastData.history_dates.length - 1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Forecast Range</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Start Date</span>
                                <span className="font-semibold text-slate-800">{forecastData.forecast_dates[0]}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">End Date</span>
                                <span className="font-semibold text-slate-800">
                                    {forecastData.forecast_dates[forecastData.forecast_dates.length - 1]}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h4 className="text-sm font-semibold text-slate-500 uppercase mb-3">Growth Projection</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Current</span>
                                <span className="font-semibold text-slate-800">
                                    {forecastData.history_values[forecastData.history_values.length - 1]?.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">2-Year Forecast</span>
                                <span className="font-semibold text-slate-800">
                                    {forecastData.forecast_values[forecastData.forecast_values.length - 1]?.toFixed(0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
