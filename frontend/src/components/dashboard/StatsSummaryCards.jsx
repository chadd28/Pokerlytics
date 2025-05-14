import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StatCard from '../StatCard';
import { getSessionsGraphData } from '../../services/sessionService';

// last 5 sessions, add session button
// important stats:
// total time played, total profit, total sessions, etc 

const StatsSummaryCards = () => {
    const [stats, setStats] = useState({
        totalProfit: 0,
        totalSessions: 0,
        totalHours: 0,
        hourlyRate: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data when component mounts
    useEffect(() => {
        const fetchSessionData = async () => {
        try {
            setIsLoading(true);
            // Call the Python analytics endpoint
            const data = await getSessionsGraphData();
            
            // Extract different parts of the analytics response from python code
            const { sessions, totalProfit, totalDuration } = data;

            // update state with the data
            setStats({
                totalProfit: totalProfit,
                totalSessions: sessions.length,
                totalHours: totalDuration,
                hourlyRate: totalProfit / totalDuration
            })
        } catch (error) {
            console.error('Error fetching session data:', error);
        } finally {
            setIsLoading(false);
        }
        };

        fetchSessionData();
    }, []);

    // Loading spinner component
    const LoadingSpinner = () => (
        <div className="flex justify-center items-center h-[36px]">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    // Format values for the stat cards
    const formattedStats = [
        {
            label: 'Total Profit',
            value: isLoading ? null : `$${stats.totalProfit.toFixed(2)}`,
            className: stats.totalProfit >= 0 ? 'border-green-500/30' : 'border-red-500/30'
        },
        {
            label: 'Sessions Played',
            value: isLoading ? null : `${stats.totalSessions}`,
            className: 'border-blue-500/30'
        },
        {
            label: 'Hours Played',
            value: isLoading ? null : `${stats.totalHours.toFixed(1)}`,
            className: 'border-purple-500/30'
        },
        {
            label: 'Hourly Rate',
            value: isLoading ? null : `$${stats.hourlyRate.toFixed(2)}/hr`,
            className: stats.hourlyRate >= 0 ? 'border-green-500/30' : 'border-red-500/30'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {formattedStats.map((stat, index) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                    <StatCard
                        label={stat.label}
                        value={stat.value}
                        defaultValue={<LoadingSpinner />}
                        className={stat.className}
                    />
                </motion.div>
            ))}
        </div>
    );
};

export default StatsSummaryCards;