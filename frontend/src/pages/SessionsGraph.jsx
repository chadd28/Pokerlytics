import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiArrowTrendingUp, HiArrowTrendingDown, HiInformationCircle } from 'react-icons/hi2';
import Sidebar from '../components/SideBar';
import { getSessionsGraph } from '../services/sessionService';


export default function SessionsGraph() {
    const [sessionData, setSessionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [trend, setTrend] = useState({ value: 0, isPositive: true });   // Trend data to show if performance is improving or declining
    const [totalProfit, setTotalProfit] = useState(0);                   // Total profit across all sessions
    const [showTrendTooltip, setShowTrendTooltip] = useState(false);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchSessionData = async () => {
        try {
            setIsLoading(true);
            // Call the Python analytics endpoint
            const data = await getSessionsGraph();
            
            // Extract different parts of the analytics response from python code
            const { sessions, trend: trendData, totalProfit } = data;

            
            // Transform session data
            const transformedData = sessions.map((session, index) => ({
                count: index + 1,
                profit: session.profit,
                cum_profit: session.cum_profit,
                date: new Date(session.date).toLocaleDateString('en-GB')
            }));

            // update state with the data
            setTrend(trendData);
            setTotalProfit(totalProfit);
            setSessionData(transformedData);
        } catch (error) {
            console.error('Error fetching session data:', error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchSessionData();
    }, []);

    // Use API data if available, otherwise fall back to demo data
    const data = sessionData;

    // Custom tooltip component - appears when hovering over data points
    const CustomTooltip = ({ active, payload }) => {
        // 'active' is a boolean provided by Recharts that indicates if the user is hovering over a data point
        // 'payload' is an array containing the data of the hovered point
        if (active && payload && payload.length) {
            const sessionData = payload[0].payload;
            return (
                <div className="bg-gray-700 p-2 rounded-md shadow-md border border-gray-500 text-sm">
                    <p className="font-medium">{sessionData.date}</p>
                    <p className={`${sessionData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${sessionData.profit}
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
              <h2 className="text-xl font-semibold text-white">All Sessions</h2>
            </div>
            
            {/* Card content - the chart */}
            <div className="p-6">
              <div className="h-80">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : data.length > 0 ? (
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
                        dataKey="cum_profit" 
                        stroke="#60A5FA" 
                        strokeWidth={2.5}
                        dot={false}
                      />
                      </LineChart>
                  </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400 text-lg">No sessions to show</p>
                    </div>
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
                        {isLoading ? (
                            <span className="text-gray-400">Loading trend data...</span>
                        ) : (
                            <>
                            <span className="text-gray-400">Trending </span>
                            <span className={`font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                {trend.isPositive ? 'up' : 'down'} by {trend.value}%
                            </span>
                            </>
                        )}
                    </div>

                    {/* Info icon with hover tooltip */}
                    <div className="relative">
                        <HiInformationCircle 
                            className="h-4 w-4 text-gray-400"
                            onMouseEnter={() => setShowTrendTooltip(true)}
                            onMouseLeave={() => setShowTrendTooltip(false)}
                        />
                        
                        {/* Animated tooltip */}
                        {showTrendTooltip && (
                        <div 
                            className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg z-10 border border-gray-600 transition-all duration-300 transform origin-bottom-left"
                        >
                            <p>This trend reflects the recent change in profits compared to earlier sessions. A negative value means your recent profits are lower than before, even if you're still in profit overall.</p>
                            <div className="absolute -bottom-1 left-2 w-2 h-2 bg-gray-700 border-r border-b border-gray-600 transform rotate-45"></div>
                        </div>
                    )}
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