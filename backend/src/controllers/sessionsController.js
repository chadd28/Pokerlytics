const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

/**
 * Create a new poker session
 */
const createSession = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Get session data from request body with defaults and proper naming
    const { 
      location = '', 
      start_time = null, 
      end_time = null, 
      buyIn, // Will be converted to buy_in
      cashOut, // Will be converted to cash_out
      game_type = null,
      additional_info = { notes: null, bb: null, sb: null, num_players: null }, 
      profit_loss
    } = req.body;

    formatted_additional_info = JSON.stringify(additional_info);

    // Get the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }
    
    // Create a new Supabase client with the JWT token
    const supabaseWithAuth = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Insert the new session
    const { data, error } = await supabaseWithAuth
      .from('sessions')
      .insert([
        { 
            session_id: crypto.randomUUID(),
            user_id: userId,
            location,
            start_time,
            end_time,
            buy_in: parseFloat(buyIn),
            cash_out: parseFloat(cashOut),
            profit_loss: parseFloat(profit_loss),
            game_type,
            additional_info: formatted_additional_info
        }
      ])
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create session',
        error: error.message 
      });
    }
    
    return res.status(201).json({ 
      success: true,
      message: 'Session created successfully',
      session: data[0] 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get all sessions for the current user
 */
const getSessions = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Get the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }
    
    // Create a new Supabase client with the JWT token
    const supabaseWithAuth = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Get sessions for this user, ordered by date (newest first)
    const { data, error } = await supabaseWithAuth
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .order('start_time', { ascending: false });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch sessions',
        error: error.message 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      sessions: data 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete a session by ID
 */
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get the JWT from the request headers
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token provided' 
      });
    }
    
    const supabaseWithAuth = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
    
    // Delete session but check user_id to ensure users only delete their own sessions
    const { error } = await supabaseWithAuth
      .from('sessions')
      .delete()
      .eq('session_id', id)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to delete session',
        error: error.message 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Session deleted successfully' 
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { createSession, getSessions, deleteSession };