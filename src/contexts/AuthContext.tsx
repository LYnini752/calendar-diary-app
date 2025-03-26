import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { translations, Locale } from '../locales';
import { authApi, userApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  locale: Locale;
  isLoading: boolean;
  error: string | null;
  trialCount: number;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  setLocale: (locale: Locale) => void;
  updateUserPreferences: (preferences: User['preferences']) => Promise<void>;
  startTrialMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [locale, setLocale] = useState<Locale>(() => {
    const savedLocale = localStorage.getItem('locale');
    return (savedLocale as Locale) || 'en';
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trialCount, setTrialCount] = useState<number>(() => {
    const saved = localStorage.getItem('trialCount');
    return saved ? parseInt(saved, 10) : 5;
  });

  // 保存试用次数到本地存储
  useEffect(() => {
    localStorage.setItem('trialCount', trialCount.toString());
  }, [trialCount]);

  // 从本地存储加载用户信息
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = await authApi.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // 保存语言设置到本地存储
  useEffect(() => {
    localStorage.setItem('locale', locale);
  }, [locale]);

  const startTrialMode = () => {
    if (trialCount > 0) {
      setTrialCount(prev => prev - 1);
      // 创建临时用户
      setUser({
        id: 'trial-user',
        username: 'trial',
        email: 'trial@example.com',
        name: 'Trial User',
        preferences: {
          theme: 'light',
          defaultLocale: locale
        }
      });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await authApi.login(credentials);
      setUser(user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { user } = await authApi.register(data);
      setUser(user);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.logout();
      setUser(null);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserPreferences = async (preferences: User['preferences']) => {
    if (!user) return;
    
    try {
      const updatedUser = await userApi.updatePreferences(preferences);
      setUser(updatedUser);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const value = {
    user,
    locale,
    isLoading,
    error,
    trialCount,
    login,
    register,
    logout,
    setLocale,
    updateUserPreferences,
    startTrialMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 