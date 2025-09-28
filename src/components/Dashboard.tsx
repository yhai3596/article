import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Bot, Calendar, Mail, TrendingUp, RefreshCw, Play, Settings, Filter, ArrowRight, ExternalLink, Image, Copy, Clock, Star, Flame, CheckCircle, Globe, Activity, Shield, Database, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ContentPreview } from '@/components/ContentPreview'
import { NewsStoryCard } from '@/components/NewsStoryCard'
import { UserSettings } from '@/components/UserSettings'
import { ContentHistory } from '@/components/ContentHistory'
import { FeatureStatus } from '@/components/FeatureStatus'
import { EmailPreview } from '@/components/EmailPreview'
import { ApiStatus } from '@/components/ApiStatus'



interface NewsStory {
  id: number
  source: string
  title: string
  content: string
  url: string
  publication_date: string
  credibility_score: number
  selected_status: boolean
  created_at: string
  category_id?: number
  tags?: string[]
  engagement_score?: number
  reading_time?: number
  api_source?: string
}

interface GeneratedContent {
  id: number
  story_id: number
  platform: string
  content_text: string
  image_url?: string
  generation_date: string
  hashtags?: string[]
  platform_specific_data?: any
  engagement_metrics?: any
  share_url?: string
  is_shared?: boolean
}

// Publisher logos mapping with reliable URLs
const publisherLogos: Record<string, string> = {
  'Reuters': '/images/reuters-logo.png',
  'TechCrunch': '/images/techcrunch-logo.png', 
  'The Verge': '/images/verge-logo.png',
  'Wired': '/images/wired-logo.png',
  'Ars Technica': '/images/arstechnica-logo.png',
  'MIT Technology Review': '/images/mit-logo.png',
  'VentureBeat': '/images/venturebeat-logo.png',
  'OpenAI Blog': '/images/openai-logo.png',
  'Google DeepMind': '/images/google-logo.png',
  'Meta AI': '/images/meta-logo.png',
  'Microsoft': '/images/microsoft-logo.png',
  'Anthropic': '/images/anthropic-logo.png'
}

