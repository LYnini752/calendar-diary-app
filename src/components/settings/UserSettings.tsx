import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { translations, Locale } from '../../locales';

const UserSettings: React.FC = () => {
  const { user, locale, setLocale, updateUserPreferences, isLoading, error } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const t = translations[locale];

  const handleLocaleChange = async (newLocale: Locale) => {
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      await updateUserPreferences({
        ...user?.preferences,
        defaultLocale: newLocale
      });
      setLocale(newLocale);
      setSuccessMessage(t.settingsSaved);
    } catch (err) {
      console.error('Error updating locale:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    setIsSaving(true);
    setSuccessMessage(null);
    try {
      await updateUserPreferences({
        defaultLocale: locale,
        theme
      });
      setSuccessMessage(t.settingsSaved);
    } catch (err) {
      console.error('Error updating theme:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t.settings}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t.language}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>{t.language}</InputLabel>
            <Select
              value={locale}
              label={t.language}
              onChange={(e) => handleLocaleChange(e.target.value as Locale)}
              disabled={isSaving}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="zh-CN">简体中文</MenuItem>
              <MenuItem value="zh-TW">繁體中文</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            {t.theme}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>{t.theme}</InputLabel>
            <Select
              value={user.preferences?.theme || 'light'}
              label={t.theme}
              onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark')}
              disabled={isSaving}
            >
              <MenuItem value="light">{t.lightTheme}</MenuItem>
              <MenuItem value="dark">{t.darkTheme}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} /> : null}
          >
            {isSaving ? t.saving : t.save}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserSettings; 