import React from 'react';

/**
 * StatCard - A clean, modern component for displaying statistics
 * 
 * @param {Object} props
 * @param {string} props.label - Label text to display
 * @param {string|number} props.value - Value to display
 * @param {string} props.defaultValue - Default value if value is undefined
 * @param {string} props.className - Additional CSS classes to apply
 * @param {function} props.onClick - Optional click handler
 */
const StatCard = ({ 
  label, 
  value, 
  defaultValue = '0', 
  className = '',
  onClick
}) => {
  return (
    <div 
      className={`
        bg-gray-700/50 hover:bg-gray-700/80 
        transition-all duration-300 p-5 rounded-xl 
        border border-gray-600/40
        ${onClick ? 'cursor-pointer transform hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Modern centered layout with better spacing */}
      <div className="flex flex-col items-center text-center">
        {/* Value first for visual hierarchy */}
        <p className="text-white text-3xl font-bold tracking-tight mb-2">
          {value || defaultValue}
        </p>
        
        {/* Label below with subtle styling */}
        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          {label}
        </h4>
      </div>
    </div>
  );
};

export default StatCard;