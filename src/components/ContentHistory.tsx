import { useState } from 'react'
import { Calendar, Search, Filter, Instagram, Linkedin, Twitter } from 'lucide-react'

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

interface ContentHistoryProps {
  content: GeneratedContent[]
  stories: NewsStory[]
}

export function ContentHistory({ content, stories }: ContentHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all')

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Filter },
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin },
    { id: 'x', name: 'X (Twitter)', icon: Twitter }
  ]

  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: 'today', name: 'Today' },
    { id: 'week', name: 'This Week' },
    { id: 'month', name: 'This Month' }
  ]

  // Filter content based on search and filters
  const filteredContent = content.filter(item => {
    // Platform filter
    if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) {
      return false
    }

    // Date range filter
    const itemDate = new Date(item.generation_date)
    const now = new Date()
    
    if (selectedDateRange !== 'all') {
      let startDate = new Date()
      
      switch (selectedDateRange) {
        case 'today':
          startDate.setHours(0, 0, 0, 0)
          break
        case 'week':
          startDate.setDate(now.getDate() - 7)
          break
        case 'month':
          startDate.setMonth(now.getMonth() - 1)
          break
      }
      
      if (itemDate < startDate) {
        return false
      }
    }

    // Search filter
    if (searchTerm) {
      const story = stories.find(s => s.id === item.story_id)
      const searchLower = searchTerm.toLowerCase()
      
      return (
        item.content_text.toLowerCase().includes(searchLower) ||
        story?.title.toLowerCase().includes(searchLower) ||
        story?.source.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  // Group content by date
  const groupedContent = filteredContent.reduce((groups, item) => {
    const date = new Date(item.generation_date).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(item)
    return groups
  }, {} as Record<string, GeneratedContent[]>)

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return Instagram
      case 'linkedin': return Linkedin
      case 'x': return Twitter
      default: return Filter
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'text-purple-600 bg-purple-100'
      case 'linkedin': return 'text-blue-600 bg-blue-100'
      case 'x': return 'text-gray-900 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Content History</h2>
        <div className="text-sm text-gray-600">
          {filteredContent.length} of {content.length} items
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {platforms.map(platform => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>

          {/* Date Range Filter */}
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {dateRanges.map(range => (
              <option key={range.id} value={range.id}>
                {range.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content List */}
      {Object.keys(groupedContent).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedContent)
            .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
            .map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <span className="text-sm text-gray-500">({items.length} items)</span>
                </div>

                <div className="grid gap-4">
                  {items.map(item => {
                    const story = stories.find(s => s.id === item.story_id)
                    const PlatformIcon = getPlatformIcon(item.platform)
                    
                    return (
                      <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getPlatformColor(item.platform)}`}>
                              <PlatformIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {item.platform === 'x' ? 'X (Twitter)' : item.platform} Content
                              </h4>
                              {story && (
                                <p className="text-sm text-gray-600 truncate max-w-md">
                                  {story.title}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            {new Date(item.generation_date).toLocaleTimeString()}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {item.content_text.length > 200 
                              ? `${item.content_text.substring(0, 200)}...`
                              : item.content_text
                            }
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            {item.platform === 'x' 
                              ? `${item.content_text.split('--- NEXT TWEET ---').filter(t => t.trim()).length} tweets`
                              : `${item.content_text.length} characters`
                            }
                          </div>
                          
                          {story && (
                            <span className="text-xs text-gray-500">
                              Source: {story.source}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))
          }
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Content Found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedPlatform !== 'all' || selectedDateRange !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'No content has been generated yet.'}
          </p>
        </div>
      )}
    </div>
  )
}