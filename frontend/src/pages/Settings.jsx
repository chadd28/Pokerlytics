import React, { useState } from "react";
import Sidebar from "../components/SideBar";
import { logoutUser } from "../services/authService";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaMoon, FaShieldAlt, FaUserCog } from "react-icons/fa";
import { motion } from "framer-motion";

const Settings = () => {
    const [darkMode, setDarkMode] = useState(true);
    const navigate = useNavigate();
    const { clearUser } = useUser();

    
    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the logout API
            clearUser();
            navigate("/login"); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                duration: 0.01,
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
    };
    

    return (
        <div className="min-h-screen bg-gray-900 flex">
            <Sidebar />
            
            {/* Main Content - Offset for sidebar */}
            <motion.div 
                className="ml-16 w-full p-6 flex justify-center items-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div 
                    className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-700"
                    variants={itemVariants}
                >
                    <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-medium text-white">Settings</h1>
                        <button 
                            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200 px-3 py-1 rounded-md hover:bg-red-900 hover:bg-opacity-20"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt /> 
                            <span className="text-sm">Logout</span>
                        </button>
                    </motion.div>
                    
                    <div className="space-y-6">
                        {/* Appearance Section */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-indigo-400 text-sm uppercase tracking-wider mb-4">Appearance</h2>
                            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FaMoon className="text-gray-400" />
                                        <span className="text-gray-200">Dark Mode</span>
                                    </div>
                                    <button 
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${darkMode ? 'bg-indigo-500' : 'bg-gray-600'}`}
                                        onClick={() => setDarkMode(!darkMode)}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </motion.section>
                        
                        {/* Security Section */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-indigo-400 text-sm uppercase tracking-wider mb-4">Security</h2>
                            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                <button className="w-full flex items-center justify-between text-gray-200 hover:text-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaShieldAlt className="text-gray-400" />
                                        <span>Change Password</span>
                                    </div>
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </motion.section>
                        
                        {/* Account Section */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-indigo-400 text-sm uppercase tracking-wider mb-4">Account</h2>
                            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                <button className="w-full flex items-center justify-between text-gray-200 hover:text-white transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaUserCog className="text-gray-400" />
                                        <span>Edit Profile</span>
                                    </div>
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </motion.section>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Settings;