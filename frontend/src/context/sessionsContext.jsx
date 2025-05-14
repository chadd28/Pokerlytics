import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getUserSessions } from '../services/sessionService';
import { useUser } from './userContext';

const SessionsContext = createContext();

// Global event emitter for session changes
let notifySessionChangeCallback = null;

export function SessionsProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { profile, loading: userLoading } = useUser();
  const isAuthenticated = !!profile;

  // Main function to fetch sessions
  const fetchSessions = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getUserSessions();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  // Function to notify about session changes
  const notifyChange = useCallback(() => {
    // When a change is detected, refresh the data
    fetchSessions();
  }, [fetchSessions]);

  // Register the callback globally
  useEffect(() => {
    notifySessionChangeCallback = notifyChange;
    return () => { notifySessionChangeCallback = null; };
  }, [notifyChange]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (!userLoading && isAuthenticated) {
      fetchSessions();
    }
  }, [userLoading, isAuthenticated, fetchSessions]);
  
  const value = {
    sessions,
    isLoading,
    error,
    fetchSessions,
  };
  
  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}

// Global function to trigger a refresh from anywhere
export const notifyChange = () => {
  if (notifySessionChangeCallback) {
    notifySessionChangeCallback();
  }
};

// Hook to use the sessions context
export function useSessions() {
  const context = useContext(SessionsContext);
  if (context === undefined) {
    throw new Error('useSessions must be used within a SessionsProvider');
  }
  return context;
}