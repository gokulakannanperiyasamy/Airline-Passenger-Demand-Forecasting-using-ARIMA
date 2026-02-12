import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, TrendingUp, Calendar, BarChart3, Database, Settings } from 'lucide-react';

const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/forecast', icon: TrendingUp, label: 'Forecast' },
    { path: '/trends', icon: BarChart3, label: 'Trends' },
    { path: '/seasonality', icon: Calendar, label: 'Seasonality' },
    { path: '/model', icon: Settings, label: 'Model' },
    { path: '/data', icon: Database, label: 'Data' },
];

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="glass-card mb-6 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">ARIMA Forecasting</h1>
                        <p className="text-xs text-slate-500">Airline Passenger Analytics</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isActive
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                        : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
