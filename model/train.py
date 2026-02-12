import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
from sklearn.metrics import mean_squared_error
import warnings
import pickle
import json
import os
from datetime import timedelta

warnings.filterwarnings("ignore")

DATA_PATH = 'data/airline-passengers-daily.csv'
MODEL_PATH = 'model/arima_model.pkl'
METRICS_PATH = 'model/metrics.json'
FORECAST_PATH = 'model/forecast.json'

def load_data():
    print("Loading data...")
    try:
        df = pd.read_csv(DATA_PATH)
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)
        df.index.freq = 'D'
        print(f"Loaded {len(df)} rows.")
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        raise

def check_stationarity(timeseries):
    print("Checking stationarity...")
    # Downsample for ADF test speed if needed, but 18k is manageable
    result = adfuller(timeseries)
    print('ADF Statistic: %f' % result[0])
    print('p-value: %f' % result[1])
    return result[1] < 0.05

def grid_search_arima(train, test, p_values, d_values, q_values):
    best_score, best_cfg = float("inf"), None
    print("Starting Grid Search...")
    for p in p_values:
        for d in d_values:
            for q in q_values:
                order = (p, d, q)
                try:
                    # For daily data, use a smaller subset for grid search to save time
                    # or just fit on full train. Here we use a rolling forecast on a small window
                    # or simple train/test split evaluation.
                    # Simplification: Fit on train, predict test.
                    model = ARIMA(train, order=order)
                    model_fit = model.fit()
                    # Predict only next 30 days for validation speed
                    forecast = model_fit.forecast(steps=len(test))
                    mse = mean_squared_error(test, forecast)
                    rmse = np.sqrt(mse)
                    if rmse < best_score:
                        best_score, best_cfg = rmse, order
                    print('ARIMA%s RMSE=%.3f' % (order, rmse))
                except Exception as e:
                    print(f"Error for {order}: {e}")
                    continue
    print('Best ARIMA%s RMSE=%.3f' % (best_cfg, best_score))
    return best_cfg, best_score

def train_and_save():
    df = load_data()
    
    # Split data
    # Calculate split point (last 365 days for test)
    test_days = 365
    train = df[:-test_days]
    test = df[-test_days:]
    
    # Check stationarity (logging only)
    # is_stationary = check_stationarity(train['Passengers'])
    # print(f"Data Stationary? {is_stationary}")

    # Grid search (simplified for daily data to avoid long wait)
    # Daily data often requires high order or SARIMA, but for speed we stick to simple ARIMA
    # We will trust a standard (5,1,0) or small grid
    p_values = [5] 
    d_values = [1]
    q_values = [0, 1]
    
    best_order, best_rmse = grid_search_arima(train['Passengers'], test['Passengers'], p_values, d_values, q_values)
    
    # Train final model on full dataset
    print(f"Training final model with order {best_order} on {len(df)} rows...")
    final_model = ARIMA(df['Passengers'], order=best_order)
    final_model_fit = final_model.fit()
    
    # Save model
    if not os.path.exists('model'):
        os.makedirs('model')
        
    with open(MODEL_PATH, 'wb') as pkl:
        pickle.dump(final_model_fit, pkl)
        
    # Forecast future (Next 2 years = 730 days)
    future_steps = 730
    forecast = final_model_fit.forecast(steps=future_steps)
    
    # Save metrics and forecast
    metrics = {
        "best_order": best_order,
        "rmse": best_rmse,
        "test_data_size": len(test)
    }
    
    with open(METRICS_PATH, 'w') as f:
        json.dump(metrics, f)
        
    # Export full history to demonstrate 10k+ points
    # history_view = df.tail(365 * 5)
    
    forecast_data = {
        "history_dates": df.index.strftime('%Y-%m-%d').tolist(),
        "history_values": df['Passengers'].tolist(),
        "forecast_dates": pd.date_range(start=df.index[-1] + timedelta(days=1), periods=future_steps, freq='D').strftime('%Y-%m-%d').tolist(),
        "forecast_values": forecast.tolist()
    }
    
    with open(FORECAST_PATH, 'w') as f:
        json.dump(forecast_data, f)
        
    print("Training complete. Artifacts saved.")

if __name__ == "__main__":
    train_and_save()
