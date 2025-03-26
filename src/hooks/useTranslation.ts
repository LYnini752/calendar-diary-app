import { useAuth } from '../contexts/AuthContext';
import { translations } from '../locales';

export const useTranslation = () => {
  const { locale } = useAuth();

  const t = (key: keyof typeof translations['en']) => {
    return translations[locale][key];
  };

  return { t };
}; 