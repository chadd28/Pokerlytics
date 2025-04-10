import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../services/authService';


function Register() {
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);
    
    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };
  
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (terms.checked === false) {
            setError('Please agree to the terms and conditions.');
            return;
        }
        
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Please fill in all required fields.');
        return;
        }
        
        if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
        }
        
        if (formData.password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
        }
        
        // Clear any previous errors
        setError('');

        try {
            // Use the registerUser function from authService
            await registerUser(formData.email, formData.password, formData.firstName, formData.lastName);
            
            setRegistrationComplete(true);
            setIsLoading(false)
          } catch (error) {
            setError(error.message || 'Registration failed. Please try again.');
          } finally {
            setIsLoading(false);
          } 

    };
  
    return (
        <div className="min-h-screen bg-gray-900 flex">
        {/* Left side - Registration form */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 flex items-center justify-center p-6"
        >
            <div className="max-w-md w-full">
            
            {/* conditional rendering of confirmation message */}
            {registrationComplete && (
                <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-green-900/50 border border-green-500 text-green-200 rounded-md text-sm"
                >
                Registration successful! Please check your email to verify your account.
                </motion.div>
            )}
   
            
            {/* Header section */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
            </div>
            
            {/* Error message */}
            {error && (
                <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-900/50 border border-red-500 text-red-200 rounded-md text-sm"
                >
                {error}
                </motion.div>
            )}
            
            {/* Registration Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Name fields (side by side) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                    First Name
                    </label>
                    <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent transition-all duration-200"
                    placeholder="John"
                    />
                </div>
                
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                    Last Name
                    </label>
                    <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent transition-all duration-200"
                    placeholder="Doe"
                    />
                </div>
                </div>
                
                {/* Email input field */}
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                />
                </div>
                
                {/* Password input field */}
                <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
                </div>
                
                {/* Confirm Password field */}
                <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password
                </label>
                <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                            text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                />
                </div>
                
                {/* Terms and conditions */}
                <div className="flex items-start">
                <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 mt-1 text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                    By creating an account, you agree to our{' '}
                    <Link to="/terms" className="text-blue-400 hover:text-blue-300">
                    Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-blue-400 hover:text-blue-300">
                    Privacy Policy
                    </Link>
                </label>
                </div>
                
                {/* Submit button */}
                <div>
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    duration: 0.1
                    }}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg 
                            text-white font-medium shadow-md shadow-blue-500/20 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                            focus:ring-offset-gray-900"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
                </div>
            </form>
            
            {/* Sign in link */}
            <div className="mt-8 text-center text-sm">
                <p className="text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign in
                </Link>
                </p>
            </div>
            </div>
        </motion.div>
        
        {/* Right side - Image (same as login page) */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block lg:w-1/2 relative overflow-hidden"
        >

            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
            <div className="absolute inset-0 flex flex-col justify-center px-12 z-20">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-4xl font-bold text-white mb-4"
            >
                Start Your Winning Journey
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-xl text-gray-300 max-w-md"
            >
                Join thousands of players who have improved their win rates with our data-driven insights.
            </motion.p>
            
            {/* Feature bullets */}
            <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-6 space-y-2"
            >
                <li className="flex items-center text-gray-300">
                <span className="text-blue-400 mr-2">✓</span> Beautiful visualizations
                </li>
                <li className="flex items-center text-gray-300">
                <span className="text-blue-400 mr-2">✓</span> Performance tracking
                </li>
                <li className="flex items-center text-gray-300">
                <span className="text-blue-400 mr-2">✓</span> AI-powered recommendations
                </li>
            </motion.ul>
            </div>
            
            {/* Background image - same as login for consistency */}
            <img 
            src="dashboard-preview.png" 
            alt="Poker analytics dashboard" 
            className="object-cover h-full w-full"
            />
        </motion.div>
        </div>
    );
}

export default Register;