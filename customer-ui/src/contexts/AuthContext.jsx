import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to validate and decode token
  const validateToken = useCallback((token) => {
    if (!token) return null;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (payload.exp && payload.exp > currentTime) {
        return payload;
      }
      
      return null;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }, []);

  // Function to check authentication status
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setIsAuthenticated(false);
      setUserEmail('');
      setIsLoading(false);
      return;
    }

    const payload = validateToken(token);
    
    if (payload) {
      setIsAuthenticated(true);
      setUserEmail(payload.sub || payload.email || 'User');
    } else {
      // Token is invalid or expired
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUserEmail('');
    }
    
    setIsLoading(false);
  }, [validateToken]);

  // Check auth on mount and when token changes
  useEffect(() => {
    checkAuth();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = (e) => {
      if (e.key === 'authToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check token validity periodically (every minute)
    const interval = setInterval(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const payload = validateToken(token);
        if (!payload) {
          // Token expired
          logout();
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [checkAuth, validateToken]);

  const login = useCallback((token, email) => {
    // Validate token before storing
    const payload = validateToken(token);
    
    if (!payload) {
      console.error('Invalid token provided to login');
      return false;
    }

    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    setUserEmail(email || payload.sub || payload.email || 'User');
    navigate('/');
    
    return true;
  }, [navigate, validateToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUserEmail('');
    navigate('/login');
  }, [navigate]);

  // Function to get the current token (useful for API calls)
  const getToken = useCallback(() => {
    const token = localStorage.getItem('authToken');
    const payload = validateToken(token);
    
    if (payload) {
      return token;
    }
    
    // Token is invalid or expired
    logout();
    return null;
  }, [validateToken, logout]);

  // Function to refresh authentication state
  const refreshAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    isAuthenticated,
    userEmail,
    isLoading,
    login,
    logout,
    getToken,
    refreshAuth,
    checkAuth
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