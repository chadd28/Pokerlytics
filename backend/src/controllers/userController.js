const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    //process.env.SUPABASE_SERVICE_ROLE_KEY, // Use the service role key CAREFUL!!! BYPASSES ALL RLS. 
    // fixed it with initializing new client with token!!!!!
    // {
    //   auth: {
    //     autoRefreshToken: false,
    //     persistSession: false
    //   }
    // }
  );

// Sync user data between Supabase and your backend
const syncUser = async (req, res) => {
  try {
    const userId = req.user.id; // extracted from JWT
    const email = req.user.email;
    
    // Here you would typically:
    // 1. Update your database with the latest user info
    // 2. Return the updated user record
    
    return res.json({
      user: {
        id: userId,
        email: req.user.email,
        // Add any additional user data from your database
        firstName: "Updated",
        lastName: "User",
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('User sync error:', error);
    return res.status(500).json({ message: 'Failed to sync user data' });
  }
};


const getProfile = async (req, res) => {
    //console.log("trying to get profile...")
    try {
      // The user ID comes from the token via the auth middleware
      const userId = req.user.id;
      const userEmail = req.user.email;
      
      //console.log(`Getting profile for user ${userId} (${userEmail})...`);
  
      // Get the JWT from the Authorization header
      const token = req.headers.authorization.split(' ')[1];
  
      // Log the token
      //console.log(`Token received: ${token.substring(0, 10)}...`);

      // Create a new Supabase client with the user's JWT token to make RLS work correctly
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
      
      // Fetch the user's profile from the 'profiles' table
      const { data: profile, error } = await supabaseWithAuth
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (error) {
        console.error('Supabase profile fetch error:', error);
        return res.status(500).json({ message: 'Failed to retrieve user profile' });
      }
      
      if (!profile) {
        console.log(`No profile found for user ID: ${userId}`);
        return res.status(404).json({ message: 'User profile not found' });
      }
      
      // Return the user's profile data
      return res.json({
        user: {
          id: userId,
          email: userEmail,
          firstName: profile.first_name,
          lastName: profile.last_name,
          createdAt: profile.date_joined, 
          stats: {
            gamesPlayed: profile.games_played, 
            winRate: "23.5%"  // Replace with actual data
          }
        }
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      return res.status(500).json({ message: 'Failed to retrieve user profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const updatedData = req.body;
      
      // Here you would update the user's profile in your database
      console.log(`Updating profile for user ${userId}`, updatedData);
      
      return res.json({
        success: true,
        user: {
          id: userId,
          ...updatedData,
          updatedAt: new Date()
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ message: 'Failed to update user profile' });
    }
  };

// Handle logout
const logout = async (req, res) => {
  // With JWT, you typically don't need server-side logout
  // but you might want to track sessions or invalidate refresh tokens
  return res.json({ success: true, message: 'Logout successful' });
};

module.exports = {
  syncUser,
  getProfile,
  updateProfile,
  logout
};