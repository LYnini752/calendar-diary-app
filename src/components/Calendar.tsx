import React, { useState } from 'react';
import { Box, Typography, Stack, Paper, ButtonGroup, IconButton, Button, CircularProgress, Alert } from '@mui/material';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { enUS, zhCN, zhTW } from 'date-fns/locale';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Locale, translations, localeNames } from '../locales';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { API_CONFIG } from '../config';

const THEME = {
  primary: '#1976d2',
  primaryLight: '#e3f2fd',
  selected: '#e8f1ff',
  hover: '#f5f5f5',
  border: '#eaeaea',
  borderLight: '#f5f5f5',
  past: '#f8f8f8',
  future: '#ffffff',
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#bdbdbd',
    past: '#888888',
  }
} as const;

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

const Calendar: React.FC = () => {
  const { t } = useTranslation();
  const { locale } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateDiaryContent = async (events: Event[]) => {
    const prompt = locale === 'en' 
      ? `Please generate a diary entry in first person perspective based on the following schedule:

${events.map(event => `
Time: ${format(event.startTime, 'HH:mm')} - ${format(event.endTime, 'HH:mm')}
Title: ${event.title}
${event.category ? `Category: ${event.category}\n` : ''}${event.priority ? `Priority: ${event.priority}\n` : ''}${event.location ? `Location: ${event.location}\n` : ''}${event.participants?.length ? `Participants: ${event.participants.join(', ')}\n` : ''}${event.tags?.length ? `Tags: ${event.tags.join(', ')}\n` : ''}${event.description ? `Description: ${event.description}` : ''}`).join('\n')}

Please write a vivid and interesting diary entry that includes thoughts and feelings about each event. Make it personal and emotional.`
      : `请根据以下日程安排生成一篇日记，以第一人称的视角描述这一天：

${events.map(event => `
时间：${format(event.startTime, 'HH:mm')} - ${format(event.endTime, 'HH:mm')}
标题：${event.title}
${event.category ? `类别：${event.category}\n` : ''}${event.priority ? `优先级：${event.priority}\n` : ''}${event.location ? `地点：${event.location}\n` : ''}${event.participants?.length ? `参与人：${event.participants.join(', ')}\n` : ''}${event.tags?.length ? `标签：${event.tags.join(', ')}\n` : ''}${event.description ? `描述：${event.description}` : ''}`).join('\n')}

请生成一篇生动有趣的日记，包含对每个事件的感受和思考。要有感情和个人色彩，像真实的日记一样。`;

    if (!API_CONFIG.API_KEY) {
      throw new Error(locale === 'en' ? 'API Key not configured' : 'API Key 未配置');
    }

    try {
      const response = await fetch(API_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_CONFIG.API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: locale === 'en' 
                ? 'You are a diary writing assistant. Write diary entries in a personal, emotional, and reflective style. Include thoughts, feelings, and reactions to events. Make the writing feel authentic and intimate, like a real diary.'
                : '你是一个日记写作助手。以个人化、感性和反思的风格写作。包含对事件的想法、感受和反应。让写作风格真实自然，像真实的日记一样。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
          top_p: 0.95,
          frequency_penalty: 0.2,
          presence_penalty: 0.1,
          stop: null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('API Error:', errorData);
        throw new Error(locale === 'en' 
          ? `API request failed: ${response.status} ${response.statusText}`
          : `API 请求失败: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.error) {
        console.error('API Error:', data.error);
        throw new Error(locale === 'en'
          ? `API error: ${data.error.message || 'Unknown error'}`
          : `API 错误: ${data.error.message || '未知错误'}`
        );
      }

      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        console.error('API Response structure:', data);
        throw new Error(locale === 'en'
          ? 'Unable to extract content from API response'
          : '无法从 API 响应中提取内容'
        );
      }

      return content;
    } catch (error) {
      console.error(locale === 'en' ? 'Error generating diary:' : '生成日记时出错:', error);
      throw error;
    }
  };

  const handleExportDiary = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const selectedEvents = events.filter(event => {
        const eventDate = new Date(event.startTime);
        return eventDate.toDateString() === selectedDate.toDateString();
      });

      if (selectedEvents.length === 0) {
        setError(locale === 'en' 
          ? 'No events scheduled for the selected date'
          : '所选日期没有日程安排'
        );
        return;
      }

      const diaryContent = await generateDiaryContent(selectedEvents);
      
      const dateHeader = locale === 'en'
        ? `Diary - ${format(selectedDate, 'EEEE, MMMM d, yyyy')}\n\n`
        : `日记 - ${format(selectedDate, 'yyyy年MM月dd日 EEEE')}\n\n`;
      
      const fullContent = dateHeader + diaryContent;
      
      const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diary-${format(selectedDate, 'yyyy-MM-dd')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
      setError(locale === 'en'
        ? 'Error generating diary, please try again later'
        : '生成日记时出错，请稍后重试'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const monthStart = startOfMonth(selectedDate);
    const newDate = direction === 'prev' 
      ? new Date(monthStart.setMonth(monthStart.getMonth() - 1))
      : new Date(monthStart.setMonth(monthStart.getMonth() + 1));
    setSelectedDate(newDate);
  };

  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const firstDay = startOfWeek(monthStart, { locale: getDateFnsLocale(locale) });
  const lastDay = endOfWeek(monthEnd, { locale: getDateFnsLocale(locale) });
  const days = eachDayOfInterval({ start: firstDay, end: lastDay });

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#fafafa'
      }}
    >
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${THEME.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#fff'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedDate(new Date())}
            sx={{
              borderColor: THEME.border,
              color: THEME.text.primary,
              '&:hover': {
                borderColor: THEME.primary,
                bgcolor: THEME.hover,
              }
            }}
          >
            {t('today')}
          </Button>
          <ButtonGroup 
            size="small"
            sx={{
              '& .MuiButtonBase-root': {
                borderColor: THEME.border,
                color: THEME.text.primary,
                '&:hover': {
                  borderColor: THEME.primary,
                  bgcolor: THEME.hover,
                }
              }
            }}
          >
            <IconButton onClick={() => navigateDate('prev')}>
              <ChevronLeftIcon />
            </IconButton>
            <IconButton onClick={() => navigateDate('next')}>
              <ChevronRightIcon />
            </IconButton>
          </ButtonGroup>
          <Typography variant="h6" sx={{ 
            fontSize: '1rem', 
            fontWeight: 500,
            color: THEME.text.primary,
          }}>
            {format(selectedDate, locale === 'en' ? 'MMMM yyyy' : 'yyyy年MM月', { locale: getDateFnsLocale(locale) })}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{ 
          height: 'calc(100vh - 64px)', 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 星期标题行 */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)',
            borderBottom: `1px solid ${THEME.border}`,
            bgcolor: '#fff',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}>
            {translations[locale].weekDays.map((day: string) => (
              <Box 
                key={day}
                sx={{ 
                  py: 1,
                  textAlign: 'center',
                  color: THEME.text.secondary,
                  fontSize: '13px',
                }}
              >
                {day}
              </Box>
            ))}
          </Box>

          {/* 日期网格 */}
          <Box sx={{ 
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            borderLeft: `1px solid ${THEME.border}`,
          }}>
            {days.map((day) => {
              const dayEvents = events.filter(event => isSameDay(event.startTime, day));
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, selectedDate);
              const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
              const isFuture = day > new Date(new Date().setHours(23, 59, 59, 999));

              return (
                <Box
                  key={day.toISOString()}
                  onClick={() => handleDayClick(day)}
                  sx={{
                    borderRight: `1px solid ${THEME.border}`,
                    borderBottom: `1px solid ${THEME.border}`,
                    p: 1,
                    cursor: 'pointer',
                    bgcolor: isSelected 
                      ? THEME.selected 
                      : isPast 
                        ? THEME.past 
                        : THEME.future,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: isSelected ? THEME.selected : THEME.hover,
                    },
                  }}
                >
                  {/* 日期显示 */}
                  <Box sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: isToday ? 500 : 400,
                        color: !isCurrentMonth 
                          ? THEME.text.disabled
                          : isToday 
                            ? THEME.primary
                            : isPast 
                              ? THEME.text.past
                              : THEME.text.primary,
                      }}
                    >
                      {!isCurrentMonth && format(day, 'M') !== format(selectedDate, 'M')
                        ? format(day, locale === 'en' ? 'MMM d' : 'M月d日', { locale: getDateFnsLocale(locale) })
                        : format(day, locale === 'en' ? 'd' : 'd', { locale: getDateFnsLocale(locale) })}
                    </Typography>
                  </Box>

                  {/* 事件列表 */}
                  <Stack spacing={0.5}>
                    {dayEvents.slice(0, 2).map(event => (
                      <Box
                        key={event.id}
                        sx={{
                          fontSize: '12px',
                          color: isPast ? THEME.text.past : THEME.primary,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            bgcolor: isPast ? THEME.text.past : THEME.primary,
                            flexShrink: 0,
                          }}
                        />
                        <Box
                          sx={{
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {format(event.startTime, 'HH:mm')} {event.title}
                        </Box>
                      </Box>
                    ))}
                    {dayEvents.length > 2 && (
                      <Typography
                        sx={{
                          fontSize: '12px',
                          color: isPast ? THEME.text.past : THEME.text.secondary,
                          pl: 1,
                        }}
                      >
                        {t('more')} {dayEvents.length - 2} {locale === 'en' ? 'items' : '项'}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          mb: 3 
        }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleExportDiary}
            disabled={isGenerating}
          >
            {isGenerating ? <CircularProgress size={24} /> : t('exportDiary')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="h6" sx={{ mb: 2 }}>
          {format(selectedDate, locale === 'en' ? 'EEEE, MMMM d, yyyy' : 'yyyy年MM月dd日 EEEE')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Calendar;