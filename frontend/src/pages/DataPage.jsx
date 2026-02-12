import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';

export default function DataPage({ forecastData, loading }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const tableData = useMemo(() => {
        if (!forecastData?.history_dates) return [];

        return forecastData.history_dates.map((date, index) => ({
            date,
            passengers: forecastData.history_values[index],
            year: new Date(date).getFullYear(),
        }));
    }, [forecastData]);

    const filteredData = useMemo(() => {
        return tableData.filter(row =>
            row.date.includes(searchTerm) ||
            row.passengers.toString().includes(searchTerm)
        );
    }, [tableData, searchTerm]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(start, start + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Data Explorer</h2>
                <p className="text-slate-600">Browse and search through the historical dataset</p>
            </div>

            <div className="glass-card p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by date or passenger count..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="text-sm text-slate-600">
                        Showing {filteredData.length.toLocaleString()} records
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Year</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Passengers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, index) => (
                                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-3 px-4 text-sm text-slate-800">{row.date}</td>
                                    <td className="py-3 px-4 text-sm text-slate-600">{row.year}</td>
                                    <td className="py-3 px-4 text-sm text-right font-semibold text-indigo-600">
                                        {row.passengers.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between mt-6">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <div className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
