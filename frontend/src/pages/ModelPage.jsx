import React from 'react';
import { Activity, TrendingUp, Zap } from 'lucide-react';

export default function ModelPage({ metrics, loading }) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Model Insights</h2>
                <p className="text-slate-600">ARIMA model parameters and performance metrics</p>
            </div>

            {metrics && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">ARIMA Order</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        ({metrics.best_order.join(', ')})
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">p (AR order)</span>
                                    <span className="font-semibold">{metrics.best_order[0]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">d (Differencing)</span>
                                    <span className="font-semibold">{metrics.best_order[1]}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">q (MA order)</span>
                                    <span className="font-semibold">{metrics.best_order[2]}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Model Accuracy</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        {metrics.rmse.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600">
                                Root Mean Squared Error (RMSE) measures the average prediction error
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Test Samples</div>
                                    <div className="text-2xl font-bold text-slate-800">
                                        {metrics.test_data_size.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-600">
                                Number of data points used for model validation
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">Model Explanation</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                                <h4 className="font-semibold text-slate-800 mb-2">AutoRegressive (AR) Component - p={metrics.best_order[0]}</h4>
                                <p className="text-sm text-slate-600">
                                    The model uses the past {metrics.best_order[0]} observations to predict future values, capturing the dependency between an observation and lagged observations.
                                </p>
                            </div>

                            <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                                <h4 className="font-semibold text-slate-800 mb-2">Integrated (I) Component - d={metrics.best_order[1]}</h4>
                                <p className="text-sm text-slate-600">
                                    The data is differenced {metrics.best_order[1]} time(s) to make it stationary, removing trends and seasonal patterns.
                                </p>
                            </div>

                            <div className="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-500">
                                <h4 className="font-semibold text-slate-800 mb-2">Moving Average (MA) Component - q={metrics.best_order[2]}</h4>
                                <p className="text-sm text-slate-600">
                                    The model incorporates the past {metrics.best_order[2]} forecast error(s) to improve prediction accuracy.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
