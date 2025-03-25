const supabase = require('../config/supabase');

exports.getSessionData = async (req, res) => {
  try {
    //console.log('Fetching session data from Supabase...');
    
    // Fetch session data from Supabase
    const { data, error } = await supabase
      .from('sessions') // Supabase table name
      .select('*')
      .order('start_time', { ascending: false });

    if (error) throw error;

    //console.log('Data fetched successfully:', data);
    res.json(data); // Send data to frontend
  } catch (error) {
    console.error('Supabase error:', error);
    res.status(500).json({ error: error.message });
  }
};