import React from 'react';
import { Box, CssBaseline, useTheme } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import AppRoutes from './routes';
import { useTranslation } from './hooks/useTranslation';

const App: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppRoutes />
    </Box>
  );
};

export default App;
