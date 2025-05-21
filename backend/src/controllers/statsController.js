const axios = require('axios');
const supabase = require('../config/supabase');

const analyzePokerSessions = async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user.id;
    
    // Query Supabase for poker sessions
    const { data: sessionData, error } = await supabase
      .from('sessions') 
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('statsController.js: Supabase error:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve session data' });
    }

    // No sessions found
    if (!sessionData || sessionData.length === 0) {
      return res.json([]);
    }

    // Session data should be in the format expected by FastAPI:
    // console.log('Session data:', sessionData);

    // Send sessionData to FastAPI
    try {
      const response = await axios.post('http://localhost:8000/analyze-sessions', sessionData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000, // Optional: fail fast if Python API is slow
      });

      res.json(response.data);
    } catch (apiError) {
      console.error('FastAPI error:', apiError.message);
      res.status(500).json({ error: 'Failed to analyze data', details: apiError.message });
    }

  } catch (err) {
    console.error('statsController error:', err);
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
      

};

module.exports = { analyzePokerSessions };