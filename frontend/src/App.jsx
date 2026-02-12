import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import SpiralBackground from './components/SpiralBackground';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ForecastPage from './pages/ForecastPage';
import TrendsPage from './pages/TrendsPage';
import SeasonalityPage from './pages/SeasonalityPage';
import ModelPage from './pages/ModelPage';
import DataPage from './pages/DataPage';

function App() {
  const [forecastData, setForecastData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forecastRes, metricsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/forecast'),
          axios.get('http://127.0.0.1:5000/api/metrics')
        ]);
        setForecastData(forecastRes.data);
        setMetrics(metricsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Ensure backend is running.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden">
        <SpiralBackground />

        <div className="relative z-10 max-w-7xl mx-auto p-6">
          <Navbar />

          {error ? (
            <div className="glass-card p-8 text-center">
              <div className="text-red-500 text-lg">{error}</div>
            </div>
          ) : (
            <Routes>
              <Route
                path="/"
                element={<Dashboard forecastData={forecastData} metrics={metrics} loading={loading} />}
              />
              <Route
                path="/forecast"
                element={<ForecastPage forecastData={forecastData} loading={loading} />}
              />
              <Route
                path="/trends"
                element={<TrendsPage forecastData={forecastData} loading={loading} />}
              />
              <Route
                path="/seasonality"
                element={<SeasonalityPage forecastData={forecastData} loading={loading} />}
              />
              <Route
                path="/model"
                element={<ModelPage metrics={metrics} loading={loading} />}
              />
              <Route
                path="/data"
                element={<DataPage forecastData={forecastData} loading={loading} />}
              />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
