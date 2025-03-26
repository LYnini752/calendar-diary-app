import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { format } from 'date-fns';
import { enUS, zhCN, zhTW } from 'date-fns/locale';
import { Locale, translations } from '../locales';

interface Event {
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

interface EventFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: Event) => void;
  initialValues?: Event;
  selectedDate: Date;
  locale: Locale;
}

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

const EventForm: React.FC<EventFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialValues,
  selectedDate,
  locale
}) => {
  const t = translations[locale];
  const dateFnsLocale = getDateFnsLocale(locale);

  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState<Date>(
    initialValues?.startTime || new Date(selectedDate.setHours(9, 0, 0, 0))
  );
  const [endTime, setEndTime] = useState<Date>(
    initialValues?.endTime || new Date(selectedDate.setHours(10, 0, 0, 0))
  );
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newParticipant, setNewParticipant] = useState('');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title || '');
      setStartTime(initialValues.startTime || new Date());
      setEndTime(initialValues.endTime || new Date());
      setLocation(initialValues.location || '');
      setDescription(initialValues.description || '');
      setCategory(initialValues.category || '');
      setPriority(initialValues.priority || '');
      setParticipants(initialValues.participants || []);
      setTags(initialValues.tags || []);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      startTime,
      endTime,
      location,
      description,
      category,
      priority,
      participants,
      tags,
    });
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddParticipant = () => {
    if (newParticipant && !participants.includes(newParticipant)) {
      setParticipants([...participants, newParticipant]);
      setNewParticipant('');
    }
  };

  const handleRemoveParticipant = (participantToRemove: string) => {
    setParticipants(participants.filter(p => p !== participantToRemove));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialValues ? t.edit : t.addEvent}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label={t.title}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <DateTimePicker
              label={t.startTime}
              value={startTime}
              onChange={(newValue) => newValue && setStartTime(newValue)}
              format={locale === 'en' ? 'MM/dd/yyyy hh:mm a' : 'yyyy/MM/dd HH:mm'}
              ampm={locale === 'en'}
            />
            <DateTimePicker
              label={t.endTime}
              value={endTime}
              onChange={(newValue) => newValue && setEndTime(newValue)}
              format={locale === 'en' ? 'MM/dd/yyyy hh:mm a' : 'yyyy/MM/dd HH:mm'}
              ampm={locale === 'en'}
            />
            <TextField
              label={t.location}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              fullWidth
            />
            <TextField
              label={t.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
            <FormControl fullWidth>
              <InputLabel>{t.category}</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                label={t.category}
              >
                <MenuItem value="work">{t.work}</MenuItem>
                <MenuItem value="personal">{t.personal}</MenuItem>
                <MenuItem value="meeting">{t.meeting}</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>{t.priority}</InputLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                label={t.priority}
              >
                <MenuItem value="high">{t.high}</MenuItem>
                <MenuItem value="medium">{t.medium}</MenuItem>
                <MenuItem value="low">{t.low}</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t.tags}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder={t.addTag}
                  fullWidth
                />
                <Button onClick={handleAddTag}>{t.add}</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                {t.participants}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <TextField
                  size="small"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  placeholder={t.addParticipant}
                  fullWidth
                />
                <Button onClick={handleAddParticipant}>{t.add}</Button>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                {participants.map((participant) => (
                  <Chip
                    key={participant}
                    label={participant}
                    onDelete={() => handleRemoveParticipant(participant)}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t.cancel}</Button>
          <Button type="submit" variant="contained">
            {t.save}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventForm; 