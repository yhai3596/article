import { useState, useEffect } from 'react'
import { Save, Mail, Clock, Bell, User, Shield } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'

interface UserPreferences {
  id?: number
  user_id: string
  email: string
  schedule_time: string
  notification_settings: {
    email_enabled: boolean
    daily_digest: boolean
    breaking_news: boolean
  }
  platform_priorities: {
    instagram: boolean
    linkedin: boolean
    x: boolean
  }
  is_active: boolean
}

export function UserSettings() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<UserPreferences>({
    user_id: user?.id || '',
    email: user?.email || '',
    schedule_time: '09:00:00',
    notification_settings: {
      email_enabled: true,
      daily_digest: true,
      breaking_news: false
    },
    platform_priorities: {
      instagram: true,
      linkedin: true,
      x: true
    },
    is_active: true
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load user preferences on component mount
  useEffect(() => {
    if (user) {
      loadUserPreferences()
    }
  }, [user])

  const loadUserPreferences = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
      
      if (error) throw error
      
      if (data) {
        setPreferences({
          ...data,
          notification_settings: data.notification_settings || preferences.notification_settings,
          platform_priorities: data.platform_priorities || preferences.platform_priorities
        })
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
      setMessage({ type: 'error', text: 'Failed to load preferences' })
    } finally {
      setLoading(false)
    }
  }

  const savePreferences = async () => {
    if (!user) return
    
    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          ...preferences,
          user_id: user.id,
          updated_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      setMessage({ type: 'success', text: 'Preferences saved successfully!' })
    } catch (error) {
      console.error('Error saving preferences:', error)
      setMessage({ type: 'error', text: 'Failed to save preferences' })
    } finally {
      setSaving(false)
    }
  }

  const updateNotificationSetting = (key: keyof typeof preferences.notification_settings, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notification_settings: {
        ...prev.notification_settings,
        [key]: value
      }
    }))
  }

  const updatePlatformPriority = (key: keyof typeof preferences.platform_priorities, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      platform_priorities: {
        ...prev.platform_priorities,
        [key]: value
      }
    }))
  }

  const sendTestEmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('email-sender', {
        body: {
          recipientEmail: preferences.email
        }
      })
      
      if (error) throw error
      setMessage({ type: 'success', text: 'Test email sent successfully!' })
    } catch (error) {
      console.error('Error sending test email:', error)
      setMessage({ type: 'error', text: 'Failed to send test email' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account preferences and notification settings.</p>
      </div>

      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={preferences.email}
                onChange={(e) => setPreferences(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="active"
                  checked={preferences.is_active}
                  onChange={(e) => setPreferences(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="text-sm text-gray-700">
                  Account Active (receive content)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Clock className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Schedule Settings</h3>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Content Delivery Time
            </label>
            <input
              type="time"
              value={preferences.schedule_time.substring(0, 5)}
              onChange={(e) => setPreferences(prev => ({ ...prev, schedule_time: e.target.value + ':00' }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Content will be generated and emailed at this time daily (UTC).
            </p>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                <p className="text-sm text-gray-600">Receive emails with generated content</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_settings.email_enabled}
                onChange={(e) => updateNotificationSetting('email_enabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Daily Digest</label>
                <p className="text-sm text-gray-600">Get a summary of daily AI news and content</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_settings.daily_digest}
                onChange={(e) => updateNotificationSetting('daily_digest', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Breaking News Alerts</label>
                <p className="text-sm text-gray-600">Immediate notifications for major AI developments</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.notification_settings.breaking_news}
                onChange={(e) => updateNotificationSetting('breaking_news', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={sendTestEmail}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <Mail className="h-4 w-4" />
              <span>Send Test Email</span>
            </button>
          </div>
        </div>

        {/* Platform Priorities */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Shield className="h-6 w-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Platform Priorities</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Instagram Content</label>
                <p className="text-sm text-gray-600">Generate Instagram Reel scripts</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.platform_priorities.instagram}
                onChange={(e) => updatePlatformPriority('instagram', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">LinkedIn Content</label>
                <p className="text-sm text-gray-600">Generate professional LinkedIn posts</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.platform_priorities.linkedin}
                onChange={(e) => updatePlatformPriority('linkedin', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">X (Twitter) Content</label>
                <p className="text-sm text-gray-600">Generate Twitter/X thread content</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.platform_priorities.x}
                onChange={(e) => updatePlatformPriority('x', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={savePreferences}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            <Save className="h-4 w-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}