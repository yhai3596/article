import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Bot, ArrowLeft, ExternalLink, Share2, Copy, Check, Instagram, Linkedin, Twitter, Facebook, MessageCircle, LogOut, RefreshCw, Edit3 } from 'lucide-react'
import { useAuth } from '@/lib/auth'

interface GeneratedContent {
  id: number
  story_id: number
  platform: string
  content_text: string
  image_url?: string
  platform_specific_data?: {
    character_count: number
    word_count: number
    optimization_score: number
    platform_limits: {
      max_characters: number
      recommended_hashtags?: number
      recommended_length?: number
    }
    content_type: string
    generation_type: string
    hashtag_count?: number
    emoji_count?: number
    thread_count?: number
    tweets?: Array<{
      content: string
      length: number
      valid: boolean
    }>
  }
  hashtags?: string[]
  generation_date: string
}

interface NewsStory {
  id: number
  title: string
  content: string
  source: string
  url: string
}

const platformConfig = {
  instagram: {
    name: 'INSTAGRAM REEL SCRIPT',
    emoji: '📱',
    icon: Instagram,
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    textColor: 'text-white',
    borderColor: 'border-pink-300',
    bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
    headerBg: 'bg-gradient-to-r from-purple-600 to-pink-600',
    shareUrl: (content: string) => `https://www.instagram.com/create/story/`,
    description: 'Visual storytelling with emojis and hashtags',
    maxChars: 2200,
    font: 'font-medium',
    spacing: 'leading-relaxed'
  },
  linkedin: {
    name: 'LINKEDIN POST',
    emoji: '💼',
    icon: Linkedin,
    color: 'bg-blue-700',
    textColor: 'text-white',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    headerBg: 'bg-blue-700',
    shareUrl: (content: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://dailybyte.ai')}&summary=${encodeURIComponent(content)}`,
    description: 'Professional content with industry insights',
    maxChars: 3000,
    font: 'font-normal',
    spacing: 'leading-normal'
  },
  x: {
    name: 'X (TWITTER) THREAD',
    emoji: '🐦',
    icon: Twitter,
    color: 'bg-gray-900',
    textColor: 'text-white',
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-50',
    headerBg: 'bg-gray-900',
    shareUrl: (content: string) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(content)}`,
    description: 'Thread format with 280 char limits',
    maxChars: 280,
    font: 'font-normal',
    spacing: 'leading-normal'
  },
  facebook: {
    name: 'FACEBOOK POST',
    emoji: '📘',
    icon: Facebook,
    color: 'bg-blue-800',
    textColor: 'text-white',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    headerBg: 'bg-blue-800',
    shareUrl: (content: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://dailybyte.ai')}&quote=${encodeURIComponent(content)}`,
    description: 'Community-focused engaging content',
    maxChars: 63206,
    font: 'font-normal',
    spacing: 'leading-relaxed'
  },
  threads: {
    name: 'THREADS POST',
    emoji: '🧵',
    icon: MessageCircle,
    color: 'bg-gray-800',
    textColor: 'text-white',
    borderColor: 'border-gray-300',
    bgColor: 'bg-gray-50',
    headerBg: 'bg-gray-800',
    shareUrl: (content: string) => `https://threads.net/intent/post?text=${encodeURIComponent(content)}`,
    description: 'Conversational and authentic tone',
    maxChars: 500,
    font: 'font-normal',
    spacing: 'leading-relaxed'
  }
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

function PlatformCard({ platform, config, content, onContentChange, onCopy, onShare, onRegenerate, isCopied, isRegenerating }: {
  platform: string
  config: any
  content: GeneratedContent | undefined
  onContentChange: (platform: string, newContent: string) => void
  onCopy: (content: string, platform: string) => void
  onShare: (platform: string, content: string) => void
  onRegenerate: (platform: string) => void
  isCopied: boolean
  isRegenerating: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(content?.content_text || '')
  
  const currentContent = editedContent || content?.content_text || ''
  const charCount = currentContent.length
  const maxChars = content?.platform_specific_data?.platform_limits?.max_characters || config.maxChars
  const isOverLimit = charCount > maxChars
  
  useEffect(() => {
    setEditedContent(content?.content_text || '')
  }, [content?.content_text])
  
  const handleSave = () => {
    onContentChange(platform, editedContent)
    setIsEditing(false)
  }
  
  const handleCancel = () => {
    setEditedContent(content?.content_text || '')
    setIsEditing(false)
  }
  
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
      {/* Email-Style Header */}
      <div className={`${config.headerBg} px-6 py-4 rounded-t-xl`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{config.emoji}</span>
            <h2 className="text-xl font-bold text-white">{config.name}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onRegenerate(platform)}
              disabled={isRegenerating}
              className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 text-sm"
              title="Regenerate content"
            >
              <RefreshCw className={`h-4 w-4 inline mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating...' : 'Regenerate'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 p-4 border-2 border-gray-200 rounded-lg resize-none font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={`Write content for ${config.name}...`}
            />
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                Character count: {editedContent.length}/{maxChars}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Content Display */}
            {platform === 'x' && currentContent ? (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="mr-2">🧵</span>Thread Content:
                  </h3>
                  <div className="space-y-3">
                    {currentContent.split('||TWEET_SEPARATOR||').map((tweet, index) => {
                      const tweetText = tweet.trim();
                      const tweetCharCount = tweetText.length;
                      const isValidTweet = tweetCharCount <= 280;
                      return (
                        <div key={index} className={`p-3 bg-white rounded-lg border-l-4 ${
                          isValidTweet ? 'border-green-400' : 'border-red-400'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Tweet {index + 1}/{currentContent.split('||TWEET_SEPARATOR||').length}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              isValidTweet 
                                ? tweetCharCount > 240 
                                  ? 'text-orange-700 bg-orange-100' 
                                  : 'text-green-700 bg-green-100'
                                : 'text-red-700 bg-red-100'
                            }`}>
                              {tweetCharCount}/280 characters
                            </span>
                          </div>
                          <div className="text-sm text-gray-800 font-mono whitespace-pre-wrap">
                            {tweetText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="text-gray-800 font-mono text-sm whitespace-pre-wrap leading-relaxed" style={{ minHeight: '120px' }}>
                  {currentContent || (
                    <div className="flex items-center justify-center h-24">
                      <span className="text-gray-400 italic text-center">
                        {isRegenerating ? 'Generating content...' : 'Content will appear here...'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Character Count */}
            {currentContent && (
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">
                    Character count:
                  </span>
                  <span className={`text-sm font-bold ${
                    isOverLimit ? 'text-red-600' : charCount > maxChars * 0.8 ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {charCount}/{maxChars} characters
                  </span>
                </div>
              </div>
            )}
            
            {/* Hashtags */}
            {content?.hashtags && content.hashtags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Hashtags:</h4>
                <div className="flex flex-wrap gap-2">
                  {content.hashtags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={!currentContent}
            className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 font-medium"
          >
            <Edit3 className="h-4 w-4" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Content'}</span>
          </button>
          
          <button
            onClick={() => onCopy(currentContent, platform)}
            disabled={!currentContent}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 font-medium"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Content</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => onShare(platform, currentContent)}
            disabled={!currentContent}
            className={`flex-1 ${config.color} ${config.textColor} px-4 py-3 rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 font-medium`}
          >
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContentGenerationPage() {
  const { storyId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [story, setStory] = useState<NewsStory | null>(null)
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState<{[key: string]: string}>({})
  const [regeneratingPlatform, setRegeneratingPlatform] = useState<string | null>(null)

  // Check authentication with better error handling
  useEffect(() => {
    console.log('ContentGenerationPage auth check:', { authLoading, user: !!user })
    
    if (!authLoading && !user) {
      console.log('ContentGenerationPage: User not authenticated, redirecting to login')
      // Small delay to ensure auth state is fully resolved
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 100)
      return
    }
  }, [user, authLoading, navigate])

  // Fetch story details if storyId is provided, then auto-generate content
  useEffect(() => {
    // Only proceed if user is authenticated and not loading
    if (authLoading) {
      console.log('ContentGenerationPage: Still loading auth...')
      return
    }
    
    if (!user) {
      console.log('ContentGenerationPage: No user found in content initialization')
      return
    }
    
    console.log('ContentGenerationPage: Initializing content for user:', user.email)
    
    async function initializeContent() {
      setLoading(true)
      try {
        if (storyId) {
          console.log('Fetching story details for ID:', storyId)
          await fetchStoryDetails()
        }
        console.log('Starting content generation...')
        await generateContent()
      } catch (error) {
        console.error('Error initializing content:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initializeContent()
  }, [storyId, user, authLoading])

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-8 w-8 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading DailyByte...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null
  }

  const fetchStoryDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('news_stories')
        .select('*')
        .eq('id', storyId)
        .maybeSingle()
      
      if (error) throw error
      setStory(data)
    } catch (error) {
      console.error('Error fetching story:', error)
    }
  }

  const generateContent = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-content-generator', {
        body: {
          storyId: storyId ? parseInt(storyId) : null,
          platforms: ['instagram', 'linkedin', 'x', 'facebook', 'threads'],
          mode: 'production'
        }
      })
      
      if (error) throw error
      
      if (data.data?.generatedContent && data.data.generatedContent.length > 0) {
        setGeneratedContent(data.data.generatedContent)
        // Update story data if provided
        if (data.data.story && !story) {
          setStory(data.data.story)
        }
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const regeneratePlatformContent = async (platform: string) => {
    setRegeneratingPlatform(platform)
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-content-generator', {
        body: {
          storyId: storyId ? parseInt(storyId) : null,
          platforms: [platform],
          mode: 'production',
          regenerate: true
        }
      })
      
      if (error) throw error
      
      if (data.data?.generatedContent && data.data.generatedContent.length > 0) {
        const newContent = data.data.generatedContent[0]
        setGeneratedContent(prev => 
          prev.map(content => 
            content.platform === platform ? newContent : content
          )
        )
      }
    } catch (error) {
      console.error('Error regenerating content:', error)
    } finally {
      setRegeneratingPlatform(null)
    }
  }

  const copyToClipboard = async (content: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedPlatform(platform)
      setTimeout(() => setCopiedPlatform(null), 2000)
    } catch (error) {
      console.error('Failed to copy content:', error)
    }
  }

  const shareToSocialMedia = (platform: string, content: string) => {
    const config = platformConfig[platform as keyof typeof platformConfig]
    if (config && config.shareUrl) {
      const shareUrl = config.shareUrl(content)
      window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleContentEdit = (platform: string, newContent: string) => {
    setEditingContent(prev => ({ ...prev, [platform]: newContent }))
    // Update the generated content
    setGeneratedContent(prev => 
      prev.map(content => 
        content.platform === platform 
          ? { ...content, content_text: newContent }
          : content
      )
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <Bot className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">DailyByte</h1>
                  <p className="text-sm text-gray-600">Enhanced Content Generation</p>
                </div>
              </div>
            </div>
            
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Story Context */}
        {story && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Bot className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {story.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-3">
                  {story.content}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <ExternalLink className="h-4 w-4" />
                    <span>Source: {story.source}</span>
                  </span>
                  {story.url && (
                    <a 
                      href={story.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Original Article
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Generation */}
        <div className="space-y-8">
          
          {loading && generatedContent.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Generating content for all platforms...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-1">
              {['instagram', 'linkedin', 'x', 'facebook', 'threads'].map((platform) => {
                const content = generatedContent.find(c => c.platform === platform)
                const config = platformConfig[platform as keyof typeof platformConfig]
                
                return (
                  <PlatformCard
                    key={platform}
                    platform={platform}
                    config={config}
                    content={content}
                    onContentChange={handleContentEdit}
                    onCopy={copyToClipboard}
                    onShare={shareToSocialMedia}
                    onRegenerate={regeneratePlatformContent}
                    isCopied={copiedPlatform === platform}
                    isRegenerating={regeneratingPlatform === platform}
                  />
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
