import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile } from '../services/authService';
import { getSessionsGraphData } from '../services/sessionService';
import Sidebar from '../components/SideBar';
import StatCard from '../components/StatCard';

function ProfileInfo() {
  const [profile, setProfile] = useState(null);
  const [sessionStats, setSessionStats] = useState(null);

  const [profileLoading, setProfileLoading] = useState(true);   // seperate loading state for profile
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        setError(null);
        
        const data = await getUserProfile();
        setProfile(data.user);
        
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  // Separate effect for fetching session stats
  useEffect(() => {
    const fetchSessionStats = async () => {
      try {
        setStatsLoading(true);
        
        const data = await getSessionsGraphData();
        setSessionStats(data);
        
      } catch (err) {
        console.error('Error fetching session stats:', err);
        // We don't set the main error here to still allow profile to display
      } finally {
        setStatsLoading(false);
      }
    };
    
    fetchSessionStats();
  }, []);
  
  // Render streak information
  const renderStreakInfo = () => {
    if (statsLoading) {
      return (
        <div className="flex items-center space-x-2 bg-gray-700/30 rounded-lg p-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-600"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      );
    }
    
    if (!sessionStats || !sessionStats.currentStreak) {
      return (
        <div className="text-center py-4 text-gray-400">
          No streak data available
        </div>
      );
    }
    
    const [streakCount, streakType] = sessionStats.currentStreak;
    const isWinStreak = streakType === 'Win';
    
    return (
      <motion.div 
        className={`flex items-start p-4 rounded-lg ${
          isWinStreak ? 'bg-green-900/20 border border-green-800/40' : 'bg-red-900/20 border border-red-800/40'
        }`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
          isWinStreak ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'
        } mr-4`}>
          <span className="text-xl">{isWinStreak ? '🔥' : '❄️'}</span>
        </div>
        
        <div className="text-left">
          <h4 className={`font-bold text-lg ${isWinStreak ? 'text-green-400' : 'text-red-400'}`}>
            {streakCount} {streakType} streak
          </h4>
          <p className="text-gray-300 text-sm">
            {isWinStreak 
              ? "You're on fire! Keep up the great play." 
              : "Hang in there. Your luck will turn around soon."}
          </p>
        </div>
      </motion.div>
    );
  };
  
  if (profileLoading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="ml-16 flex items-center justify-center w-full p-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        <div className="ml-16 w-full p-6">
          <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      <main className="ml-16 w-full p-6 ml-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="text-2xl font-bold text-white mb-6">My Pokeryltics</h1>
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-800 to-purple-700 
                             flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-2xl font-bold text-white">
                    {profile?.firstName?.[0] || profile?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-blue-200">{profile?.email}</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Player Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard 
                        label="Games Played" 
                        value={profile?.stats?.gamesPlayed} 
                        defaultValue="0" 
                    />
                    <StatCard 
                        label="Win Rate" 
                        value={`${(Number(profile?.stats?.winRate || 0).toFixed(2))}%`} 
                        defaultValue="0%" 
                    />
                </div>
              </div>
              <div className="border-t border-gray-700/50 pt-6">
                <h3 className="text-lg font-medium text-white mb-3">Recent Activity</h3>
                <div className="mb-4">
                  {renderStreakInfo()}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProfileInfo;