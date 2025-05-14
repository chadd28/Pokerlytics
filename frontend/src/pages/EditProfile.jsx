import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import Sidebar from "../components/SideBar";
import supabase from "../supabase";
import { useUser } from "../context/userContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { profile, updateUser } = useUser();
  
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load initial values
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Update the user profile in your database
      const { error } = await supabase
        .from('profiles') // Adjust based on your table name
        .update({ 
          display_name: displayName,
          first_name: firstName,
          last_name: lastName
        })
        .eq('user_id', profile.id);

      if (error) throw error;

      // Then update the context by refetching the profile
      await updateUser();
      
      // show success message
      setMessage({
        type: "success",
        text: "Profile updated successfully!"
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar />
      
      <motion.main
        className="ml-40 w-full p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <button
              onClick={() => navigate("/settings")}
              className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              <span>Back to Settings</span>
            </button>
          </div>
          
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center mr-4">
                <FaUser className="text-indigo-400 text-xl" />
              </div>
              <h1 className="text-2xl font-semibold text-white">Edit Profile</h1>
            </div>
            
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg ${
                  message.type === "success"
                    ? "bg-green-900/30 border border-green-700 text-green-400"
                    : "bg-red-900/30 border border-red-700 text-red-400"
                }`}
              >
                {message.text}
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter first name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter last name"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter display name"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <motion.button
                  type="button"
                  onClick={() => navigate("/settings")}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default EditProfile;