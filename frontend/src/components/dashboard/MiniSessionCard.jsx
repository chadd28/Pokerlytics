import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MiniSessionCard({ session }) {
  const navigate = useNavigate();
  
  // Parse timestamps into Date objects
  const startTime = session.start_time ? new Date(session.start_time) : null;
  
  // Format the profit/loss with proper sign
  const formattedProfit = session.profit_loss >= 0 
    ? `+$${session.profit_loss.toFixed(2)}` 
    : `-$${Math.abs(session.profit_loss).toFixed(2)}`;

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
  
  // Parse additional info
  const additionalInfo = JSON.parse(session.additional_info);
  const sb = additionalInfo.sb || "?";
  const bb = additionalInfo.bb || "?";

  // Handle session click to navigate to detail page
  const handleSessionClick = () => {
    navigate(`/sessions/${session.session_id}`);
  };
  
  return (
    <div 
      onClick={handleSessionClick}
      className="bg-gray-800 rounded shadow flex items-center mb-2 hover:bg-gray-750 transition-colors cursor-pointer overflow-hidden"
    >
      {/* Date column */}
      <div className="bg-gray-700 p-2 flex flex-col items-center justify-center min-w-[40px]">
        <span className="text-xs font-bold text-indigo-400">{startTime ? getDayOfWeek(startTime) : 'N/A'}</span>
        <span className="text-lg font-bold text-white">{startTime ? getDateNumber(startTime) : 'N/A'}</span>
      </div>
      
      <div className="flex-grow p-2">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-white">${sb}/${bb} {session.game_type}</h3>
        </div>
        {session.location && (
          <div className="flex items-center text-xs text-gray-400 mt-1">
            <FaMapMarkerAlt className="mr-1 text-indigo-400" size={8} />
            <span className="truncate max-w-[120px]">{session.location}</span>
          </div>
        )}
      </div>
      
      <div className={`px-2 text-sm font-semibold ${session.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {formattedProfit}
      </div>
    </div>
  );
}

export default MiniSessionCard;