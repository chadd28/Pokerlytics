import React from 'react';
import { FaClock, FaMapMarkerAlt, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function SessionCard({ session }) {
  const navigate = useNavigate();
  
  // Parse timestamps into Date objects
  const startTime = session.start_time ? new Date(session.start_time) : null;
  const endTime = session.end_time ? new Date(session.end_time) : null;
  
  // Get day of week and date for the left side display
  const getDayOfWeek = (date) => {
    if (!date) return 'N/A';
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    return days[date.getDay()];
  };

  const getDateNumber = (date) => {
    if (!date) return 'N/A';
    return date.getDate().toString().padStart(2, '0');
  };

  // Calculate duration only if both times exist
  let duration = 'N/A';
  if (startTime && endTime) {
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    
    if (durationHours >= 0) {
      duration = durationHours.toFixed(2) + 'h';
    } else {
      duration = '?h';
    }
  }

  // Format the profit/loss with proper sign
  const formattedProfit = session.profit_loss >= 0 
    ? `+$${session.profit_loss.toFixed(2)}` 
    : `-$${Math.abs(session.profit_loss).toFixed(2)}`;

  // Handle session click to navigate to detail page
  const handleSessionClick = () => {
    navigate(`/sessions/${session.id}`);
  };

  
  return (
    <div className="bg-gray-800 rounded-lg shadow flex items-center mb-3 overflow-hidden hover:bg-gray-750 transition-colors">
      {/* Date column */}
      <div className="bg-gray-700 p-3 flex flex-col items-center justify-center min-w-[60px]">
        <span className="text-xs font-bold text-indigo-400">{startTime ? getDayOfWeek(startTime) : 'N/A'}</span>
        <span className="text-xl font-bold text-white">{startTime ? getDateNumber(startTime) : 'N/A'}</span>
      </div>
      
      {/* Main content */}
      <div className="flex-grow py-2 px-3">
        <h3 className="text-md font-medium text-white truncate">{session.game_type || 'Poker Session'}</h3>
        <div className="flex flex-wrap text-xs text-gray-400 mt-1">
          <div className="flex items-center mr-4">
            <FaClock className="mr-1 text-indigo-400" size={10} />
            <span>{duration}</span>
          </div>
          {session.location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-indigo-400" size={10} />
              <span className="truncate max-w-[120px]">{session.location}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Profit/Loss display */}
      <div className={`px-4 py-3 font-semibold ${session.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {formattedProfit}
      </div>
      
      {/* Navigate button */}
      <button 
        onClick={handleSessionClick} 
        className="h-full px-3 bg-gray-700 hover:bg-indigo-600 transition-colors flex items-center"
      >
        <FaChevronRight className="text-gray-300" />
      </button>
    </div>
  );
}

export default SessionCard;