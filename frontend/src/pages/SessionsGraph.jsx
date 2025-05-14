import React from 'react';
import Sidebar from '../components/SideBar';
import AllSessionsGraph from '../components/graphs/AllSessionsGraph';
import HourlyGraph from '../components/graphs/HourlyGraphs';
import { motion, AnimatePresence } from 'framer-motion';

export default function SessionsGraph() {
    // Animation variants for smooth transitions
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { 
        opacity: 1, 
        y: 0,
        transition: {
            duration: 0.5
        }
        }
    };

    return (
        <div className="flex bg-gray-900 min-h-screen">
            <Sidebar />
          
            {/* Main content area with better centering */}
            <div className="flex-1 flex justify-center items-start p-4 md:p-6 lg:p-8 ml-40">  {/* ml-40 offsets content by sidebar width */}
            <motion.div 
              className="w-full xl:max-w-6xl space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
            <motion.div variants={itemVariants}>
                <AllSessionsGraph height={320} width="100%"/>
            </motion.div>
              
            <motion.div variants={itemVariants}>
                <HourlyGraph />
            </motion.div>
            </motion.div>
          </div>
    </div>
    );
}