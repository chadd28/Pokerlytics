import supabase from '../supabase';
import axios from 'axios';

// Backend API URL
const API_URL = 'http://localhost:4000/pokerlytics';

// ---------- AUTH FUNCTIONS ----------

const registerUser = async (email, password, firstName, lastName) => {
  const { data, error } = await supabase.auth.signUp({ 
    email: email,
    password: password,
    options: {
      data: {
        firstName,
        lastName
      }
    }
  });
  if (error) throw error;

  // Insert user data into the 'profiles' table
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: data.user.id,
          first_name: firstName,
          last_name: lastName
        },
      ]);

    if (profileError) {
      console.error('Supabase profile insert error:', profileError);
      throw profileError; 
    }
  }

  return data;
};

const loginUser = async (email, password) => {
  try {
    // Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Store user data in localStorage for easy access
    localStorage.setItem('userData', JSON.stringify(data.user));
    
    return { 
      token: data.session.access_token,
      user: data.user 
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const logoutUser = async () => {
  try {
    await supabase.auth.signOut();
    localStorage.removeItem('userData');
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    localStorage.removeItem('userData');
    throw error;
  }
};

// ---------- UTILITY FUNCTIONS ----------

// Check if user is logged in for ProtectedRoute
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// ---------- API REQUEST HELPERS ----------

// Create an axios instance that adds the auth token to requests
export const authAxios = axios.create();

// Add Supabase token to all API requests
authAxios.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

// Get user profile data from backend
const getUserProfile = async () => {
  try {
    // Use the authAxios instance that automatically includes the auth token
    const response = await authAxios.get(`${API_URL}/user-profile`);
    
    if (response.status !== 200) {
      throw new Error('Failed to fetch profile data');
    }
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

export { 
  registerUser, 
  loginUser, 
  logoutUser,
  getUserProfile
};