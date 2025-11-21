import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        if (api.defaults?.headers?.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
      }
    } catch (error) {
      console.error('Error loading auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: newToken, user: newUser } = response.data;
      
      if (newToken && newUser) {
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
        if (api.defaults?.headers?.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password, 
        phone 
      });
      const { token: newToken, user: newUser } = response.data;
      
      if (newToken && newUser) {
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
        if (api.defaults?.headers?.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        }
      }
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Registration failed' 
      };
    }
  };

  const logout = async () => {
    try {
      console.log('Logout function called - clearing auth state');
      
      // Clear token and user state first
      setToken(null);
      setUser(null);
      if (api.defaults?.headers?.common) {
        delete api.defaults.headers.common['Authorization'];
      }
      
      console.log('State cleared, removing from storage');
      
      // Then remove from storage
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      
      console.log('Logout successful - should redirect to login now');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error clearing storage, still log out the user
      setToken(null);
      setUser(null);
      if (api.defaults?.headers?.common) {
        delete api.defaults.headers.common['Authorization'];
      }
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
