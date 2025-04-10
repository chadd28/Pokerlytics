import React, { useEffect, useState } from "react";
import { getUserProfile } from '../services/authService';
import SideBar from '../components/SideBar';


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


            <div class="flex-1 bg-gray-900 p-6">
                <h1 class="text-2xl font-semibold">Main Content</h1>
                <p class="mt-2 text-gray-700">This is where your content goes.</p>
            </div>


        </div>
    );
};

export default Dashboard;


