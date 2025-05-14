import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import supabase from '../supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we're on the reset password page with the recovery token
    const hash = window.location.hash;
    if (!hash || !hash.includes('type=recovery')) {
      setMessage({
        text: 'Invalid password reset link. Please request a new one.',
        type: 'error'
      });
      // Don't automatically redirect if there's an error
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters', type: 'error' });
      return;
    }
    
    if (password !== confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      // Update user's password using Supabase
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setMessage({
        text: 'Password updated successfully! Redirecting to login...',
        type: 'success'
      });
      
      // Only redirect after successful password update
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({
        text: error.message || 'Failed to reset password. Please try again.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Pokerlytics</h1>
          <p className="text-blue-400 mt-2">Reset your password</p>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-700">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-900/30 border border-green-700 text-green-400' 
                : 'bg-red-900/30 border border-red-700 text-red-400'
            }`}>
              {message.text}
            </div>
          )}
          
          {/* Only show the form if there's no error with the recovery token */}
          {(!message.text || message.type !== 'error' || !message.text.includes("Invalid password reset link")) && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter new password"
                  disabled={isLoading || message.type === 'success'}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm new password"
                  disabled={isLoading || message.type === 'success'}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading || message.type === 'success'}
                className={`w-full py-2 px-4 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors ${
                  isLoading || message.type === 'success' ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              Return to Login
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;