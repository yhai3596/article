import { useState } from 'react'
import { Calendar, ExternalLink, Star, Zap, Globe, CheckCircle, Flame, Clock, ArrowRight } from 'lucide-react'

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
}

interface NewsStoryCardProps {
  story: NewsStory
  onGenerateContent: () => void
  categories?: any[]
  searchTerm?: string
}

// Publisher logos mapping
const publisherLogos: Record<string, string> = {
  'Reuters': 'https://logos-world.net/wp-content/uploads/2020/06/Reuters-Logo.png',
  'TechCrunch': 'https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-gradient.png',
  'The Verge': 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/7395359/android-chrome-192x192.0.png',
  'Wired': 'https://www.wired.com/verso/static/wired/assets/favicon.ico',
  'MIT Technology Review': 'https://wp.technologyreview.com/wp-content/uploads/2020/12/favicon.png',
  'VentureBeat': 'https://venturebeat.com/wp-content/themes/vb-news/img/favicon.ico',
  'OpenAI Blog': 'https://openai.com/favicon.ico',
  'Google DeepMind': 'https://www.google.com/favicon.ico',
  'Meta AI': 'https://www.meta.com/favicon.ico',
  'Microsoft': 'https://www.microsoft.com/favicon.ico',
  'Anthropic': 'https://www.anthropic.com/favicon.ico'
}

// Function to highlight search terms
const highlightSearchTerm = (text: string, searchTerm: string) => {
  if (!searchTerm || !text) return text
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded font-medium">
        {part}
      </mark>
    ) : part
  )
}

export function NewsStoryCard({ story, onGenerateContent, categories = [], searchTerm }: NewsStoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className={`card-neumorphic p-5 hover:shadow-gradient transition-all duration-300 group ${
      story.selected_status ? 'ring-2 ring-brand-primary ring-opacity-50' : ''
    }`}>
      <div className="flex items-start gap-5">
        {/* Publisher Logo */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-soft">
            {publisherLogos[story.source] ? (
              <img 
                src={publisherLogos[story.source]} 
                alt={story.source} 
                className="w-8 h-8 object-contain rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  e.currentTarget.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Globe className={`w-7 h-7 text-brand-primary ${publisherLogos[story.source] ? 'hidden' : ''}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-sm font-heading font-medium text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-pill">
              {story.source}
            </span>
            {story.category_id && (
              <span 
                className="px-3 py-1 rounded-pill text-xs font-medium text-white shadow-soft"
                style={{ backgroundColor: categories.find(cat => cat.id === story.category_id)?.color_code || '#3B82F6' }}
              >
                {categories.find(cat => cat.id === story.category_id)?.name}
              </span>
            )}
            {story.selected_status && (
              <span className="inline-flex items-center px-2 py-1 rounded-pill text-xs font-medium bg-brand-primary/10 text-brand-primary">
                <Zap className="h-3 w-3 mr-1" />
                Selected
              </span>
            )}
            <span className="text-sm text-gray-500 font-body">
              {formatDate(story.publication_date)}
            </span>
          </div>
          
          <h3 className="font-heading text-xl font-bold text-brand-accent mb-3 group-hover:text-brand-primary transition-colors leading-tight">
            {searchTerm ? highlightSearchTerm(story.title, searchTerm) : story.title}
          </h3>
          
          {/* Content Preview */}
          <div className="mb-4">
            <p className="text-gray-600 font-body leading-relaxed">
              {isExpanded ? (
                searchTerm ? highlightSearchTerm(story.content, searchTerm) : story.content
              ) : (
                searchTerm ? 
                  highlightSearchTerm(`${story.content.substring(0, 200)}${story.content.length > 200 ? '...' : ''}`, searchTerm) :
                  `${story.content.substring(0, 200)}${story.content.length > 200 ? '...' : ''}`
              )}
            </p>
            
            {story.content.length > 200 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-brand-primary hover:text-brand-secondary text-sm font-medium mt-2 transition-colors"
              >
                {isExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
          
          {/* Metrics with Icons - More Compact */}
          <div className="flex items-center space-x-5 mb-4">
            <div className="flex items-center space-x-1 text-sm font-medium">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">Credibility:</span>
              <span className={getScoreColor(story.credibility_score)}>{story.credibility_score}%</span>
            </div>
            {story.engagement_score && (
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="text-gray-600">Engagement:</span>
                <span className="text-orange-600">{story.engagement_score}/100</span>
              </div>
            )}
            {story.reading_time && (
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-gray-600">Reading:</span>
                <span className="text-blue-600">{story.reading_time} min</span>
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
          
          {/* Action Buttons with Clear Hierarchy */}
          <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
            <button
              onClick={onGenerateContent}
              className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <ArrowRight className="h-4 w-4" />
              <span>Generate Content</span>
            </button>
            
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
  )
}