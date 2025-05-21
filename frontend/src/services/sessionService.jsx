import axios from 'axios';
import supabase from '../supabase';
import { notifyChange } from '../context/sessionsContext';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
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
    notifyChange(); // Notify context of change
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

/**
 * Get a specific session by ID
 */
export const getSessionById = async (sessionId) => {
  try {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data.session;
  } catch (error) {
    console.error('Failed to fetch session:', error);
    throw error;
  }
};

/**
 * Update an existing session
 */
export const updateSession = async (sessionId, sessionData) => {
  try {
    const response = await api.put(`/sessions/${sessionId}`, sessionData);
    notifyChange(); // Notify context of change
    return response.data;
  } catch (error) {
    console.error('Failed to update session:', error);
    throw error;
  }
};


/**
 * Delete a session
 */
export const deleteSession = async (sessionId) => {
  try {
    const response = await api.delete(`/sessions/${sessionId}`);
    notifyChange(); // Notify context of change
    return response.data;
  } catch (error) {
    console.error('Failed to delete session:', error);
    throw error;
  }
};

/**
 * Fetches processed session data for graph visualization and advanced analytics
 * Includes: trend analysis, streaks, profit calculations
 */
export const getSessionsGraphData = async () => {
  try {
    const response = await api.get('/sessions-graph');
    return response.data;
  } catch (error) {
    console.error('sessionService.jsx: Failed to fetch sessions graph data:', error);
    throw error;
  }
};
