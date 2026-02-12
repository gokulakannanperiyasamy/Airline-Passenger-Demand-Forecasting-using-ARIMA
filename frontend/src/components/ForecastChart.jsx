import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function ForecastChart({ historyDates, historyValues, forecastDates, forecastValues }) {
    if (!historyDates || !historyValues) return <div className="text-slate-400">Loading chart data...</div>;

    // Combine dates and values, inserting nulls for gaps
    const labels = [...historyDates, ...forecastDates];

    // Create dataset for history (valid up to end of history)
    const historyData = [...historyValues, ...new Array(forecastDates.length).fill(null)];

    // Create dataset for forecast (starts where history ends)
    // We need to connect the last history point to the first forecast point visually, 
    // but for simplicity, we'll just plot forecast points.
    // To connect, we'd add the last history point to the start of forecast.
    const forecastData = [...new Array(historyDates.length).fill(null), ...forecastValues];

    // Optional: Add the last history point to forecast to make lines connect
    if (historyValues.length > 0 && forecastValues.length > 0) {
        forecastData[historyDates.length - 1] = historyValues[historyValues.length - 1];
    }

    const data = {
        labels,
        datasets: [
            {
                label: 'Historical Data',
                data: historyData,
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                fill: true,
            },
            {
                label: 'ARIMA Forecast',
                data: forecastData,
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderDash: [8, 4],
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#475569',
                    font: {
                        size: 12,
                        weight: '600'
                    },
                    padding: 15,
                    usePointStyle: true,
                }
            },
            // title: { // Removed title plugin as per new code
            //     display: true,
            //     text: 'Airline Passenger Forecast',
            //     color: 'white'
            // },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                displayColors: true,
            }
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    font: {
                        size: 11
                    },
                    padding: 8,
                },
                border: {
                    display: false
                }
            },
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748b',
                    maxTicksLimit: 15,
                    font: {
                        size: 11
                    },
                    padding: 8,
                },
                border: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return <Line options={options} data={data} />;
}
