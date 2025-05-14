import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBar";
import { logoutUser } from "../services/authService";
import { useUser } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaMoon, FaShieldAlt, FaUserCog } from "react-icons/fa";
import { motion } from "framer-motion";
import supabase from "../supabase";

// Reusable motion button component with click animation
const AnimatedButton = ({ onClick, className, children }) => (
    <motion.button
      onClick={onClick}
      className={className}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );

const Settings = () => {
    const navigate = useNavigate();
    const { clearUser } = useUser();
    const { profile: user, loading } = useUser();
    const [resetMessage, setResetMessage] = useState({ message: "", type: "" }); // For feedback

    useEffect(() => {
        if (user) {
          console.log('User profile:', user);
        }
    }, [user]);  // This ensures it only logs when user changes
      
    
    const handleLogout = async () => {
        try {
            await logoutUser(); // Call the logout API
            clearUser();
            navigate("/login"); // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handlePasswordResetRequest = async () => {
        const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            console.error("Error sending password reset email:", error);
            setResetMessage({ message: error.message || "Failed to send password reset email.", type: "error"});
        } else {
            setResetMessage({
                message: `Password reset email sent to ${user.email}!`,
                type: "success"
            });

            // Clear the message after 5 seconds
            setTimeout(() => {
                setResetMessage({ message: "", type: "" });
            }, 5000);
        }
    }

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
                className="ml-16 w-full p-6 flex justify-center items-center ml-40"
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

                    {/* Show reset status message if any */}
                    {resetMessage.message && (
                        <motion.div 
                            className={`mb-6 p-4 rounded-lg ${
                                resetMessage.type === 'success' 
                                    ? 'bg-green-900/30 border border-green-700 text-green-400' 
                                    : 'bg-red-900/30 border border-red-700 text-red-400'
                            }`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {resetMessage.message}
                        </motion.div>
                    )}
                    
                    <div className="space-y-6">
                        {/* Security Section */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-indigo-400 text-sm uppercase tracking-wider mb-4">Security</h2>
                            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                <AnimatedButton
                                    className="w-full flex items-center justify-between text-gray-200 hover:text-white transition-colors"
                                    onClick={handlePasswordResetRequest}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaShieldAlt className="text-gray-400" />
                                        <span>Change Password</span>
                                    </div>
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </AnimatedButton>
                            </div>
                        </motion.section>
                        
                        {/* Account Section */}
                        <motion.section variants={itemVariants}>
                            <h2 className="text-indigo-400 text-sm uppercase tracking-wider mb-4">Account</h2>
                            <div className="bg-gray-750 rounded-lg p-4 border border-gray-700">
                                <AnimatedButton
                                    className="w-full flex items-center justify-between text-gray-200 hover:text-white transition-colors"
                                    onClick={() => navigate("/settings/edit-profile")}
                                >
                                    <div className="flex items-center gap-3">
                                        <FaUserCog className="text-gray-400" />
                                        <span>Edit Profile</span>
                                    </div>
                                    <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </AnimatedButton>
                            </div>
                        </motion.section>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Settings;