import React from 'react';

/**
 * SessionSummary component displays a summary of poker session stats
 * @param {Object} props.formData - The form data containing session details
 */

const SessionSummary = ({ formData }) => {
  // Only proceed if we have both buy-in and cash-out values
  if (!formData?.buyIn || !formData?.cashOut) {
    return null;
  }

  // Calculate profit/loss
  const buyIn = parseFloat(formData.buyIn) || 0;
  const cashOut = parseFloat(formData.cashOut) || 0;
  const profit = cashOut - buyIn;

  // Calculate duration
  const startTime = formData.start_time ? new Date(formData.start_time) : null;
  const endTime = formData.end_time ? new Date(formData.end_time) : null;
  
  let duration = '?';
  let durationHours = 0;
  let hourlyRate = null;
  let bbPerHour = null;
  
  if (startTime && endTime && endTime > startTime) {
    const durationMs = endTime.getTime() - startTime.getTime();
    durationHours = durationMs / (1000 * 60 * 60);
    duration = durationHours.toFixed(2) + 'h';
    
    // Calculate hourly rate
    hourlyRate = profit / durationHours;
    
    // Calculate BB/hr if big blind is available
    const bbSize = parseFloat(formData.additional_info?.bb);
    if (bbSize > 0) {
      bbPerHour = profit / durationHours / bbSize;
    }
  }

  return (
    <div className="mb-6 p-4 rounded-lg bg-gray-700/50 border border-gray-600">
      <h3 className="text-lg font-medium text-white mb-3">Session Summary</h3>
      
      <div className="flex flex-wrap gap-4">
        {/* Profit/Loss */}
        <div className="flex-1 min-w-[120px]">
          <p className="text-sm text-gray-400 mb-1">Result</p>
          <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : '-'}${Math.abs(profit).toFixed(2)}
          </p>
        </div>
        
        {/* Duration */}
        <div className="flex-1 min-w-[120px]">
          <p className="text-sm text-gray-400 mb-1">Duration</p>
          <p className="text-xl font-bold text-white">{duration}</p>
        </div>
        
        {/* $/hr */}
        <div className="flex-1 min-w-[120px]">
          <p className="text-sm text-gray-400 mb-1">$/hr</p>
          <p className={`text-xl font-bold ${hourlyRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {hourlyRate !== null 
              ? `${hourlyRate >= 0 ? '+' : '-'}$${Math.abs(hourlyRate).toFixed(2)}`
              : 'N/A'}
          </p>
        </div>
        
        {/* BB/hr - only show if blinds are set */}
        {bbPerHour !== null && (
          <div className="flex-1 min-w-[120px]">
            <p className="text-sm text-gray-400 mb-1">BB/hr</p>
            <p className={`text-xl font-bold ${bbPerHour >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {bbPerHour >= 0 ? '+' : '-'}{Math.abs(bbPerHour).toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionSummary;