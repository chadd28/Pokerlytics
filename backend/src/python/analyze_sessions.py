import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime
import logging

def process(sessions_data):
    """
    Process poker session data and return formatted analytics
    
    Inputs:
        sessions_data: List of session objects from Supabase
    Returns:
        Formatted JSON with sessions, trend, and totalProfit
    """
    # Convert to DataFrame
    #print("Processing data...", sessions_data)
    df = pd.DataFrame(sessions_data)

    # If no data, return empty structure
    if df.empty:
        return {
            "sessions": [],
            "trend": {"value": 0, "isPositive": True},
            "totalProfit": 0
        }
    
    # Extract date/profit 
    df['date'] = pd.to_datetime(df['start_time'])
    df['profit'] = df['profit_loss']    
    df['cum_profit'] = df['profit'].cumsum()    # cumulative profit
    total_profit = round(df['profit'].sum(), 2) # calc total profit
    
    # calculate session duration in hours
    df['end_time'] = pd.to_datetime(df['end_time'])
    df['duration_hours'] = (df['end_time'] - df['date']).dt.total_seconds() / 3600

    # Calculate $ per hour
    df['$_per_hour'] = df.apply(lambda row: row['profit'] / row['duration_hours'] if row['duration_hours'] > 0 else 0, axis=1)

    # Extract BB size from additional_info and calculate BB per hour
    def extract_bb_size(row):
        try:
            additional_info = row['additional_info']
            if isinstance(additional_info, str):
                additional_info = json.loads(additional_info)
            
            return float(additional_info['bb'])
        except:
            return 0.2  # Default fallback just in case
    
    df['bb_size'] = df.apply(extract_bb_size, axis=1)
    df['bb_per_hour'] = df.apply(lambda row: (row['profit'] / row['bb_size']) / row['duration_hours'] if row['duration_hours'] > 0 else 0, axis=1)

    # ======= Calculate cumulative hourly metrics =======
    # First, calculate total profit and total hours up to each session
    df['cum_total_profit'] = df['profit'].cumsum()
    df['cum_total_hours'] = df['duration_hours'].cumsum()
    
    # Calculate cumulative $ per hour = total profit to date / total hours to date
    df['cum_avg_$_per_hour'] = df.apply(lambda row: row['cum_total_profit'] / row['cum_total_hours'] if row['cum_total_hours'] > 0 else 0, axis=1)
    
    # For cumulative BB per hour, we need weighted BB profits
    df['bb_profit'] = df['profit'] / df['bb_size']
    df['cum_bb_profit'] = df['bb_profit'].cumsum()
    df['cum_avg_bb_per_hour'] = df.apply(lambda row: row['cum_bb_profit'] / row['cum_total_hours'] if row['cum_total_hours'] > 0 else 0, axis=1)
    

    # Sort by date
    df = df.sort_values('date')
    
    # Format sessions-date as YYYY-MM-DD for consistency
    sessions_formatted = []
    for _, row in df.iterrows():
        sessions_formatted.append({
            'date': row['date'].strftime('%Y-%m-%d'),
            'profit': float(row['profit']),
            'cum_profit': round(float(row['cum_profit']), 2),
            '$_per_hour': round(float(row['$_per_hour']), 2),
            'cum_avg_$_per_hour': round(float(row['cum_avg_$_per_hour']), 2),
            'bb_per_hour': round(float(row['bb_per_hour']), 2),
            'cum_avg_bb_per_hour': round(float(row['cum_avg_bb_per_hour']), 2),
        })
    
    # calculate trend
    if len(df) >= 6:
        recent_data = df.iloc[-3:]
        prev_data = df.iloc[-6:-3]
        recent_avg = recent_data['profit'].mean()
        previous_avg = prev_data['profit'].mean()
        # Avoid division by zero
        if previous_avg != 0:
            trend_value = ((recent_avg - previous_avg) / abs(previous_avg)) * 100
        else:
            trend_value = 0 if recent_avg == 0 else 100

        if trend_value >= 0:
            is_positive = True
        else:
            is_positive = False

        trend_value = abs(round(trend_value, 1))
    else:
        # use slope as fallback
        y = df['profit'].values[-5:]  # Take last up to 9 points
        x = np.arange(len(y))
        if len(y) > 1:
            slope, _ = np.polyfit(x, y, 1)
        else:
            slope = 0
        is_positive = slope >= 0
        trend_value = abs(round(slope, 1)) 
        
    # calculate current streak
    streak, streak_type = 0, None
    for profit in reversed(df['profit']): #reversed because recent at bottom
        if profit >= 0:
            if streak_type in (None, 'Win'):
                streak_type = 'Win'
                streak += 1
            else:
                break
        else:   # negative profit -- losing streak
            if streak_type in (None, 'Loss'):
                streak_type = 'Loss'
                streak += 1
            else:
                break

    # Prepare the final output structure
    result = {
        "sessions": sessions_formatted,
        "trend": {"value": float(trend_value), "isPositive": bool(is_positive)},
        "totalProfit": float(total_profit),
        "totalDuration": df['duration_hours'].sum(),
        "currentStreak": [streak, streak_type]
    }

    # Debug: Log DataFrame columns
    logging.info("DataFrame columns: %s", df.columns.tolist())


    return result
    
    
    """
    needs to be in this format/schema to match graph input in frontend:
    {
        "sessions": [
            {"date": "2023-01-15", "profit": 150, "cum_profit": 150},
            {"date": "2023-02-10", "profit": -75, "cum_profit": 75},
        ],
        "trend": {"value": 12.5, "isPositive": true},
        "totalProfit": 75,
        "totalDuration": 50.5,
        "currentStreak": [2, Win]
    }
    """

if __name__ == "__main__":
     # Read input data from Node.js
    input_data = json.loads(sys.stdin.read())
    result = process(input_data)
    
    # Output formatted JSON
    print(json.dumps(result))