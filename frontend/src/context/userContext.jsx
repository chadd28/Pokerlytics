import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

// Create context
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const cached = localStorage.getItem('userProfile');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(!profile); // if profile already cached, skip loading
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data.user);
      localStorage.setItem('userProfile', JSON.stringify(data.user)); // cache it
      return data.user;
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!profile) {
      fetchProfile().catch(err => console.error('Initial profile load failed:', err));
    }
  }, []);

  const updateUser = async () => {
    return await fetchProfile();
  };

  const clearUser = () => {
    setProfile(null);
    localStorage.removeItem('userProfile');
  };

  return (
    <UserContext.Provider value={{ 
      profile, 
      loading, 
      error, 
      updateUser,
      clearUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
