import React, { useEffect, useState } from "react";
import { getUserProfile } from '../services/authService';
import SideBar from '../components/SideBar';
import AllSessionsGraph from '../components/graphs/AllSessionsGraph';
import StatsSummaryCards from "../components/dashboard/StatsSummaryCards";
import RecentSessions from '../components/dashboard/RecentSessions';

const Dashboard = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // fetch user data
    useEffect(() => {
        const fetchProfile = async () => {
          try {
            setLoading(true);
            setError(null);
            
            const data = await getUserProfile();
            setProfile(data.user);
            
          } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
          } finally {
            setLoading(false);
          }
        };
        
        fetchProfile();
    }, []);

    return (
        <div className="flex h-screen">
            <SideBar />

            <div className="flex-1 bg-gray-900 p-6 overflow-auto ml-40">
                <h1 className="text-3xl font-semibold text-white mb-6">Dashboard</h1>
                
                {/* Stats Cards Row */}
                <StatsSummaryCards />
                
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                    <div className="lg:w-1/2">
                        <AllSessionsGraph height={300} width="100%" />
                    </div>
                    <div className="lg:w-1/2">
                        <RecentSessions />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;