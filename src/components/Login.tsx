import { useState } from 'react'
import { Bot, Mail, Lock, User, ArrowRight, Sparkles, Eye, Shield } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface LoginProps {
  onSuccess?: () => void
}

export function Login({ onSuccess }: LoginProps) {
  const { signIn, signUp } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password)
        if (error) throw error
        setError('Check your email for the confirmation link!')
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
        onSuccess?.()
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-gradient">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-brand-accent">DailyByte</h1>
              <p className="text-xs text-gray-500 font-medium">AI Content Platform</p>
            </div>
          </div>
          <p className="text-gray-600 font-body leading-body">Transform AI news into engaging content</p>
        </div>

        {/* Login Form */}
        <div className="card-neumorphic p-8">
          <div className="mb-8">
            <h2 className="font-heading text-xl font-bold text-brand-accent mb-3">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-600 font-body text-sm leading-body">
              {isSignUp 
                ? 'Start generating professional AI content for all platforms' 
                : 'Sign in to access your content dashboard'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-heading font-medium text-brand-accent mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 font-body bg-white shadow-neumorphic-inset"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-heading font-medium text-brand-accent mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-200 font-body bg-white shadow-neumorphic-inset"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`text-sm p-4 rounded-xl ${
                error.includes('email') 
                  ? 'bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 text-brand-primary border border-brand-primary/20' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-accent py-3 text-base font-heading font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </button>
          </form>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-8 text-center border-t border-gray-200 pt-8">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setEmail('')
                setPassword('')
              }}
              className="text-brand-primary hover:text-brand-secondary text-sm font-heading font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : 'Need an account? Sign up'
              }
            </button>
          </div>


        </div>

        {/* Features */}
        <div className="mt-8">
          <div className="text-center mb-6">
            <h3 className="font-heading text-sm font-bold text-brand-accent mb-2">What you'll get:</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Sparkles, text: 'AI-powered content generation', color: 'text-brand-primary' },
              { icon: Eye, text: 'Multi-platform optimization', color: 'text-brand-secondary' },
              { icon: Shield, text: 'Professional email delivery', color: 'text-brand-success' }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center space-x-3 card-gradient p-3 rounded-xl">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-soft">
                    <Icon className={`h-4 w-4 ${feature.color}`} />
                  </div>
                  <span className="text-sm font-body text-gray-700">{feature.text}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}