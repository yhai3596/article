import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Copy, Check, Download, Bot } from 'lucide-react'

interface GeneratedContent {
  id: any
  story_id: string | number
  platform: string
  content_text: string
  image_url?: string
  generation_date: string
  hashtags?: string[]
  platform_specific_data?: any
  ai_service_used?: string
  character_count?: number
}

interface NewsStory {
  id: string
  title: string
  content: string
  source: string
  url: string
  summary: string
  published_at: string
}

const platformConfig = {
  instagram: {
    name: 'Instagram Post',
    icon: '📱',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600',
    description: 'Visual storytelling content'
  },
  linkedin: {
    name: 'LinkedIn Post',
    icon: '💼',
    color: 'bg-blue-700',
    description: 'Professional content with industry insights'
  },
  x: {
    name: 'X (Twitter) Thread',
    icon: '🐦',
    color: 'bg-gray-900',
    description: 'Thread format with character limits'
  },
  facebook: {
    name: 'Facebook Post',
    icon: '📘',
    color: 'bg-blue-800',
    description: 'Community-focused engaging content'
  },
  threads: {
    name: 'Threads Post',
    icon: '🧵',
    color: 'bg-gray-800',
    description: 'Conversational and authentic tone'
  }
}

export function ContentViewPage() {
  const { storyId } = useParams()
  const [searchParams] = useSearchParams()
  const platform = searchParams.get('platform')
  const newsTitle = searchParams.get('title')
  const newsSource = searchParams.get('source')
  
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [story, setStory] = useState<NewsStory | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    generateContent()
  }, [storyId, platform])

  const generateContent = async () => {
    if (!storyId || !platform) return
    
    setLoading(true)
    setGenerating(true)
    
    try {
      // First try to find existing content in the correct table
      const { data: existingContent } = await supabase
        .from('generations')
        .select('*')
        .eq('news_id', storyId)
        .eq('platform', platform)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (existingContent) {
        // Convert to expected format
        const formattedContent = {
          id: existingContent.id,
          story_id: storyId,
          platform: existingContent.platform,
          content_text: existingContent.content,
          generation_date: existingContent.created_at,
          ai_service_used: existingContent.ai_service_used
        }
        setContent(formattedContent)
        setGenerating(false)
        setLoading(false)
        return
      }
      
      // Generate new content
      // For fresh articles, we need to construct article_data from URL params
      const requestBody: any = {
        platform: platform
      }
      
      // If we have news title and source from params, it's a fresh article
      if (newsTitle && newsSource) {
        requestBody.article_data = {
          id: storyId,
          title: newsTitle,
          source: newsSource,
          summary: searchParams.get('summary') || `Latest news from ${newsSource}`,
          url: searchParams.get('url') || '#'
        }
        requestBody.news_id = storyId
      } else {
        // Fallback to news_id for database lookup
        requestBody.news_id = storyId
      }
      
      const { data, error } = await supabase.functions.invoke('generate', {
        body: requestBody
      })
      
      if (error) throw error
      
      // Create content object for display using the actual response structure
      const generatedContent = {
        id: data.data?.generation_id || Date.now(),
        story_id: storyId,
        platform: platform,
        content_text: data.data?.content || 'Content generated successfully',
        generation_date: data.data?.created_at || new Date().toISOString(),
        hashtags: data.data?.hashtags || [],
        ai_service_used: data.data?.ai_service_used,
        character_count: data.data?.character_count
      }
      
      setContent(generatedContent)
      
    } catch (error) {
      console.error('Error generating content:', error)
      // Set error content
      setContent({
        id: Date.now(),
        story_id: storyId || '0',
        platform: platform || 'unknown',
        content_text: 'Failed to generate content. Please try again.',
        generation_date: new Date().toISOString()
      })
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!content?.content_text) return
    
    try {
      await navigator.clipboard.writeText(content.content_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = content.content_text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadContent = () => {
    if (!content?.content_text) return
    
    const blob = new Blob([content.content_text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${platform}_content_${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const config = platform ? platformConfig[platform as keyof typeof platformConfig] : null

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {generating ? 'Generating Content...' : 'Loading...'}
          </h3>
          <p className="text-gray-600">
            {generating ? 'Creating optimized content for your platform' : 'Please wait'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {config && (
                <div className={`w-10 h-10 ${config.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                  {config.name.charAt(0)}
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {config?.name || 'Generated Content'}
                </h1>
                <p className="text-sm text-gray-600">
                  {config?.description || 'Social media content'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={copyToClipboard}
                disabled={!content?.content_text}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
              
              <button
                onClick={downloadContent}
                disabled={!content?.content_text}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Article Info */}
        {(newsTitle || newsSource) && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Source Article</h3>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              {newsTitle || 'News Article'}
            </h2>
            {newsSource && (
              <p className="text-sm text-gray-600">From: {newsSource}</p>
            )}
          </div>
        )}

        {/* Generated Content */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Content</h3>
              <span className="text-sm text-gray-500">
                {content?.content_text ? `${content.content_text.length} characters` : ''}
              </span>
            </div>
            
            {content?.content_text ? (
              <div className="space-y-4">
                {/* Special handling for X/Twitter threads */}
                {platform === 'x' ? (
                  <div className="space-y-3">
                    {content.content_text.split('||TWEET_SEPARATOR||').map((tweet, index) => {
                      const tweetText = tweet.trim()
                      if (!tweetText) return null
                      const isValidTweet = tweetText.length <= 280
                      return (
                        <div key={index} className={`p-4 bg-gray-50 rounded-lg border-l-4 ${
                          isValidTweet ? 'border-green-400' : 'border-red-400'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">
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
                          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {tweetText}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 border">
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed text-base">
                      {content.content_text}
                    </div>
                  </div>
                )}
                
                {/* Hashtags */}
                {content.hashtags && content.hashtags.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {content.hashtags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No content available</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Generated on {content?.generation_date ? new Date(content.generation_date).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}