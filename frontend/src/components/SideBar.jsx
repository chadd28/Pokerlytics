import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChartBar, FaUser, FaCog } from 'react-icons/fa';
import { LuNotebookPen } from "react-icons/lu";
import { useUser } from '../context/userContext';

export default function Sidebar() {
  const location = useLocation();
  const { profile: user, loading } = useUser();
  
  useEffect(() => {
    if (user) {
      console.log('User profile:', user);
    }
  }, [user]);  // This ensures it only logs when user changes
  
  /* TAILWIND TIP #1: Fixed width for icon-only sidebar */
  const sidebarClasses = `
    w-40 h-screen bg-gradient-to-b from-gray-800 to-gray-700 
    text-white flex flex-col items-center
    fixed z-10 left-0 top-0 shadow-lg
  `;

  /* nav items with icons and text */
  const NavItem = ({ to, icon, text }) => {
    const isActive = location.pathname === to;
    
    return (
      <li className="w-full flex px-1 mb-1">
        <Link 
          to={to} 
          className={`
            flex items-center p-3 rounded-lg w-full
            transition-all duration-100 ease-in-out
            hover:bg-gray-800 
            group
          `}
        >
          <div className={`
            text-lg flex items-center justify-center
            transition-all duration-200
            ${isActive 
              ? 'text-indigo-400' 
              : 'text-gray-400'
            }
            mr-4
          `}>
            {icon}
          </div>
            <span className={`
              ${isActive ? 'font-semibold text-white' : 'font-normal text-gray-300'}
            `}>
              {text}
          </span>
        </Link>
      </li>
    );
  };
  
  return (
    <div className={sidebarClasses}>
        {/* Logo header in top centered, with text*/}
        <Link className="py-3 w-full flex items-center justify-center border-b border-gray-700" to={'/dashboard'}>
            <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-white bg-opacity-10 shadow-sm mr-3">
                <img src="/pokerlytics-icon.png" alt="Pokerlytics Logo" className="w-full h-full object-cover" />
            </div>
            <span className='font-semibold text-lg tracking-tight text-white'>Pokerlytics</span>
        </Link>

        {/* Navigation - centered icons */}
        <nav className="w-full flex-1">
            <ul className="space-y-4 flex flex-col items-center pt-4">
            <NavItem to="/dashboard" icon={<FaHome />} text="Dashboard" />
            <NavItem to="/sessions" icon={<LuNotebookPen />} text="Sessions" />
            <NavItem to="/sessions-graph" icon={<FaChartBar />} text="Graphs" />
            <NavItem to="/user-profile" icon={<FaUser />} text="Profile" />
            <NavItem to="/settings" icon={<FaCog />} text="Settings" />
            </ul>
        </nav>

        {/* User Avatar with name */}
        <div className="py-4 px-4 w-full border-t border-gray-700">
            <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium mr-3">
                  {user?.firstName?.[0] || ''}
                </div>
                <div className="flex flex-col">
                  {loading ? (
                    <span className="text-sm text-gray-400">Loading...</span>
                  ) : (
                    <span className="text-sm font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>
                  )}
                </div>
            </div>
        </div>
    </div>
    );
}