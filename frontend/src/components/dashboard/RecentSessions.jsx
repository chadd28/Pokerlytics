import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MiniSessionCard from './MiniSessionCard';
import { getUserSessions } from '../../services/sessionService';
import { motion } from 'framer-motion';

function RecentSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentSessions = async () => {
      try {
        setLoading(true);
        const response = await getUserSessions();
        // Check what structure the response has
        console.log('Response from getUserSessions:', response);
        
        // Handle different possible response structures
        const sessionsArray = Array.isArray(response) ? response : 
                             (response.sessions ? response.sessions : 
                             (response.data ? response.data : []));
        
        // Take only the first 5 sessions
        const recentSessions = sessionsArray.slice(0, 5);
        setSessions(recentSessions);
      } catch (err) {
        console.error('Error fetching recent sessions:', err);
        setError('Failed to load recent sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSessions();
  }, []);

  return (
    <motion.div 
      className="bg-gray-800 rounded-lg shadow p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Recent Sessions</h2>
        <Link to="/sessions" className="text-indigo-400 hover:text-indigo-300 text-sm">
          View all
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-4 text-red-400">{error}</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-4 text-gray-400">No sessions found</div>
      ) : (
        <div>
          {sessions.map((session, index) => (
            <motion.div 
              key={session.session_id}
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <MiniSessionCard session={session} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default RecentSessions;