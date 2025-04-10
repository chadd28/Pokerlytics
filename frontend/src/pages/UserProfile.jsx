import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserProfile } from '../services/authService';
import Sidebar from '../components/SideBar';
import StatCard from '../components/StatCard';

function ProfileInfo() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getUserProfile();
        setProfile(data.user);
        //console.log(data.user);
        
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-900">
        {/* TAILWIND TIP: Always include sidebar at page root level */}
        <Sidebar />
        
        {/* TAILWIND TIP: ml-16 offsets content by sidebar width (4rem) */}
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
    /* TAILWIND TIP: Page structure - flex container with min-h-screen ensures full height */
    <div className="flex min-h-screen bg-gray-900">
      {/* Sidebar component remains fixed */}
      <Sidebar />

      {/* 
       * TAILWIND TIP: Main content area
       * - ml-16 creates offset equal to sidebar width
       * - w-full ensures content takes remaining width
       * - p-6 adds consistent padding all around
       */}
      <main className="ml-16 w-full p-6">
        {/* 
         * TAILWIND TIP: Animate content with framer-motion
         * Keep animation at content level, not page level
         */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-6xl mx-auto"     // 6xl controls width of content
        >
          {/* Page header with title */}
          <h1 className="text-2xl font-bold text-white mb-6">My Pokeryltics</h1>
          
          {/* 
           * TAILWIND TIP: Card component
           * - bg-gray-800 for dark mode background
           * - rounded-xl for modern rounded corners
           * - shadow-lg for subtle depth
           * - overflow-hidden ensures content respects rounded corners
           */}
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* 
             * TAILWIND TIP: Card header with gradient
             * - bg-gradient-to-r creates horizontal gradient
             * - from-blue-600 to-indigo-700 defines gradient colors
             * - p-6 adds padding inside the header
             */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
              {/* 
               * TAILWIND TIP: Flex layout for profile header
               * - flex aligns items horizontally
               * - items-center vertically centers them
               * - space-x-4 adds horizontal spacing between items
               */}
              <div className="flex items-center space-x-4">
                {/* 
                 * TAILWIND TIP: Avatar component
                 * - w-20 h-20 sets fixed dimensions
                 * - rounded-full creates perfect circle
                 * - ring-4 adds outer ring
                 * - ring-white/20 makes ring semi-transparent white
                 */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-800 to-purple-700 
                             flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-2xl font-bold text-white">
                    {profile?.firstName?.[0] || profile?.email?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                
                {/* Profile information */}
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-blue-200">{profile?.email}</p>
                </div>
              </div>
            </div>
            
            {/* 
             * TAILWIND TIP: Card body
             * - p-6 adds consistent padding
             * - space-y-6 adds vertical spacing between children
             */}
            <div className="p-6 space-y-6">
              {/* Stats section */}
              <div>
                <h3 className="text-lg font-medium text-white mb-3">Player Stats</h3>
                
                {/* 
                 * TAILWIND TIP: Grid layout
                 * - grid divides space into columns
                 * - grid-cols-2 creates 2 equal columns
                 * - gap-4 adds spacing between grid items
                 * - sm:grid-cols-2 makes it responsive (1 column on mobile, 2 on small screens and up)
                 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard 
                        label="Games Played" 
                        value={profile?.stats?.gamesPlayed} 
                        defaultValue="0" 
                    />
                    
                    <StatCard 
                        label="Win Rate" 
                        value={profile?.stats?.winRate} 
                        defaultValue="0%" 
                    />
                </div>
              </div>
              
              {/* 
               * TAILWIND TIP: Recent activity section
               * - border-t creates top border
               * - pt-6 adds padding top to create space from border
               */}
              <div className="border-t border-gray-700/50 pt-6">
                <h3 className="text-lg font-medium text-white mb-3">Recent Activity</h3>
                
                {/* 
                 * TAILWIND TIP: Conditional rendering with placeholder
                 * - text-center centers text when no data
                 * - py-8 adds vertical padding for empty state
                 * - text-gray-500 uses muted text color for empty state
                 */}
                {profile?.recentGames?.length > 0 ? (
                  <ul className="space-y-2">
                    {/* Would map through recent games here */}
                  </ul>
                ) : (
                  <div className="text-center py-8 bg-gray-750 rounded-lg">
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default ProfileInfo;