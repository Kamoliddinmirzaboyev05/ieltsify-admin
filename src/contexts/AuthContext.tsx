import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { AuthContext } from '@/contexts/AuthContextBase';
import type { User } from '@/contexts/AuthContextBase';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tokenExists = apiClient.isAuthenticated();
    if (!tokenExists && user) {
      // If no token but we have a user, it's an invalid state. Logout.
      setUser(null);
      sessionStorage.removeItem('user');
    }
  }, []);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  }, [user]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Call API to get tokens
      await apiClient.login(username, password);
      
      // Create user object from username
      const newUser: User = {
        id: Date.now().toString(),
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: `${username}@ieltsify.com`,
        username: username,
      };
      
      setUser(newUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user && apiClient.isAuthenticated(), isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
