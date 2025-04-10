import { useState, useEffect } from 'react';
import SessionCard from '../components/SessionCard';
import { getUserSessions } from '../services/sessionService';
import Sidebar from '../components/SideBar';
import { motion } from 'framer-motion';
import { FaPlus, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const groupSessionsByMonth = (sessions) => {
  const monthMapping = {};

  sessions.forEach(session => {                 // input is array of session objects
    const date = new Date(session.start_time);
    // Create a key in format "YYYY-MM" (e.g. "2025-04") for sorting purposes
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    // Initialize values : lists for this month if it doesn't exist
    if (!monthMapping[monthKey]) {
      monthMapping[monthKey] = {
        label: new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString('default', { month: 'long', year: 'numeric' }),
        sessions: []
      };
    }
    // Add session to the corresponding month's list
    monthMapping[monthKey].sessions.push(session);
  })

  // Convert to array of objects with label: and sessions: and sort by date (newest first)
  return Object.keys(monthMapping).sort((a, b) => b.localeCompare(a)).map(key => monthMapping[key]);
}

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getUserSessions();
        setSessions(data.sessions);

        // group sessions by month
        if (data.sessions.length > 0) {
          setGroupedSessions(groupSessionsByMonth(data.sessions));
        }
        
      } catch (err) {
        setError('Failed to load user sessions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <main className="ml-16 w-full p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Your Sessions</h1>
            <button 
              onClick={() => navigate('/new-session')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2 flex items-center"
            >
              <FaPlus className="mr-2" /> New Session
            </button>
          </div>

          {/* display error if any */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center p-10">
              <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="sessions-list space-y-6">
              {groupedSessions && groupedSessions.length > 0 ? (
                // Map through the grouped sessions and display them
                groupedSessions.map((monthGroup, index) => (
                  <div key={index} className="month-group">
                    {/* Month header and sessions */}
                    <div className="month-header mb-2">
                      <h2 className="text-xl font-semibold text-indigo-300 flex items-center gap-2 px-2 py-1 border-b border-indigo-800/50">
                        {/* <FaCalendarAlt className="text-indigo-400" /> OPTIONAL ICON */} 
                        {monthGroup.label}
                      </h2>
                    </div>
                    <div className="session-cards space-y-3">
                      {monthGroup.sessions.map((session) => (
                        <SessionCard 
                          key={session.session_id} 
                          session={session} 
                        />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-gray-800 rounded-lg p-8 text-center">
                  <p className="text-gray-400 mb-4">No sessions found. Start tracking your poker games!</p>
                  <button 
                    onClick={() => navigate('/new-session')}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2"
                  >
                    Create Your First Session
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default Sessions;