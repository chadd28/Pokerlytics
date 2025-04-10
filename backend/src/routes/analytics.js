// routes for python data analysis
const express = require('express');
const { spawn } = require('child_process');
const router = express.Router();
const supabase = require('../utils/supabaseClient');


router.get('/analyze', async (req, res) => {
    // Query Supabase for session data
    const { data, error } = await supabase
        .from('sessions') // replace with your actual table name
        .select('user_id, timestamp, duration, page');  

    if (error) {
        console.error('Supabase error:', error.message);
        return res.status(500).json({ error: 'Database query failed' });
    }

    const python = spawn('python3', ['./python/analyze_sessions.py']);

    let result = '';
    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    python.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ error: 'Python script failed' });
        }
        try {
            const parsed = JSON.parse(result);
            res.json(parsed);
        } catch (e) {
            res.status(500).json({ error: 'Failed to parse Python output' });
        }
    });

    // Send session data to Python
    python.stdin.write(JSON.stringify(rawSessionData));
    python.stdin.end();
});

module.exports = router;
