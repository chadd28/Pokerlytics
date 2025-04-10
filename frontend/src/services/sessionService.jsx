import axios from 'axios';
import supabase from '../supabase';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: 'http://localhost:4000/pokerlytics'
});

// Add an interceptor to automatically add the auth token to all requests
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export const createNewSession = async (sessionData) => {
  try {
    const response = await api.post('/sessions', sessionData);
    return response.data;
  } catch (error) {
    console.error('Failed to create session:', error);
    throw error;
  }
};

/**
 * Fetches the list of user sessions from the server.
 */
export const getUserSessions = async () => {
  try {
    const response = await api.get('/sessions');
    console.log(response.data);
    return response.data;

  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    throw error;
  }
};