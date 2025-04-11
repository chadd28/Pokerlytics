import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime

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
    
    # Sort by date
    df = df.sort_values('date')
    
    # Format sessions-date as YYYY-MM-DD for consistency
    sessions_formatted = []
    for _, row in df.iterrows():
        sessions_formatted.append({
            'date': row['date'].strftime('%Y-%m-%d'),
            'profit': float(row['profit']),
            'cum_profit': float(row['cum_profit'])
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

    # Prepare the final output structure
    result = {
        "sessions": sessions_formatted,
        "trend": {"value": float(trend_value), "isPositive": bool(is_positive)},
        "totalProfit": float(total_profit)
    }
    return result
    
    
    """
    needs to be in this format/schema to match graph input in frontend:
    {
        "sessions": [
            {"date": "2023-01-15", "profit": 150, "cum_profit": 150},
            {"date": "2023-02-10", "profit": -75, "cum_profit": 75},
        ],
        "trend": {"value": 12.5, "isPositive": true},
        "totalProfit": 75
    }
    """

if __name__ == "__main__":
     # Read input data from Node.js
    input_data = json.loads(sys.stdin.read())
    result = process(input_data)
    
    # Output formatted JSON
    print(json.dumps(result))