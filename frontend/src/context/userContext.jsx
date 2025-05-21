import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

// Create context
const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const cached = localStorage.getItem('userProfile');
      //console.log('Cached profile:', cached);
      // Only parse if cached exists and isn't "undefined"
      if (cached && cached !== "undefined") {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error('Error parsing user profile from localStorage', error);
      // Clear the invalid data
      localStorage.removeItem('userProfile');
      return null;
    }
  });
  const [loading, setLoading] = useState(!profile); // if profile already cached, skip loading
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data.user);
      localStorage.setItem('userProfile', JSON.stringify(data.user)); // cache it
      // console.log('Profile fetched:', data.user);
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
