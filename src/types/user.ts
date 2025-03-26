import { Locale } from '../locales';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  createdAt?: string; // 使其可选，以支持试用用户
  preferences: {
    theme: 'light' | 'dark';
    defaultLocale: Locale;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultLocale: Locale;
} 