import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessionsGraphData } from '../../services/sessionService';
import { motion } from 'framer-motion'; 
import { HiArrowsRightLeft } from 'react-icons/hi2';

export default function HourlyGraph() {
    const [sessionData, setSessionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metricType, setMetricType] = useState('dollars'); // 'dollars' or 'bb'
    const [totalHours, setTotalHours] = useState(0);
    const [latestAvg, setLatestAvg] = useState({
        dollars: 0,
        bb: 0
    });

    // Fetch data when component mounts
    useEffect(() => {
        const fetchSessionData = async () => {
        try {
            setIsLoading(true);
            // Call the Python analytics endpoint
            const data = await getSessionsGraphData();
            
            // Extract sessions data
            const { sessions, totalDuration } = data;
            
            // Transform session data
            const transformedData = sessions.map((session, index) => ({
                count: index + 1,
                dollars_per_hour: session.$_per_hour,
                bb_per_hour: session.bb_per_hour,
                cum_dollars_per_hour: session.cum_avg_$_per_hour,
                cum_bb_per_hour: session.cum_avg_bb_per_hour,
                date: new Date(session.date).toLocaleDateString('en-GB', {timeZone: 'UTC'})
            }));

            // Update state with the data
            setSessionData(transformedData);
            
            // Get the last session's cumulative average if data exists
            if (transformedData.length > 0) {
                const lastSession = transformedData[transformedData.length - 1];
                setLatestAvg({
                    dollars: lastSession.cum_dollars_per_hour,
                    bb: lastSession.cum_bb_per_hour
                });
            }
            
            // Set total hours from the totalDuration field in the response
            if (totalDuration !== undefined) {
                setTotalHours(totalDuration);
            }
        } catch (error) {
            console.error('Error fetching hourly data:', error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchSessionData();
    }, []);

    // Toggle between dollars and BB
    const toggleMetric = () => {
        setMetricType(metricType === 'dollars' ? 'bb' : 'dollars');
    };

    // Custom tooltip component
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const sessionData = payload[0].payload;
            const isPositive = metricType === 'dollars' 
                ? sessionData.cum_dollars_per_hour >= 0 
                : sessionData.cum_bb_per_hour >= 0;
            
            const perSessionValue = metricType === 'dollars' 
                ? sessionData.dollars_per_hour 
                : sessionData.bb_per_hour;
                
            const cumulativeValue = metricType === 'dollars' 
                ? sessionData.cum_dollars_per_hour 
                : sessionData.cum_bb_per_hour;
            
            const prefix = metricType === 'dollars' ? '$' : '';
            const suffix = metricType === 'bb' ? ' BB/hr' : '/hr';
                
            return (
                <div className="bg-gray-700 p-3 rounded-md shadow-md border border-gray-500 text-sm">
                    <p className="font-medium">{sessionData.date}</p>
                    <p className={`${perSessionValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        Session: {prefix}{perSessionValue.toFixed(2)}{suffix}
                    </p>
                    <p className={`${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        Average: {prefix}{cumulativeValue.toFixed(2)}{suffix}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Get the current average based on metric type
    const getCurrentAvg = () => {
        return metricType === 'dollars' ? latestAvg.dollars : latestAvg.bb;
    };

    return (
        <motion.div 
            className="bg-gray-900 rounded-lg overflow-hidden w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            key={metricType}
        >
            {/* Card header */}
            <div className="p-6 border-b border-gray-700 flex justify-between items-start min-h-[100px]">
                <h2 className="text-2xl font-semibold text-white">
                    {metricType === 'dollars' ? 'Hourly Rate ($)' : 'Hourly Rate (BB)'}
                </h2>
                
                {/* Average Rate in Top Right */}
                {!isLoading && sessionData.length > 0 && (
                    <motion.div 
                        className="flex flex-col items-end"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        <span className="text-xs uppercase tracking-wider text-gray-400">
                            Average Rate
                        </span>
                        <span className={`text-xl font-bold ${getCurrentAvg() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {metricType === 'dollars' 
                                ? `$${latestAvg.dollars.toFixed(2)}/hr`
                                : `${latestAvg.bb.toFixed(2)} BB/hr`
                            }
                        </span>
                    </motion.div>
                )}
            </div>
            
            {/* Card content - the chart */}
            <div className="p-6">
                <div className="h-80">
                    {isLoading ? (
                        <motion.div 
                            className="flex items-center justify-center h-full"
                            initial={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key="loading"
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </motion.div>
                    ) : sessionData.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            key={`chart-${metricType}`}
                            className="h-full w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart 
                                    data={sessionData} 
                                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                >
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
                                            const interval = sessionData.length > 50 ? 10 : sessionData.length > 20 ? 5 : 2;
                                            return sessionData
                                                .filter(item => item.count % interval === 0 || item.count === 1 || item.count === sessionData.length)
                                                .map(item => item.count);
                                        })()}
                                    />
                                    
                                    {/* Y-axis with light text */}
                                    <YAxis 
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fill: "#9CA3AF" }}
                                        tickFormatter={(value) => metricType === 'dollars' ? `$${value}` : `${value}`}
                                    />
                                    
                                    {/* Tooltip */}
                                    <Tooltip content={<CustomTooltip />} cursor={false} />
                                    
                                    {/* Main line - cumulative hourly rate */}
                                    <Line 
                                        type="linear" 
                                        dataKey={metricType === 'dollars' ? 'cum_dollars_per_hour' : 'cum_bb_per_hour'} 
                                        stroke="#60A5FA" 
                                        strokeWidth={2.5}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400 text-lg">No hourly data to show</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Card footer - stats and toggle button */}
            <div className="p-6 border-t border-gray-700 flex justify-between items-center">
                {/* Toggle Button in Bottom Left */}
                <button
                    onClick={toggleMetric}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                >
                    <HiArrowsRightLeft className="h-4 w-4" />
                    Show {metricType === 'dollars' ? 'BB/Hour' : '$/Hour'}
                </button>
                
                <div className="text-sm text-gray-400">
                    <span>Total time played: {totalHours.toFixed(1)} hours</span>
                </div>
            </div>
        </motion.div>
    );
}