import { useState } from 'react'
import { Copy, Download, Share2, Instagram, Linkedin, Twitter, Mail } from 'lucide-react'

interface GeneratedContent {
  id: number
  story_id: number
  platform: string
  content_text: string
  image_url?: string
  generation_date: string
}

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
}

interface ContentPreviewProps {
  content: GeneratedContent[]
  story?: NewsStory
}

export function ContentPreview({ content, story }: ContentPreviewProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-600' },
    { id: 'x', name: 'X (Twitter)', icon: Twitter, color: 'bg-gray-900' }
  ]

  const selectedContent = content.find(c => c.platform === selectedPlatform)
  const selectedPlatformInfo = platforms.find(p => p.id === selectedPlatform)

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const formatContent = (text: string, platform: string) => {
    if (platform === 'x') {
      // Format X thread content
      return text.split('--- NEXT TWEET ---').map((tweet, index) => {
        const cleanTweet = tweet.trim()
        if (!cleanTweet) return null
        
        return (
          <div key={index} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-400 mb-3">
            <div className="text-sm font-semibold text-gray-600 mb-2">Tweet {index + 1}</div>
            <div className="whitespace-pre-line">{cleanTweet}</div>
            <div className="text-xs text-gray-500 mt-2">{cleanTweet.length} characters</div>
          </div>
        )
      }).filter(Boolean)
    }
    
    return <div className="whitespace-pre-line">{text}</div>
  }

  const downloadContent = () => {
    if (!selectedContent) return
    
    const element = document.createElement('a')
    const file = new Blob([selectedContent.content_text], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${selectedPlatform}_content_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (content.length === 0) {
    return (
      <div className="text-center py-8">
        <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Available</h3>
        <p className="text-gray-600">Generate content to see social media posts here.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Platform Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex">
          {platforms.map(platform => {
            const Icon = platform.icon
            const hasContent = content.some(c => c.platform === platform.id)
            
            return (
              <button
                key={platform.id}
                onClick={() => setSelectedPlatform(platform.id)}
                disabled={!hasContent}
                className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  selectedPlatform === platform.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : hasContent
                    ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    : 'border-transparent text-gray-300 cursor-not-allowed'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{platform.name}</span>
                {hasContent && (
                  <span className="inline-flex items-center justify-center w-2 h-2 bg-green-400 rounded-full"></span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content Display */}
      <div className="p-6">
        {selectedContent ? (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                {selectedPlatformInfo && (
                  <div className={`p-2 rounded-lg text-white ${selectedPlatformInfo.color}`}>
                    <selectedPlatformInfo.icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedPlatformInfo?.name} Content
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generated {new Date(selectedContent.generation_date).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(selectedContent.content_text, selectedContent.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  <span>{copiedId === selectedContent.id ? 'Copied!' : 'Copy'}</span>
                </button>
                
                <button
                  onClick={downloadContent}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="prose max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                {formatContent(selectedContent.content_text, selectedPlatform)}
              </div>
            </div>

            {/* Content Stats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div>
                {selectedPlatform === 'x' ? (
                  <span>{selectedContent.content_text.split('--- NEXT TWEET ---').filter(t => t.trim()).length} tweets</span>
                ) : (
                  <span>{selectedContent.content_text.length} characters</span>
                )}
              </div>
              
              {story && (
                <div>
                  Source: {story.source}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Share to {selectedPlatformInfo?.name}
              </button>
              
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Mail className="h-4 w-4" />
                <span>Email Preview</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className={`inline-flex p-3 rounded-lg text-white mb-4 ${selectedPlatformInfo?.color}`}>
              {selectedPlatformInfo && <selectedPlatformInfo.icon className="h-6 w-6" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {selectedPlatformInfo?.name} Content
            </h3>
            <p className="text-gray-600">
              Generate content to see {selectedPlatformInfo?.name} posts here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}