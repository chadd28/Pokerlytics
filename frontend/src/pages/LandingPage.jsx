import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar' 

function LandingPage() {
  const [loaded, setLoaded] = useState(false)
  
  useEffect(() => {
    setLoaded(true)
  }, [])
  
  return (
    <div className="min-h-screen text-gray-800 overflow-hidden">
        {/* Navbar */}
        <Navbar />
        {/* Hero Section with Cinematic Fade-in */}
        <section className="relative bg-gradient-to-r from-blue-700 to-purple-800 text-white py-20">
            {/* Cinematic Overlay that fades away */}
            <motion.div 
            initial={{ opacity: 1 }} 
            animate={{ opacity: 0 }} 
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute inset-0 bg-black z-10"
            />
            
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between relative z-20">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left"
            >
                <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                >
                Elevate Your Poker Game with Data-Driven Insights
                </motion.h1>
                
                <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-xl md:text-1xl mb-8 text-blue-100"
                >
                Analyze your play, identify leaks, and make winning decisions with Pokerlytics
                </motion.p>
                
                <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="flex flex-wrap justify-center md:justify-start gap-4"
                >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link to="/signup" className="px-6 py-3 bg-white text-blue-700 font-medium rounded-lg hover:bg-blue-100 transition duration-300">
                    Get Started
                    </Link>
                </motion.div>
                </motion.div>
            </motion.div>

                {/* Image Section, sliding left to right */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 60 }}
                transition={{ duration: 1, delay: 1.6 }}
                className="md:w-1/2"
            >
                <motion.img 
                src="dashboard-preview.png" 
                alt="Pokerlytics Dashboard Preview" 
                className="rounded-lg shadow-2xl"
                />
            </motion.div>
            </div>
            
        </section>


        {/* Features Section with Staggered Animation */}
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-20 bg-gray-50"
        >
            <div className="container mx-auto px-4">
            <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-center mb-16"
            >
                <span className="text-transparent bg-clip-text bg-gradient-to-r animate-pulse-slow"
                    style={{
                      backgroundImage: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)",
                      backgroundSize: "300% 100%",
                      animation: "gradientFlow 8s ease infinite",
                      WebkitBackgroundClip: "text",
                    }}>
                  Built for Every Player—From Casuals to Pros
                </span>
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                {
                    icon: "📈",
                    title: "Performance Tracking",
                    description: "Monitor your results over time with advanced analytics and visualizations"
                },
                {
                    icon: "🎨",
                    title: "Unmatched Visuals",
                    description: "Our modern interface makes analyzing your game effortless and enjoyable."
                },
                {
                    icon: "📈",
                    title: "Performance Tracking",
                    description: "Monitor your results over time with advanced analytics and visualizations"
                },
                {
                    icon: "📈",
                    title: "Performance Tracking",
                    description: "Monitor your results over time with advanced analytics and visualizations"
                },
                ].map((feature, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white p-8 rounded-xl shadow-lg transition duration-300"
                >
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                </motion.div>
                ))}
            </div>
            </div>
        </motion.section>

        {/* CTA Section with Slide-up Animation */}
        <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white text-center"
        >
            <div className="container mx-auto px-4 max-w-4xl">
            <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6"
            >
                Ready to Take Your Poker Game to the Next Level?
            </motion.h2>
            
            <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl mb-10 text-blue-100"
            >
                Join thousands of players who are making better decisions with Pokerlytics
            </motion.p>
            
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Link to="/signup" className="inline-block py-4 px-10 bg-white text-blue-700 font-bold rounded-lg text-xl hover:bg-blue-100 transition duration-300">
                Start For Free
                </Link>
            </motion.div>
            </div>
        </motion.section>
      
        {/* Footer */}
        <footer className="py-12 bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 mb-8">
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/about" className="hover:text-white transition duration-300">About</Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/contact" className="hover:text-white transition duration-300">Contact</Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/terms" className="hover:text-white transition duration-300">Terms of Service</Link>
                </motion.div>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link to="/privacy" className="hover:text-white transition duration-300">Privacy Policy</Link>
                </motion.div>
            </div>
            <p className="text-center text-gray-500">&copy; {new Date().getFullYear()} Pokerlytics. All rights reserved.</p>
            </div>
        </footer>
    </div>
  )
}

export default LandingPage