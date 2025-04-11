const { spawn } = require('child_process');
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

    // Run Python analysis script
    const python = spawn('python3', ['./src/python/analyze_sessions.py']);

    let result = '';
    python.stdout.on('data', (data) => {
        result += data.toString();
        // console.log('\n===== analyzePokerSessions Python Output =====');
        // console.log(result);
        // console.log('================================================\n');
    });

    python.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Analysis failed' });
      }
      try {
        const parsed = JSON.parse(result);
        res.json(parsed);
      } catch (e) {
        res.status(500).json({ error: 'Failed to parse analysis results' });
      }
    });

    // Send session data to Python script
    python.stdin.write(JSON.stringify(sessionData));
    python.stdin.end();
    
  } catch (err) {
    console.error('statsController error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = { analyzePokerSessions };