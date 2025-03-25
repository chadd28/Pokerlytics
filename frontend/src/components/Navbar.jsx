import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function Navbar() {
  const [scrollProgress, setScrollProgress] = useState(0)
  
  // Handle scroll effect for navbar with smooth transition
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress as a value between 0 and 1
      const progress = Math.min(window.scrollY / 100, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity and blur based on scroll progress
  const bgOpacity = Math.min(0.85 * scrollProgress, 0.85);
  const blurValue = Math.min(8 * scrollProgress, 8);
  
  return (
    <motion.nav 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 font-avenir`}
      style={{
        background: `rgba(30, 30, 30, ${bgOpacity})`, // Solid color with dynamic opacity
        backdropFilter: `blur(${blurValue}px)`,
        padding: `${scrollProgress > 0.5 ? '0.75rem' : '1.5rem'} 0`,
        boxShadow: scrollProgress > 0.5 ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/pokerlytics-icon.png" 
              alt="Pokerlytics Logo" 
              className="h-8 w-auto mr-2" 
            />
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-white text-xl md:text-2xl font-bold"
            >
              Pokerlytics
            </motion.span>
          </Link>
          
          {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/" className="text-white hover:text-blue-300 transition duration-300">
              Home
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/product" className="text-white hover:text-blue-300 transition duration-300">
              Product
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link to="/contact" className="text-white hover:text-blue-300 transition duration-300">
              Contact
            </Link>
          </motion.div>
        </div>
        
        {/* Call to Action Buttons */}
        <div className="flex items-center space-x-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/login" className="text-white hover:text-blue-300 transition duration-300">
              Log in
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar