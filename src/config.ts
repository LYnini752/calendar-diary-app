export const API_CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || 'https://api.calendar-diary.com',
  // 如果需要 API Key
  API_KEY: process.env.REACT_APP_API_KEY
};

export const APP_CONFIG = {
  APP_NAME: 'Calendar Diary',
  APP_VERSION: '1.0.0',
  APP_ENV: process.env.NODE_ENV || 'development'
}; 