import React, { useState } from 'react'
import { Bot, Home, LogOut, Menu, X } from 'lucide-react'
import { DemoMode } from './DemoMode'

export function DemoDashboard() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleGenerateContent = async (storyId?: number) => {
    setIsGenerating(true)
    // Simulate content generation delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
  }

  const handleSendEmail = () => {
    alert('Email preview feature - In production, this would open the email preview!')
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-soft">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-heading font-bold text-xl text-brand-accent">DailyByte</span>
                <span className="text-xs text-gray-500 font-medium block leading-none">Demo Mode</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-brand-accent px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 hover:text-brand-accent p-2"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <button
                onClick={handleGoHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-brand-accent px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors w-full"
              >
                <Home className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-brand-accent mb-2">
            Welcome to DailyByte Demo
          </h1>
          <p className="text-gray-600 font-body leading-body">
            Experience all features with realistic sample data. No account required!
          </p>
        </div>

        <DemoMode
          onGenerateContent={handleGenerateContent}
          onSendEmail={handleSendEmail}
          isGenerating={isGenerating}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-brand-accent">DailyByte</span>
            </div>
            <p className="text-gray-600 font-body text-sm mb-4">
              Ready to start generating real AI content?
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => window.location.href = '/signup'}
                className="btn-accent px-6 py-2 text-sm"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="btn-secondary px-6 py-2 text-sm"
              >
                Sign In
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-4 opacity-60">
              Created by <span className="font-medium">MiniMax Agent</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}