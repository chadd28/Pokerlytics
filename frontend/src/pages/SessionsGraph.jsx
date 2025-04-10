import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';
import { authAxios } from '../services/authService';
import Sidebar from '../components/SideBar';

export default function SessionsGraph() {
    const [sessionData, setSessionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trend, setTrend] = useState({ value: 0, isPositive: true });   // Trend data to show if performance is improving or declining
    const [totalProfit, setTotalProfit] = useState(0);        // Total profit across all sessions

    // Fetch data when component mounts
    useEffect(() => {
        const fetchSessionData = async () => {
        try {
            setIsLoading(true);
            // Get data from backend API
            const response = await authAxios.get('/api/sessions');
            
            // Transform API data into format needed for chart display
            // To this:
            const transformedData = response.data.map((session, index) => ({
                count: index + 1, // Adding a count field (1-based)
                profit: session.profit,
                date: new Date(session.date).toLocaleDateString('en-GB'),
            }));

            // Calculate trend (last 5 sessions vs previous 5)
            if (transformedData.length > 5) {
            const recentFive = transformedData.slice(-5);
            const previousFive = transformedData.slice(-10, -5);
            
            const recentAvg = recentFive.reduce((sum, session) => sum + session.profit, 0) / recentFive.length;
            const previousAvg = previousFive.reduce((sum, session) => sum + session.profit, 0) / previousFive.length;
            
            const trendValue = ((recentAvg - previousAvg) / Math.abs(previousAvg || 1)) * 100;
            setTrend({
                value: Math.abs(trendValue).toFixed(1),
                isPositive: trendValue >= 0
            });
            }

            // Calculate total profit from all sessions
            const total = transformedData.reduce((sum, session) => sum + session.profit, 0);
            setTotalProfit(total);
            
            setSessionData(transformedData);
        } catch (error) {
            console.error('Error fetching session data:', error);
            // If we can't fetch data, we'll use demo data below
        } finally {
            setIsLoading(false);
        }
        };

        fetchSessionData();
    }, []);

    // Sample data to use if API request fails or returns empty
    const demoData = [
        { count: 1, profit: 150, date: '01/01/2025' },
        { count: 2, profit: 210, date: '15/01/2025' },
        { count: 3, profit: 180, date: '01/02/2025' },
        { count: 4, profit: -90, date: '15/02/2025' },
        { count: 5, profit: 120, date: '01/03/2025' },
        { count: 6, profit: 320, date: '15/03/2025' },
        { count: 7, profit: 250, date: '01/04/2025' },
    ];

    // Use API data if available, otherwise fall back to demo data
    const data = sessionData.length > 0 ? sessionData : demoData;

    // Custom tooltip component - appears when hovering over data points
    const CustomTooltip = ({ active, payload }) => {
        // 'active' is a boolean provided by Recharts that indicates if the user is hovering over a data point
        // 'payload' is an array containing the data of the hovered point (includes value, name, color, etc.)
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-700 p-2 rounded-md shadow-md border border-gray-500 text-sm">
                    <p className="font-medium">{payload[0].payload.date}</p>
                    <p className={`${payload[0].value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

  return (
    <div className="flex bg-gray-900 min-h-screen">
      <Sidebar />
      
      {/* Main content area with better centering */}
      <div className="flex-1 p-8 ml-40">
        <div className="max-w-4xl mx-auto">
          {/* Card with dark theme */}
          <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* Card header */}
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Session Performance</h2>
            </div>
            
            {/* Card content - the chart */}
            <div className="p-6">
              <div className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                      {/* Dark theme grid */}
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                      
                      {/* X-axis with light text */}
                      <XAxis 
                        dataKey="count" 
                        tickLine={false} 
                        axisLine={false}
                        tickMargin={8}
                        tick={{ fill: "#9CA3AF" }}
                      />
                      
                      {/* Y-axis with light text */}
                      <YAxis 
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#9CA3AF" }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      
                      {/* Tooltip */}
                      <Tooltip content={<CustomTooltip />} cursor={false} />
                      
                      {/* Bright blue line for visibility on dark background */}
                      <Line 
                        type="linear" 
                        dataKey="profit" 
                        stroke="#60A5FA" 
                        strokeWidth={2.5}
                        dot={false}
                      />
                      </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
            
            {/* Card footer - summary stats */}
            <div className="p-6 border-t border-gray-700 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-full ${trend.isPositive ? 'bg-green-900 bg-opacity-50' : 'bg-red-900 bg-opacity-50'}`}>
                  {trend.isPositive ? 
                    <HiArrowTrendingUp className="h-4 w-4 text-green-400" /> : 
                    <HiArrowTrendingDown className="h-4 w-4 text-red-400" />
                  }
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">Trending </span>
                  <span className={`font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {trend.isPositive ? 'up' : 'down'} by {trend.value}%
                  </span>
                </div>
              </div>
              
              <div className="ml-auto text-sm text-gray-400">
                Showing {data.length} sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}