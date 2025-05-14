const { PythonShell } = require('python-shell');
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

    // Set up options for PythonShell
    const options = {
      mode: 'json', // Get output as parsed JSON
      pythonPath: 'python3', // Specify the path to your Python executable
      scriptPath: './src/python', // Path to your Python scripts
      args: [], // Any arguments to pass to the script
      stdin: true // Enable stdin for sending data to the Python script
    };

    // Start the Python process
    let analysisResults;
    try {
      // Run the Python script with the session data
      analysisResults = await new Promise((resolve, reject) => {
        // Create a new PythonShell instance
        const pyshell = new PythonShell('analyze_sessions.py', options);
        
        // Send the session data to the Python script
        pyshell.send(sessionData);
        
        let result = null;
        let errorMessage = '';
        
        // Handle messages from the Python script
        pyshell.on('message', (message) => {
          result = message;
        });
        
        // Handle errors
        pyshell.on('stderr', (stderr) => {
          console.error('Python error:', stderr);
          errorMessage += stderr;
        });
        
        // Handle script end
        pyshell.end((err) => {
          if (err) {
            console.error('PythonShell error:', err);
            reject(new Error(errorMessage || err.message));
          } else {
            resolve(result);
          }
        });
      });
      
      // Send the analysis results back to the client
      res.json(analysisResults);
      
    } catch (pythonError) {
      console.error('Python analysis error:', pythonError);
      res.status(500).json({ error: 'Failed to analyze session data', details: pythonError.message });
    }
    
  } catch (err) {
    console.error('statsController error:', err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = { analyzePokerSessions };