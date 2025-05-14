const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();


/**
 * Helper function to update user profile stats on create/delete session
 */
const updateUserStats = async (supabaseClient, userId) => {
  try {
    // Get all sessions for this user
    const { data: sessions, error: sessionsError } = await supabaseClient
      .from('sessions')
      .select('profit_loss')
      .eq('user_id', userId);
    
    if (sessionsError) throw sessionsError;
    
    // Calculate stats
    const gamesPlayed = sessions.length;
    const profitableSessions = sessions.filter(s => parseFloat(s.profit_loss) >= 0).length;
    const winRate = gamesPlayed > 0 ? (profitableSessions / gamesPlayed) * 100 : 0;

    
    // Update user profile
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({
        games_played: gamesPlayed,
        win_rate: winRate
      })
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    return { gamesPlayed, winRate };
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

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

    // Update user stats
    try {
      const stats = await updateUserStats(supabaseWithAuth, userId);
      // console.log(`Updated user stats: games played: ${stats.gamesPlayed}, win rate: ${stats.winRate}`);
    } catch (statsError) {
      console.error('Error updating user stats:', statsError);
      // Continue with the response even if stats update fails
    }

    return res.status(201).json({ 
      success: true,
      message: 'Session created successfully',
      session: data[0],
      change: true // Indicate a change occurred
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
 * Get a single session by ID
 */
const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

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

    const { data, error } = await supabaseWithAuth
      .from('sessions')
      .select('*')
      .eq('session_id', id)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(404).json({
        success: false,
        message: 'Session not found',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      session: data
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
 * Update a session by ID
 */
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
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
    
    // First check if session exists and belongs to user
    const { data: sessionData, error: fetchError } = await supabaseWithAuth
      .from('sessions')
      .select('*')
      .eq('session_id', id)
      .eq('user_id', userId)
      .single();
    
    if (fetchError || !sessionData) {
      return res.status(404).json({ 
        success: false, 
        message: 'Session not found or you do not have permission to update it',
        error: fetchError?.message 
      });
    }
    
    // Update the session
    const { data, error } = await supabaseWithAuth
      .from('sessions')
      .update({ 
        location,
        start_time,
        end_time,
        buy_in: parseFloat(buyIn),
        cash_out: parseFloat(cashOut),
        profit_loss: parseFloat(profit_loss),
        game_type,
        additional_info: formatted_additional_info
      })
      .eq('session_id', id)
      .eq('user_id', userId)
      .select();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to update session',
        error: error.message 
      });
    }

    // Update user stats
    try {
      const stats = await updateUserStats(supabaseWithAuth, userId);
      // console.log(`Updated user stats after session update: games played: ${stats.gamesPlayed}, win rate: ${stats.winRate}`);
    } catch (statsError) {
      console.error('Error updating user stats:', statsError);
      // Continue with the response even if stats update fails
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Session updated successfully',
      session: data[0],
      change: true // Indicate a change occurred
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

    // Update user stats after deletion
    try {
      const stats = await updateUserStats(supabaseWithAuth, userId);
      //console.log(`Updated user stats after deletion: games played: ${stats.gamesPlayed}, win rate: ${stats.winRate}`);
    } catch (statsError) {
      console.error('Error updating user stats after deletion:', statsError);
      // Continue with the response even if stats update fails
    }
    
    return res.status(200).json({ 
      success: true,
      message: 'Session deleted successfully',
      change: true // Indicate a change occurred
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

module.exports = { 
  createSession, 
  getSessions, 
  getSessionById,
  updateSession, 
  deleteSession 
};