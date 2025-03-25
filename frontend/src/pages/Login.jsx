import { useState } from 'react'; 
import { Link } from 'react-router-dom'; 
import { motion } from 'framer-motion'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Function that runs when the form is submitted
  const handleSubmit = (event) => {
    // Prevent the default form submission behavior (page reload)
    event.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    
    // Here you would typically:
    // 1. Send the login credentials to your backend API
    // 2. Receive a token or session info
    // 3. Store authentication state
    // 4. Redirect to dashboard
    console.log('Login attempted with:', { email, password });
    alert('Login functionality would connect to your backend here.');
  };
  
  return (
    // Main container with dark theme
    <div className="min-h-screen bg-gray-900 flex">
      {/* Left side - Login form */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        {/* Form container */}
        <div className="max-w-md w-full">
          {/* Header section */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Pokerlytics</h2>
            <p className="mt-3 text-gray-400">Welcome back. Let's get you in.</p>
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
          
          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg 
                         text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                         focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            
            {/* Remember me and Forgot password section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-500 focus:ring-blue-500 bg-gray-800 border-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/forgot-password" className="text-blue-400 hover:text-blue-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
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
                Sign in
              </motion.button>
            </div>
          </form>
          
          {/* Sign up link */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      
      {/* Right side - Image */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"   // hidden default, show only on large screen
      >
        {/* Dark overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        
        {/* text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 z-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Elevate Your Poker Game
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-xl text-gray-300 max-w-md"
          >
            Data-driven insights to help you make smarter decisions at the table.
          </motion.p>
        </div>
        
        {/* Background image */}
        <img 
          src="dashboard-preview.png" // template image for now
          alt="Poker analytics dashboard" 
          className="object-cover h-full w-full"
        />
      </motion.div>
    </div>
  );
}

export default Login;