import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { HiArrowTrendingUp, HiArrowTrendingDown, HiInformationCircle } from 'react-icons/hi2';
import { getSessionsGraphData } from '../../services/sessionService';
import { motion } from 'framer-motion'; 

export default function AllSessionsGraph({ height = 320, width = "100%" }) {
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
            const data = await getSessionsGraphData();
            
            // Extract different parts of the analytics response from python code
            const { sessions, trend: trendData, totalProfit } = data;

            
            // Transform session data
            const transformedData = sessions.map((session, index) => ({
                count: index + 1,
                profit: session.profit,
                cum_profit: session.cum_profit,
                date: new Date(session.date).toLocaleDateString('en-GB', {timeZone: 'UTC'}) 
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
                        ${sessionData.profit.toFixed(2)}
                    </p>
                    <p className={`${sessionData.cum_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Net: ${sessionData.cum_profit.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Convert width to proper style format
    const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <motion.div 
      className="bg-gray-900 rounded-lg overflow-hidden w-full"
      style={{ width: widthStyle }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card header */}
      <div className="p-6 border-b border-gray-700 flex justify-between items-start min-h-[100px]">
          <h2 className="text-2xl font-semibold text-white flex items-center h-full">All Sessions</h2>
  
          {/* Net Result display */}
          {!isLoading && data.length > 0 && (
              <motion.div 
                  className="flex flex-col items-end"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
              >
                  <span className="text-xs uppercase tracking-wider text-gray-400">Net Result</span>
                  <span className={`text-xl font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalProfit >= 0 ? '+' : ''}{typeof totalProfit === 'number' ? `$${totalProfit.toFixed(2)}` : '$0.00'}
                  </span>
              </motion.div>
          )}
      </div>
      
      {/* Card content - the chart */}
      <div className="p-6">
        <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
          {isLoading ? (
              <motion.div 
                  className="flex items-center justify-center h-full"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key="loading"
              >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </motion.div>
          ) : data.length > 0 ? (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  key="chart"
                  className="h-full w-full"
              >
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
                // - For more than 50 sessions: shows every 10th session
                // - For 21-50 sessions: shows every 5th session
                // - For 20 or fewer sessions: shows every 2nd session
                ticks={(() => {
                    const interval = data.length > 50 ? 10 : data.length > 20 ? 5 : 2;
                    return data
                    .filter(item => item.count % interval === 0 || item.count === 1 || item.count === data.length)
                    .map(item => item.count);
                })()}
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
            </motion.div>
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
                      <p>This trend reflects the recent change in profits between the last 3 sessions and the prior 3 sessions. A negative value means your recent profits are lower than before, even if you're still in profit overall.</p>
                      <div className="absolute -bottom-1 left-2 w-2 h-2 bg-gray-700 border-r border-b border-gray-600 transform rotate-45"></div>
                  </div>
              )}
              </div>

          </div>
        
        <div className="ml-auto text-sm text-gray-400">
          Showing {data.length} sessions
        </div>
      </div>
    </motion.div>
  );
}