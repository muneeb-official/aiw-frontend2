// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount (handles page refresh/Stripe redirect)
useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (token && savedUser) {
    try {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Failed to parse saved user:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
  setLoading(false);
}, []);

const login = async (email, password) => {
  const result = await authService.login(email, password);
  
  if (result.success) {
    // Build user object with organization data included
    const userData = {
      ...result.user,
      organization_id: result.organization?.id,
      organization: result.organization,
      seat_id: result.seatId,
      service_ids: result.serviceIds,
      hasSubscription: result.hasSubscription,
    };
    
    // Save token and user to localStorage
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  }
  
  return result;
};

  const signUp = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.signUp(userData);
      if (response.success) {
        return { success: true, message: response.message };
      }
      return response;
    } catch (err) {
      setError(err.message || 'Sign up failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear ALL user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        signUp,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;