import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'sonner';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { ChatPage } from './pages/ChatPage';
import { LecturesPage } from './pages/LecturesPage';
import { LecturersPage } from './pages/LecturersPage';
import { HallsPage } from './pages/HallsPage';
import { AboutPage } from './pages/AboutPage';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

export function App() {
  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <BrowserRouter>
          <AuthProvider>
            <ChatProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<ChatPage />} />
                    <Route path="lectures" element={<LecturesPage />} />
                    <Route path="lecturers" element={<LecturersPage />} />
                    <Route path="halls" element={<HallsPage />} />
                    <Route path="about" element={<AboutPage />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster position="top-right" richColors />
            </ChatProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>);

}