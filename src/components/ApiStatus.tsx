import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Activity, AlertCircle, CheckCircle, Wifi, WifiOff, Clock, TrendingUp } from 'lucide-react'

interface ApiHealthStatus {
  id: number
  api_name: string
  status: 'healthy' | 'degraded' | 'down'
  last_successful_call: string | null
  last_failed_call: string | null
  response_time_ms: number | null
  error_message: string | null
  total_calls_today: number
  successful_calls_today: number
  updated_at: string
}

interface ApiStatusProps {
  className?: string
  showDetailed?: boolean
}

const apiDisplayNames = {
  serper: 'Serper API',
  newsapi: 'NewsAPI.org',
  mediastack: 'Mediastack',
  gnews: 'GNews.io'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy': return 'text-green-600 bg-green-100'
    case 'degraded': return 'text-yellow-600 bg-yellow-100'
    case 'down': return 'text-red-600 bg-red-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': return CheckCircle
    case 'degraded': return AlertCircle
    case 'down': return WifiOff
    default: return Wifi
  }
}

export function ApiStatus({ className = '', showDetailed = false }: ApiStatusProps) {
  const [apiHealthStatus, setApiHealthStatus] = useState<ApiHealthStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)

  const fetchApiHealth = async () => {
    try {
      const { data, error } = await supabase
        .from('api_health_status')
        .select('*')
        .order('api_name')
      
      if (error) {
        console.error('Error fetching API health:', error)
        return
      }
      
      setApiHealthStatus(data || [])
      setLastUpdate(new Date().toISOString())
    } catch (error) {
      console.error('Exception fetching API health:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiHealth()
    
    // Refresh API status every 30 seconds
    const interval = setInterval(fetchApiHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Activity className="h-4 w-4 text-gray-400 animate-pulse" />
        <span className="text-sm text-gray-500">Checking API status...</span>
      </div>
    )
  }

  const healthyApis = apiHealthStatus.filter(api => api.status === 'healthy')
  const degradedApis = apiHealthStatus.filter(api => api.status === 'degraded')
  const downApis = apiHealthStatus.filter(api => api.status === 'down')

  if (showDetailed) {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-brand-accent">API Health Status</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Last updated: {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'Unknown'}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {apiHealthStatus.map((api) => {
            const StatusIcon = getStatusIcon(api.status)
            const colorClasses = getStatusColor(api.status)
            
            return (
              <div key={api.api_name} className="card-neumorphic p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${colorClasses}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-brand-accent">
                        {apiDisplayNames[api.api_name as keyof typeof apiDisplayNames] || api.api_name}
                      </h4>
                      <p className="text-sm text-gray-500 capitalize">{api.status}</p>
                    </div>
                  </div>
                  
                  {api.response_time_ms && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700">{api.response_time_ms}ms</p>
                      <p className="text-xs text-gray-500">Response time</p>
                    </div>
                  )}
                </div>
                
                {api.last_successful_call && (
                  <p className="text-xs text-green-600 mb-1">
                    Last successful: {new Date(api.last_successful_call).toLocaleString()}
                  </p>
                )}
                
                {api.error_message && (
                  <p className="text-xs text-red-600 truncate" title={api.error_message}>
                    Error: {api.error_message}
                  </p>
                )}
              </div>
            )
          })}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800 font-medium">
            System Status: {healthyApis.length} healthy, {degradedApis.length} degraded, {downApis.length} down
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Multi-API fallback ensures continuous operation even when some services are unavailable.
          </p>
        </div>
      </div>
    )
  }

  // Compact status for header/status bar
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center space-x-1">
        {healthyApis.length > 0 && (
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">{healthyApis.length}</span>
          </div>
        )}
        
        {degradedApis.length > 0 && (
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">{degradedApis.length}</span>
          </div>
        )}
        
        {downApis.length > 0 && (
          <div className="flex items-center space-x-1">
            <WifiOff className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">{downApis.length}</span>
          </div>
        )}
      </div>
      
      <span className="text-sm text-gray-600">
        {apiHealthStatus.length > 0 ? (
          `${healthyApis.length}/${apiHealthStatus.length} APIs active`
        ) : (
          'API status loading...'
        )}
      </span>
      
      {healthyApis.length > 0 && (
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-3 w-3 text-green-500" />
          <span className="text-xs text-green-600 font-medium">Multi-source active</span>
        </div>
      )}
    </div>
  )
}