import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Login } from '@/components/Login'
import LandingPage from '@/components/LandingPage'
import SignUp from '@/components/SignUp'
import { Dashboard } from '@/components/Dashboard'
import { ContentGenerationPage } from '@/components/ContentGenerationPage'
import { ContentViewPage } from '@/components/ContentViewPage'

import { LogOut, Bot } from 'lucide-react'
import { supabase } from '@/lib/supabase'

function AuthCallback() {
  // Handle the callback from Supabase Auth
  React.useEffect(() => {
    const handleAuthCallback = async () => {
      const hashFragment = window.location.hash
      
      if (hashFragment && hashFragment.length > 0) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(hashFragment)
          
          if (error) {
            console.error('Error exchanging code for session:', error.message)
            window.location.href = '/login?error=' + encodeURIComponent(error.message)
            return
          }
          
          if (data.session) {
            window.location.href = '/dashboard'
            return
          }
        } catch (error) {
          console.error('Auth callback error:', error)
        }
      }
      
      window.location.href = '/login?error=No session found'
    }
    
    handleAuthCallback()
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gradient animate-pulse">
          <Bot className="h-7 w-7 text-white" />
        </div>
        <p className="text-brand-accent font-heading font-medium">Completing sign in...</p>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gradient animate-pulse">
          <Bot className="h-7 w-7 text-white" />
        </div>
          <p className="text-brand-accent font-heading font-medium">Loading DailyByte...</p>
        </div>
      </div>
    )
  }
  
  if (!user) {
    console.log('User not authenticated, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  console.log('User authenticated:', user.email)
  return (
    <div className="relative">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-10">
        <LogoutButton />
      </div>
      {children}
    </div>
  )
}

function LogoutButton() {
  const { signOut } = useAuth()
  
  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }
  
  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-white text-gray-700 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
    >
      <LogOut className="h-4 w-4" />
      <span>Sign Out</span>
    </button>
  )
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center mx-auto mb-4 shadow-gradient animate-pulse">
          <Bot className="h-7 w-7 text-white" />
        </div>
          <p className="text-brand-accent font-heading font-medium">Loading DailyByte...</p>
        </div>
      </div>
    )
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

function AppContent() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/" element={<LandingPage />} />
      
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      
      <Route
        path="/auth/callback"
        element={<AuthCallback />}
      />
      

      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/content-generation/:storyId?"
        element={
          <ProtectedRoute>
            <ContentGenerationPage />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/content-view/:storyId"
        element={<ContentViewPage />}
      />
      
      {/* Catch all route - redirect to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App