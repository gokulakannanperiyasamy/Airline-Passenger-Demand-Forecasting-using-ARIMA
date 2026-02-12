import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_daily_data():
    # Load original data to get trend and seasonality baseline
    df_orig = pd.read_csv('data/airline-passengers.csv', parse_dates=['Month'])
    df_orig['Month'] = pd.to_datetime(df_orig['Month'])
    
    # Calculate monthly growth rate (trend)
    df_orig['t'] = np.arange(len(df_orig))
    # Simple linear trend for extrapolation: y = mx + c
    z = np.polyfit(df_orig['t'], df_orig['Passengers'], 1)
    p = np.poly1d(z)
    
    # Calculate seasonality factors (simplified)
    df_orig['MonthNum'] = df_orig['Month'].dt.month
    monthly_avg = df_orig.groupby('MonthNum')['Passengers'].mean()
    overall_avg = df_orig['Passengers'].mean()
    seasonal_factors = monthly_avg / overall_avg

    # Generate dates from 1950-01-01 to 2000-01-01 (50 years)
    start_date = datetime(1950, 1, 1)
    end_date = datetime(2000, 1, 1)
    date_range = pd.date_range(start=start_date, end=end_date, freq='D')
    
    print(f"Generating {len(date_range)} data points...")
    
    passengers = []
    base_passengers = 120 # Starting value roughly from 1949
    
    for i, date in enumerate(date_range):
        # 1. Trend component (exponential growth is more realistic for aviation)
        # Using a compound annual growth rate approx 5-8%
        years_passed = i / 365.25
        trend = base_passengers * (1.06 ** years_passed)
        
        # 2. Seasonality (Yearly pattern)
        month = date.month
        # Interpolate monthly factor to daily to avoid steps
        factor = seasonal_factors[month]
        
        # 3. Weekly seasonality (Higher on weekends/Fridays)
        weekday = date.weekday() # 0=Mon, 6=Sun
        weekly_factor = 1.0
        if weekday == 4: # Friday
            weekly_factor = 1.05
        elif weekday == 6: # Sunday
            weekly_factor = 1.02
        elif weekday == 1 or weekday == 2: # Tue/Wed often lower
            weekly_factor = 0.95
            
        # 4. Noise
        noise = np.random.normal(0, trend * 0.05)
        
        # Combine
        val = (trend * factor * weekly_factor) + noise
        passengers.append(int(val))
        
    df_new = pd.DataFrame({
        'Date': date_range,
        'Passengers': passengers
    })
    
    output_path = 'data/airline-passengers-daily.csv'
    df_new.to_csv(output_path, index=False)
    print(f"Saved {len(df_new)} rows to {output_path}")

if __name__ == "__main__":
    generate_daily_data()
