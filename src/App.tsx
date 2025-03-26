import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from './routes';

const App: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppRoutes />
    </Box>
  );
};

export default App;
