import React from 'react';
import { motion } from 'framer-motion';

/**
 * StatCard - A clean, modern component for displaying statistics
 * 
 * @param {Object} props
 * @param {string} props.label - Label text to display
 * @param {string|number} props.value - Value to display
 * @param {string|ReactNode} props.defaultValue - Default value if value is undefined
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
      <div className="flex flex-col items-center text-center">
        {/* Animate value when it changes */}
        {value ? (
          <motion.p
            key={value}
            initial={{ opacity: 0}}
            animate={{ opacity: 1}}
            transition={{ duration: 0.3 }}
            className="text-white text-3xl font-bold tracking-tight mb-2"
          >
            {value}
          </motion.p>
        ) : (
          <div className="text-white text-3xl font-bold tracking-tight mb-2">
            {defaultValue}
          </div>
        )}

        <h4 className="text-xs text-gray-400 uppercase tracking-widest font-medium">
          {label}
        </h4>
      </div>
    </div>
  );
};

export default StatCard;
