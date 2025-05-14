import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/SideBar';
import { FaCalendar, FaDollarSign, FaClock, FaMapMarkerAlt, FaGamepad } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { createNewSession } from '../services/sessionService'; 
import SessionSummary from '../components/SessionSummary';

const NewSession = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    location: '',
    start_time: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16), // Adjusted to local time
    end_time: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    buyIn: '',
    cashOut: '',
    game_type: "Cash - NL Hold'em", // Default value
    additional_info: {
      notes: '',
      bb: '0.2',
      sb: '0.1',
      customBlinds: false,
      num_players: '',
    }
  });

    const handleAdditionalInfoChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        additional_info: {
            ...prev.additional_info,
            [name]: value
        }
        }));
    };
    // handle blind selection
    const handleBlindChange = (e) => {
        const value = e.target.value;
        
        if (value === 'custom') {
          // Set customBlinds to true to show the input fields
          setFormData(prev => ({
            ...prev,
            additional_info: {
              ...prev.additional_info,
              customBlinds: true
            }
          }));
        } else {
          // Parse the selected value and update state
          const [sb, bb] = value.split('/');
          
          setFormData(prev => ({
            ...prev,
            additional_info: {
              ...prev.additional_info,
              sb: sb,
              bb: bb,
              customBlinds: false
            }
          }));
        }
      };
  
  // Also update the notes change handler so it goes into additional_info
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special case for notes - put it in additional_info
    if (name === "notes") {
      setFormData(prev => ({
        ...prev,
        additional_info: {
          ...prev.additional_info,
          notes: value
        }
      }));
    } else {
      // Normal case for other fields
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
        // Validate form
        if (!formData.buyIn || !formData.cashOut) {
            throw new Error('Please fill all required fields');
        }
        
        if (new Date(formData.end_time) <= new Date(formData.start_time)) {
            throw new Error('End time must be after start time');
        }
        
        // Calculate profit/loss
        const buyIn = parseFloat(formData.buyIn);
        const cashOut = parseFloat(formData.cashOut);
        const profit_loss = cashOut - buyIn;
        
        // Send data to backend API
        await createNewSession({
            location: formData.location,
            start_time: formData.start_time,
            end_time: formData.end_time,
            buyIn: buyIn,  // This will be converted to buy_in in your backend
            cashOut: cashOut, // This will be converted to cash_out in your backend
            profit_loss: profit_loss, 
            game_type: formData.game_type,
            additional_info: formData.additional_info // This will be deconstructed in backend
        });
        
        // Redirect to sessions list
        navigate('/sessions');
        
        } catch (err) {
        console.error('Failed to create session:', err);
        setError(err.message || 'Failed to create session');
        
        window.scrollTo({   // Scroll to the top of the page to show the error message
            top: 0,
            behavior: 'smooth'
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
        <Sidebar />
        
        <main className="ml-16 w-full p-6">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-3xl mx-auto"
            >
            <h1 className="text-2xl font-bold text-white mb-6">New Poker Session</h1>
            
            {error && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-200">{error}</p>
                </div>
            )}
            
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Start Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <FaClock className="inline mr-2 text-indigo-400" />
                            Start Time
                        </label>
                        <input
                            type="datetime-local"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                        
                        {/* End Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <FaClock className="inline mr-2 text-indigo-400" />
                            End Time
                        </label>    
                        <input
                            type="datetime-local"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>
                        
                        
                        
                    {/* Buy-in Amount */}
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaDollarSign className="inline mr-2 text-indigo-400" />
                        Buy-in Amount*
                    </label>
                    <input
                        type="number"
                        name="buyIn"
                        value={formData.buyIn}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    </div>
                    
                    {/* Cash Out Amount */}
                    <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaDollarSign className="inline mr-2 text-indigo-400" />
                        Cash Out Amount*
                    </label>
                    <input
                        type="number"
                        name="cashOut"
                        value={formData.cashOut}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    </div>

                    {/* Game Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <FaGamepad className="inline mr-2 text-indigo-400" />
                            Game Type*
                        </label>
                        <select
                            name="game_type"
                            value={formData.game_type}
                            onChange={handleChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="Cash - NL Hold'em">Cash - NL Hold'em</option>
                            <option value="Cash - Limit Hold'em">Cash - Limit Hold'em</option>
                            <option value="Tournament">Tournament</option>
                            <option value="Sit & Go">Sit & Go</option>
                        </select>
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <FaMapMarkerAlt className="inline mr-2 text-indigo-400" />
                            Location
                        </label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Lucky Poker Room"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    </div>
                    
                    {/* Notes field should update additional_info.notes */}
                    <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Notes
                    </label>
                    <textarea
                        name="notes" // This will be handled by the special case in handleChange
                        value={formData.additional_info.notes} // Get from additional_info
                        onChange={handleChange}
                        rows="4"
                        placeholder="Any thoughts about this session..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    </div>

                    {/* Add inputs for other additional_info fields if needed */}
                    <div className="flex flex-col md:flex-row md:items-end md:gap-x-4 gap-y-4 mb-6">
                        {/* Blinds dropdown */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                            Blind Level
                            </label>
                            <select
                            name="blinds"
                            onChange={handleBlindChange}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            defaultValue="0.1/0.2"
                            >
                            <option value="0.05/0.1">$0.05 / $0.1</option>
                            <option value="0.1/0.2">$0.1 / $0.2</option>
                            <option value="0.5/1">$0.5 / $1</option>
                            <option value="1/2">$1 / $2</option>
                            <option value="1/3">$1 / $3</option>
                            <option value="custom">Custom...</option>
                            </select>
                        </div>
                        {/* Only show custom blind inputs when needed */}
                        {formData.additional_info.customBlinds && (
                            // Use flex for horizontal layout, add a smaller gap
                            <div className="md:col-span-2 flex flex-wrap gap-x-4 gap-y-2"> {/* Changed grid to flex, adjusted gap */}
                            {/* Small Blind */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-300 mb-1"> {/* Reduced mb slightly */}
                                Small Blind
                                </label>
                                <input
                                type="number"
                                name="sb"
                                value={formData.additional_info.sb}
                                onChange={handleAdditionalInfoChange}
                                min="0"
                                step="0.01"
                                placeholder="0.1"
                                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            {/* Big Blind */}
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium text-gray-300 mb-1"> {/* Reduced mb slightly */}
                                Big Blind
                                </label>
                                <input
                                type="number"
                                name="bb"
                                value={formData.additional_info.bb}
                                onChange={handleAdditionalInfoChange}
                                min="0"
                                step="0.01"
                                placeholder="0.2"
                                className="w-24 bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>
                            </div>
                        )}
                    
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                            Number of Players
                            </label>
                            <input
                            type="number"
                            name="num_players"
                            value={formData.additional_info.num_players}
                            onChange={handleAdditionalInfoChange}
                            placeholder="e.g. 9"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    
                    {/* Session Summary component */}
                    {formData.buyIn && formData.cashOut && (
                    <SessionSummary formData={formData} />
                    )}
                    
                
                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                    <button
                    type="button"
                    onClick={() => navigate('/sessions')}
                    className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                    Cancel
                    </button>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center"
                    >
                    {isSubmitting ? (
                        <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Saving...
                        </>
                    ) : (
                        'Save Session'
                    )}
                    </button>
                </div>
                </form>
            </div>
            </motion.div>
        </main>
        </div>
    );
};

export default NewSession;