export function Dashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('news')

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [operatingMode, setOperatingMode] = useState<'demo' | 'limited' | 'production'>('production')
  const [showEmailPreview, setShowEmailPreview] = useState(false)

  const [refreshArticles, setRefreshArticles] = useState<any[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showContentMenu, setShowContentMenu] = useState<string | null>(null)
  const [generatingContent, setGeneratingContent] = useState<string | null>(null)
  const [generatedContentMap, setGeneratedContentMap] = useState<{[key: string]: any}>({})
  const [articleStats, setArticleStats] = useState<{
    total: number
    newlyAdded: number
    earliestDate: string | null
    latestDate: string | null
    workingApis?: string[]
    apiResults?: {[key: string]: number}
    premiumSources?: number
  }>({ total: 0, newlyAdded: 0, earliestDate: null, latestDate: null })
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage] = useState(50)

  // Publisher icon generator with styled text fallbacks
  const getPublisherIcon = (source: string) => {
    const publisherColors: Record<string, string> = {
      'Reuters': 'bg-orange-500',
      'TechCrunch': 'bg-green-500', 
      'The Verge': 'bg-purple-500',
      'Wired': 'bg-red-500',
      'Ars Technica': 'bg-blue-500',
      'MIT Technology Review': 'bg-indigo-500',
      'VentureBeat': 'bg-yellow-500',
      'OpenAI Blog': 'bg-gray-800',
      'Google DeepMind': 'bg-blue-600',
      'Meta AI': 'bg-blue-700',
      'Microsoft': 'bg-blue-500',
      'Anthropic': 'bg-orange-600'
    }
    
    const getInitials = (name: string) => {
      return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
    }
    
    const colorClass = publisherColors[source] || 'bg-brand-primary'
    const initials = getInitials(source)
    
    return (
      <div className={`w-full h-full ${colorClass} rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    )
  }



  // Fetch articles using premium AI aggregator for fresh 50+ articles
  const fetchRealTimeNews = async () => {
    setIsRefreshing(true)
    try {
      console.log('Fetching fresh premium AI news (50+ articles target)...')
      
      // Use the new premium AI aggregator for fresh content on each refresh
      const { data: fetchResult, error: fetchError } = await supabase.functions.invoke('premium-ai-news-aggregator', {
        body: { 
          premium_mode: true,
          source: 'dashboard_refresh'
        }
      })
      
      if (fetchError) {
        console.error('Premium AI aggregator error:', fetchError)
        throw fetchError
      }
      
      if (!fetchResult?.data) {
        throw new Error('No data returned from premium AI aggregator')
      }
      
      console.log('Premium AI aggregator result:', fetchResult.data)
      
      // Transform articles for display (fresh articles, no database storage)
      const freshArticles = (fetchResult.data.articles || []).map((article: any) => ({
        id: article.id,
        title: article.title,
        summary: article.content,
        content: article.content,
        url: article.url,
        source: article.source,
        published_at: article.published_at,
        created_at: new Date().toISOString(),
        api_source: article.api_source,
        query_source: article.query_source,
        credibility_score: article.credibility_score,
        is_premium_source: article.is_premium_source,
        source_bonus: article.source_bonus,
        category: article.category,
        tags: article.tags || [],
        engagement_score: Math.floor(Math.random() * 20) + 80, // 80-99
        reading_time_minutes: Math.ceil((article.content?.length || 100) / 200),
        relevance_score: article.credibility_score,
        is_featured: article.is_premium_source
      }))
      
      setRefreshArticles(freshArticles)
      setLastUpdate(new Date().toLocaleString())
      
      // Update statistics with premium AI data
      if (fetchResult?.data) {
        setArticleStats({
          total: fetchResult.data.articleCount || 0,
          newlyAdded: fetchResult.data.articleCount || 0,
          earliestDate: null, // Fresh content doesn't need earliest date
          latestDate: fetchResult.data.fetchTimestamp,
          workingApis: fetchResult.data.workingApis || [],
          apiResults: fetchResult.data.apiResults || {},
          premiumSources: fetchResult.data.premiumSources || 0
        })
      }
      
    } catch (error) {
      console.error('Error in premium AI news fetch:', error)
      // No fallback needed - always fetch fresh content
      setRefreshArticles([])
      
      // Show user-friendly error message
      alert('Unable to fetch fresh AI news. Please check your connection and try again.')
    } finally {
      setIsRefreshing(false)
    }
  }

  // No longer needed with fresh content approach - removed helper functions



  // Fetch generated content
  const fetchGeneratedContent = async () => {
    try {
      // Use the correct table where content is actually saved
      const { data, error } = await supabase
        .from('generated_content')
        .select('*')
        .order('generation_date', { ascending: false })
        .limit(20)
      
      if (error) {
        console.error('Error fetching generated content:', error)
        return
      }
      
      console.log('Fetched generated content:', data?.length || 0, 'items')
      setGeneratedContent(data || [])
    } catch (error) {
      console.error('Exception fetching generated content:', error)
    }
  }

  // Refresh news on demand
  const refreshNews = async () => {
    await fetchRealTimeNews()
  }

  // Generate content for a specific story with platform selection
  const generateContentForStory = async (storyId: string) => {
    console.log('Generate content button clicked for story:', storyId)
    setShowContentMenu(storyId === showContentMenu ? null : storyId)
  }
  
  // Generate content for specific platform
  const generatePlatformContent = async (storyId: string, platform: string) => {
    console.log('Generating content for:', { storyId, platform })
    setGeneratingContent(`${storyId}_${platform}`)
    setShowContentMenu(null)
    
    try {
      // Find the article data from refreshArticles (for fresh articles)
      const articleData = refreshArticles.find(article => article.id === storyId);
      
      const requestBody: any = {
        platform: platform
      };
      
      // If we found article data in refreshArticles, pass it directly
      // Otherwise, use news_id for database lookup (legacy articles)
      if (articleData) {
        console.log('Using fresh article data:', articleData.title);
        requestBody.article_data = {
          id: articleData.id,
          title: articleData.title,
          summary: articleData.summary || articleData.content,
          content: articleData.content || articleData.summary,
          url: articleData.url,
          source: articleData.source
        };
        requestBody.news_id = storyId; // Still include ID for reference
      } else {
        console.log('Using database lookup for article ID:', storyId);
        requestBody.news_id = storyId;
      }
      
      const { data, error } = await supabase.functions.invoke('generate', {
        body: requestBody
      })
      
      console.log('Generate response:', { data, error })
      
      if (error) throw error
      
      // Store generated content for display
      setGeneratedContentMap(prev => ({
        ...prev,
        [`${storyId}_${platform}`]: data.data
      }))
      
      // Show success message with better feedback
      console.log(`Content generated successfully for ${platform}`)
      
      // Switch to Generated Content tab automatically for better UX
      setTimeout(() => {
        setActiveTab('content')
      }, 1000)
      
      alert(`Content generated for ${platform}!\n\nThe content is now available in the "Generated Content" tab where you can copy and download it.`)
      
    } catch (error) {
      console.error('Error generating content:', error)
      alert(`Failed to generate content for ${platform}. Please try again. Error: ${error.message || 'Unknown error'}`)
    } finally {
      setGeneratingContent(null)
    }
  }

  // Handle email sending
  const sendTestEmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('email-sender-enhanced', {
        body: {
          recipientEmail: 'test@dailybyte.ai',
          mode: 'production'
        }
      })
      
      if (error) throw error
      console.log('Test email sent:', data)
      
      if (data.status === 'preview' || data.method?.includes('preview')) {
        setShowEmailPreview(true)
      } else {
        alert('Test email sent successfully!')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      setShowEmailPreview(true)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchGeneratedContent()
    fetchRealTimeNews()
  }, [])
  
  // Close content menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showContentMenu && !target.closest('.relative')) {
        setShowContentMenu(null)
      }
    }
    
    if (showContentMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showContentMenu])






  const recentContent = generatedContent.filter(content => {
    const twoDaysAgo = new Date()
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48)
    const contentDate = new Date(content.generation_date)
    return contentDate >= twoDaysAgo
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background">
      {/* Feature Status Component */}
      <FeatureStatus mode={operatingMode} />

      
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-soft sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-soft">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-heading text-xl font-bold text-brand-accent">DailyByte</h1>
                <p className="text-xs text-gray-500 font-medium whitespace-nowrap">Transform news into content</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* API Status Indicator */}
              <ApiStatus className="hidden sm:flex" />
              
              <button
                onClick={refreshNews}
                disabled={isRefreshing}
                className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Fetching 50+ Fresh Articles...' : 'Get 50+ Fresh Articles'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'news', label: 'Latest News', icon: TrendingUp },
              { id: 'content', label: 'Generated Content', icon: Calendar },
              { id: 'history', label: 'Content History', icon: Mail },
              { id: 'api-status', label: 'API Status', icon: Activity },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    console.log(`Switching to tab: ${tab.id}`)
                    setActiveTab(tab.id)
                  }}
                  className={`py-4 px-1 border-b-2 font-heading font-medium text-sm flex items-center space-x-2 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-brand-primary text-brand-primary bg-gradient-to-t from-brand-primary/5 to-transparent'
                      : 'border-transparent text-gray-500 hover:text-brand-accent hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'news' && (
          <div className="space-y-4">


            {/* Premium AI News Status Bar */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Fresh Articles Count */}
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-lg font-bold text-purple-800">
                      {articleStats.total > 0 ? `${articleStats.total} Fresh Articles` : 'Premium AI News Feed'}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      {articleStats.total >= 50 ? '50+ Articles' : 'Fresh Content'}
                    </span>
                  </div>
                  
                  {/* Premium Sources Count */}
                  {articleStats.premiumSources && articleStats.premiumSources > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">
                        {articleStats.premiumSources} Premium Sources
                      </span>
                      <span className="text-xs text-yellow-600">
                        (FutureTools, MarkTechPost, TechCrunch AI, etc.)
                      </span>
                    </div>
                  )}
                  
                  {/* API Sources Indicator */}
                  {articleStats.workingApis && articleStats.workingApis.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {articleStats.workingApis.length} APIs Active
                      </span>
                      <span className="text-xs text-green-600">
                        ({articleStats.workingApis.join(', ')})
                      </span>
                    </div>
                  )}
                  {/* Last Refreshed */}
                  {lastUpdate && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Fresh content: {new Date(lastUpdate).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-600">
                  {refreshArticles.length} articles displayed • {articleStats.newlyAdded > 0 && `${articleStats.newlyAdded} fresh • `}
                  <span className="ml-2 text-purple-600 font-medium">• Premium AI Sources • Fresh on every refresh</span>
                  {articleStats.apiResults && (
                    <div className="mt-1 text-xs text-gray-500">
                      API Sources: {Object.entries(articleStats.apiResults).map(([api, count]) => `${api}: ${count}`).join(' • ')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* News Feed */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-accent">
                  Premium AI News Feed
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-500 font-body">
                    {refreshArticles.length} articles displayed • Powered by Premium AI Sources (FutureTools, MarkTechPost, TechCrunch AI)
                  </div>
                  {articleStats.newlyAdded >= 50 && (
                    <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-purple-500 shadow-soft flex items-center space-x-1">
                      <Zap className="h-3 w-3" />
                      <span>50+ Fresh Articles</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid gap-3">
                {refreshArticles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className={`w-8 h-8 text-purple-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isRefreshing ? 'Fetching 50+ Fresh AI Articles...' : 'No articles loaded yet'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {isRefreshing ? 'Searching premium AI sources for the latest developments' : 'Click "Get 50+ Fresh Articles" to load premium AI news from top sources'}
                    </p>
                    {!isRefreshing && (
                      <button
                        onClick={refreshNews}
                        className="btn-primary text-sm px-4 py-2"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Get 50+ Fresh Articles
                      </button>
                    )}
                  </div>
                ) : (
                  refreshArticles.map((story, index) => (
                    <div key={story.id} className="card-neumorphic p-5 hover:shadow-gradient transition-all duration-300 group">
                      <div className="flex items-start gap-5">
                        {/* Publisher Logo with Robust Fallback */}
                        <div className="flex-shrink-0">
                          <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-soft overflow-hidden">
                            {getPublisherIcon(story.source)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-sm font-heading font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-pill">
                              {story.source}
                            </span>
                            
                            {/* Premium Source indicator */}
                            {story.is_premium_source && (
                              <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-yellow-500 shadow-soft flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>Premium</span>
                              </span>
                            )}
                            
                            {/* Fresh content indicator */}
                            <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-green-500 shadow-soft flex items-center space-x-1">
                              <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                              <span>Fresh</span>
                            </span>
                            
                            {/* API Source Attribution */}
                            {story.api_source && (
                              <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-indigo-500 shadow-soft flex items-center space-x-1">
                                <Activity className="h-3 w-3" />
                                <span>{story.api_source}</span>
                              </span>
                            )}
                            
                            {story.category && (
                              <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-purple-500 shadow-soft">
                                {story.category}
                              </span>
                            )}
                            
                            {story.is_featured && (
                              <span className="px-3 py-1 rounded-pill text-xs font-medium text-white bg-yellow-500 shadow-soft flex items-center space-x-1">
                                <Star className="h-3 w-3" />
                                <span>Featured</span>
                              </span>
                            )}
                            
                            <span className="text-sm text-gray-500 font-body">
                              {new Date(story.published_at).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <h3 className="font-heading text-xl font-bold text-brand-accent mb-3 group-hover:text-brand-primary transition-colors">
                            {story.title}
                          </h3>
                          
                          <p className="text-gray-600 font-body leading-relaxed mb-4 line-clamp-2">
                            {story.summary || story.content.substring(0, 200)}...
                          </p>
                          
                          {/* Metrics with Icons - Restored All Icons */}
                          <div className="flex items-center space-x-5 mb-4">
                            <div className="flex items-center space-x-1 text-sm font-medium">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-gray-600">Credibility:</span>
                              <span className="text-green-600">{story.credibility_score || 95}%</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm font-medium">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="text-gray-600">Engagement:</span>
                              <span className="text-orange-600">{story.engagement_score || story.relevance_score || 85}/100</span>
                            </div>
                            {story.reading_time_minutes && (
                              <div className="flex items-center space-x-1 text-sm font-medium">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-600">Reading:</span>
                                <span className="text-blue-600">{story.reading_time_minutes} min</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Hashtags at Bottom */}
                          {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {story.tags.slice(0, 3).map((tag, tagIndex) => (
                                <span key={tagIndex} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                  #{tag}
                                </span>
                              ))}
                              {story.tags.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                  +{story.tags.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Action Buttons with Clear Hierarchy - Compact */}
                          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log('Generate button clicked for story:', story.id)
                                  generateContentForStory(story.id)
                                }}
                                className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                              >
                                <Bot className="h-4 w-4" />
                                <span>Generate Content</span>
                              </button>
                              
                              {/* Platform Selection Menu */}
                              {showContentMenu === story.id && (
                                <div 
                                  className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="p-2">
                                    <div className="text-sm font-medium text-gray-700 mb-2 px-2">Open Content in New Tab:</div>
                                    {[
                                      { id: 'instagram', name: 'Instagram', icon: '📱', color: 'bg-pink-500' },
                                      { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
                                      { id: 'x', name: 'X (Twitter)', icon: '🐦', color: 'bg-gray-900' },
                                      { id: 'facebook', name: 'Facebook', icon: '📘', color: 'bg-blue-700' },
                                      { id: 'threads', name: 'Threads', icon: '🧵', color: 'bg-gray-800' }
                                    ].map((platform) => (
                                      <button
                                        key={platform.id}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          console.log(`Opening content in new tab for ${platform.name} on story ${story.id}`)
                                          
                                          // Create URL with story data including summary and URL
                                          const contentUrl = `/content-view/${story.id}?platform=${platform.id}&title=${encodeURIComponent(story.title)}&source=${encodeURIComponent(story.source)}&summary=${encodeURIComponent(story.summary || story.content || '')}&url=${encodeURIComponent(story.url || '')}`
                                          
                                          // Open in new tab
                                          window.open(contentUrl, '_blank', 'noopener,noreferrer')
                                          
                                          // Close the menu
                                          setShowContentMenu(null)
                                        }}
                                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                                      >
                                        <span className="text-lg">{platform.icon}</span>
                                        <span className="text-sm font-medium">{platform.name}</span>
                                        <ExternalLink className="h-4 w-4 ml-auto text-gray-400" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <a 
                              href={story.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span>Read Article</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-accent">
                Generated Content
              </h2>
              <div className="text-sm text-gray-500">
                {generatedContent.length} items available
              </div>
            </div>
            
            {generatedContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No content generated yet</h3>
                <p className="text-gray-600 mb-4">Generate content from news articles to see them here</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                  <h4 className="font-semibold text-blue-900 mb-2">How to generate content:</h4>
                  <ol className="text-sm text-blue-800 space-y-1">
                    <li>1. Go to the "Latest News" tab</li>
                    <li>2. Click "Generate Content" on any news card</li>
                    <li>3. Choose your platform (Instagram, LinkedIn, etc.)</li>
                    <li>4. Content will open in a new tab for viewing and copying</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {generatedContent.map((content) => {
                  const platformConfigs = {
                    instagram: { name: 'Instagram', icon: '📱', color: 'bg-pink-500' },
                    linkedin: { name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
                    x: { name: 'X (Twitter)', icon: '🐦', color: 'bg-gray-900' },
                    facebook: { name: 'Facebook', icon: '📘', color: 'bg-blue-700' },
                    threads: { name: 'Threads', icon: '🧵', color: 'bg-gray-800' }
                  }
                  const config = platformConfigs[content.platform as keyof typeof platformConfigs]
                  
                  return (
                    <div key={content.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <h3 className="font-semibold text-gray-900">{config.name}</h3>
                            <p className="text-sm text-gray-600">
                              Story ID: {content.story_id}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={async () => {
                              console.log('Copy button clicked for content:', content.id)
                              try {
                                const textToCopy = content.content_text
                                console.log('Attempting to copy text length:', textToCopy.length)
                                
                                await navigator.clipboard.writeText(textToCopy)
                                console.log('Copy successful')
                                alert('✅ Content copied to clipboard successfully!')
                              } catch (error) {
                                console.error('Clipboard API failed:', error)
                                // Fallback: select text for manual copy
                                try {
                                  const textToCopy = content.content_text
                                  const textArea = document.createElement('textarea')
                                  textArea.value = textToCopy
                                  document.body.appendChild(textArea)
                                  textArea.select()
                                  document.execCommand('copy')
                                  document.body.removeChild(textArea)
                                  console.log('Fallback copy successful')
                                  alert('✅ Content copied to clipboard successfully!')
                                } catch (fallbackError) {
                                  console.error('Fallback copy also failed:', fallbackError)
                                  alert('❌ Failed to copy to clipboard. Please select and copy the text manually.')
                                }
                              }
                            }}
                            className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Copy</span>
                          </button>
                          <button
                            onClick={() => {
                              const blob = new Blob([content.content_text], { type: 'text/plain' })
                              const url = URL.createObjectURL(blob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `${content.platform}_content_${new Date(content.generation_date).toISOString().slice(0, 10)}.txt`
                              a.click()
                              URL.revokeObjectURL(url)
                            }}
                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center space-x-1"
                          >
                            <ArrowRight className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Content Display with Platform-Specific Formatting */}
                      <div className="bg-gray-50 rounded p-4 border">
                        {content.platform === 'x' ? (
                          <div className="space-y-3">
                            {content.content_text.split('||TWEET_SEPARATOR||').map((tweet, index) => {
                              const tweetText = tweet.trim()
                              if (!tweetText) return null
                              const isValidTweet = tweetText.length <= 280
                              return (
                                <div key={index} className={`p-3 bg-white rounded border-l-4 ${
                                  isValidTweet ? 'border-green-400' : 'border-red-400'
                                }`}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-medium text-gray-600">
                                      Tweet {index + 1}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      isValidTweet 
                                        ? tweetText.length > 240 
                                          ? 'text-orange-700 bg-orange-100' 
                                          : 'text-green-700 bg-green-100'
                                        : 'text-red-700 bg-red-100'
                                    }`}>
                                      {tweetText.length}/280
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                                    {tweetText}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                            {content.content_text}
                          </div>
                        )}
                      </div>
                      
                      {/* Hashtags */}
                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Hashtags:</h4>
                          <div className="flex flex-wrap gap-2">
                            {content.hashtags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>Generated: {new Date(content.generation_date).toLocaleDateString()}</span>
                        <span>{content.content_text.length} characters</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            
            {/* Also show any on-demand generated content */}
            {Object.keys(generatedContentMap).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recently Generated</h3>
                <div className="grid gap-6">
                  {Object.entries(generatedContentMap).map(([key, content]) => {
                    const [newsId, platform] = key.split('_')
                    const newsItem = refreshArticles.find(item => item.id === newsId)
                    const platformConfigs = {
                      instagram: { name: 'Instagram', icon: '📱', color: 'bg-pink-500' },
                      linkedin: { name: 'LinkedIn', icon: '💼', color: 'bg-blue-600' },
                      x: { name: 'X (Twitter)', icon: '🐦', color: 'bg-gray-900' },
                      facebook: { name: 'Facebook', icon: '📘', color: 'bg-blue-700' },
                      threads: { name: 'Threads', icon: '🧵', color: 'bg-gray-800' }
                    }
                    const config = platformConfigs[platform as keyof typeof platformConfigs]
                    
                    return (
                      <div key={key} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{config.icon}</span>
                            <div>
                              <h3 className="font-semibold text-gray-900">{config.name}</h3>
                              <p className="text-sm text-gray-600 truncate max-w-md">
                                {newsItem?.title || 'News article'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={async () => {
                                console.log('Copy button clicked for on-demand content:', content)
                                try {
                                  const textToCopy = content?.content || 'No content available'
                                  console.log('Attempting to copy text:', textToCopy.substring(0, 100) + '...')
                                  
                                  await navigator.clipboard.writeText(textToCopy)
                                  console.log('Copy successful')
                                  alert('✅ Content copied to clipboard successfully!')
                                } catch (error) {
                                  console.error('Clipboard API failed:', error)
                                  // Fallback: select text for manual copy
                                  try {
                                    const textToCopy = content?.content || 'No content available'
                                    const textArea = document.createElement('textarea')
                                    textArea.value = textToCopy
                                    document.body.appendChild(textArea)
                                    textArea.select()
                                    document.execCommand('copy')
                                    document.body.removeChild(textArea)
                                    console.log('Fallback copy successful')
                                    alert('✅ Content copied to clipboard successfully!')
                                  } catch (fallbackError) {
                                    console.error('Fallback copy also failed:', fallbackError)
                                    alert('❌ Failed to copy to clipboard. Please select and copy the text manually.')
                                  }
                                }
                              }}
                              className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors flex items-center space-x-1"
                            >
                              <Copy className="h-4 w-4" />
                              <span>Copy</span>
                            </button>
                            <button
                              onClick={() => {
                                const blob = new Blob([content.content], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${platform}_content_${new Date().toISOString().slice(0, 10)}.txt`
                                a.click()
                                URL.revokeObjectURL(url)
                              }}
                              className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors flex items-center space-x-1"
                            >
                              <ArrowRight className="h-4 w-4" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded p-4 border">
                          <div className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                            {content.content}
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                          <span>Generated: {new Date().toLocaleDateString()}</span>
                          <span>{content.character_count || content.content?.length || 0} characters</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <ContentHistory content={generatedContent} stories={refreshArticles} />
        )}

        {activeTab === 'api-status' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-brand-accent">
                API Health Dashboard
              </h2>
              <div className="text-sm text-gray-500">
                Real-time monitoring of news API sources
              </div>
            </div>
            
            <ApiStatus showDetailed={true} />
            
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-heading text-lg font-semibold text-brand-accent mb-4">
                Multi-API System Overview
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Fallback Priority Order</h4>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                      <span>Serper API (Google Search)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                      <span>NewsAPI.org</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                      <span>Mediastack</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                      <span>GNews.io</span>
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">System Benefits</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span>Redundancy ensures continuous operation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <span>Parallel fetching for maximum coverage</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-purple-500" />
                      <span>Intelligent deduplication across sources</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span>Real-time health monitoring</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <UserSettings />
        )}
      </main>

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <EmailPreview 
          content={recentContent}
          story={refreshArticles[0] || null}
          onClose={() => setShowEmailPreview(false)}
        />
      )}
    </div>
  )
}