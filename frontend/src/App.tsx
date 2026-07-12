import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Toaster } from 'sonner'
import { ProtectedRoute } from './components/Auth/ProtectedRoute'
import { Layout } from './components/Layout/Layout'
import { AuthProvider } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { ThemeProvider } from './context/ThemeContext'
import { LoginPage } from './pages/LoginPage'
import { ChatPage } from './pages/ChatPage'
import { CompetitionPage } from './pages/CompetitionPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { AboutPage } from './pages/AboutPage'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

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
                    <Route path="competitions" element={<CompetitionPage />} />
                    <Route path="leaderboard" element={<LeaderboardPage />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster position="top-right" richColors />
            </ChatProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ThemeProvider>
  )
}
