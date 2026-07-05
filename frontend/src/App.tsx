import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout/Layout';
import { ChatProvider } from './context/ChatContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatPage } from './pages/ChatPage';
import { LecturesPage } from './pages/LecturesPage';
import { LecturersPage } from './pages/LecturersPage';
import { HallsPage } from './pages/HallsPage';
import { AboutPage } from './pages/AboutPage';
export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ChatPage />} />
              <Route path="lectures" element={<LecturesPage />} />
              <Route path="lecturers" element={<LecturersPage />} />
              <Route path="halls" element={<HallsPage />} />
              <Route path="about" element={<AboutPage />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors />
        </ChatProvider>
      </BrowserRouter>
    </ThemeProvider>);

}