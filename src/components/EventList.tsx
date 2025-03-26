import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  Typography,
  Chip,
  Stack,
  Box,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { format } from 'date-fns';
import { enUS, zhCN, zhTW } from 'date-fns/locale';
import { Locale, translations } from '../locales';

interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  category?: string;
  priority?: string;
  duration?: string;
  location?: string;
  description?: string;
  tags?: string[];
  participants?: string[];
}

interface EventListProps {
  selectedDate: Date;
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddEvent: () => void;
  locale: Locale;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'work':
      return '#f44336';
    case 'meeting':
      return '#2196f3';
    case 'personal':
      return '#4caf50';
    default:
      return '#9e9e9e';
  }
};

const getDateFnsLocale = (locale: Locale) => {
  switch (locale) {
    case 'en':
      return enUS;
    case 'zh-TW':
      return zhTW;
    default:
      return zhCN;
  }
};

const EventList: React.FC<EventListProps> = ({
  selectedDate,
  events,
  onEditEvent,
  onDeleteEvent,
  onAddEvent,
  locale
}) => {
  const t = translations[locale];
  const dateFnsLocale = getDateFnsLocale(locale);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#fafafa',
      }}
    >
      <Box sx={{ 
        p: 2,
        borderBottom: '1px solid #e0e0e0',
        bgcolor: '#fff',
      }}>
        <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem', fontWeight: 500 }}>
          {format(selectedDate, locale === 'en' ? 'EEEE, MMMM d, yyyy' : 'yyyy年MM月dd日 EEEE', { locale: dateFnsLocale })}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddEvent}
          fullWidth
          sx={{
            textTransform: 'none',
            bgcolor: '#1a73e8',
            '&:hover': {
              bgcolor: '#1557b0',
            },
          }}
        >
          {t.addSchedule}
        </Button>
      </Box>

      <Box sx={{ 
        flex: 1, 
        overflow: 'auto',
        p: 2,
      }}>
        {events.length === 0 ? (
          <Typography 
            sx={{ 
              textAlign: 'center',
              color: '#666',
              mt: 4,
            }}
          >
            {t.noEvents}
          </Typography>
        ) : (
          <Stack spacing={2}>
            {events.map((event) => (
              <Paper
                key={event.id}
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: '#fff',
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                }}
              >
                <Box sx={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  mb: 1,
                }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {event.title}
                  </Typography>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => onEditEvent(event)}
                      sx={{ color: '#666' }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => onDeleteEvent(event.id)}
                      sx={{ color: '#666' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {format(event.startTime, locale === 'en' ? 'h:mm a' : 'HH:mm', { locale: dateFnsLocale })} - 
                  {format(event.endTime, locale === 'en' ? 'h:mm a' : 'HH:mm', { locale: dateFnsLocale })}
                </Typography>
                {event.location && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {t.location}: {event.location}
                  </Typography>
                )}
                {event.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {event.description}
                  </Typography>
                )}
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default EventList; 