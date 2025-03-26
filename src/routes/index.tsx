import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Calendar from '../components/Calendar';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';
import UserSettings from '../components/settings/UserSettings';

const AppRoutes: React.FC = () => {
  const { user, register, locale } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <Register 
              onRegister={register}
              onNavigateToLogin={() => window.location.href = '/login'}
              locale={locale}
            />
          )
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Calendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <EventList 
              selectedDate={new Date()}
              events={[]}
              onEditEvent={() => {}}
              onDeleteEvent={() => {}}
              onAddEvent={() => {}}
              locale={locale}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        }
      />

      {/* 404 route */}
      <Route
        path="*"
        element={
          <Navigate to="/" replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes; 