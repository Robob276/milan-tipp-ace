import React, { createContext, useContext, useState, useEffect } from 'react';
import { users, User } from '@/data/olympicEvents';

interface AuthContextType {
  currentUser: User | null;
  login: (name: string, pin: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('olympia_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (name: string, pin: string): boolean => {
    const user = users.find(u => u.name === name && u.pin === pin);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('olympia_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('olympia_user');
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      login, 
      logout, 
      isAuthenticated: !!currentUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
