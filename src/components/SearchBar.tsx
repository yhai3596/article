import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, TrendingUp, Clock, Hash, Database, ArrowRight } from 'lucide-react'

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

interface GeneratedContent {
  id: number
  story_id: number
  platform: string
  content_text: string
  image_url?: string
  generation_date: string
}

interface SearchBarProps {
  stories: NewsStory[]
  generatedContent: GeneratedContent[]
  onSearchResults: (results: NewsStory[]) => void
  onSearchTermChange: (term: string) => void
  className?: string
}

const TRENDING_TOPICS = [
  'AI regulation', 'ChatGPT', 'machine learning', 'OpenAI', 'autonomous vehicles',
  'AI safety', 'neural networks', 'GPT-4', 'artificial intelligence', 'deep learning'
]

const COMMON_AI_TAGS = [
  '#artificialintelligence', '#machinelearning', '#deeplearning', '#nlp',
  '#computervision', '#robotics', '#automation', '#aisafety', '#ethicalai', '#airegulation'
]

export function SearchBar({ stories, generatedContent, onSearchResults, onSearchTermChange, className = '' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchInAll, setSearchInAll] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [resultCount, setResultCount] = useState(0)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dailybyte_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse recent searches:', e)
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((term: string) => {
    if (term.trim().length < 2) return
    
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem('dailybyte_recent_searches', JSON.stringify(updatedSearches))
  }, [recentSearches])

  // Ultra-fast debounced search (100ms)
  const debouncedSearch = useCallback((term: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Instant search for empty terms
    if (!term.trim()) {
      performSearch('')
      return
    }

    searchTimeoutRef.current = setTimeout(() => {
      performSearch(term)
    }, 100) // Ultra-fast 100ms debounce
  }, [stories, generatedContent, searchInAll])

  // Optimized search with instant results
  const performSearch = useCallback((term: string) => {
    const startTime = performance.now()
    setIsSearching(true)
    
    if (!term.trim()) {
      onSearchResults(stories)
      setResultCount(stories.length)
      setIsSearching(false)
      return
    }

    const searchTermLower = term.toLowerCase()
    let searchPool = stories

    if (searchInAll) {
      searchPool = stories // Extended search when toggle is on
    }

    // Optimized filtering with early returns
    const filteredStories = searchPool.filter(story => {
      // Fast title check first (most relevant)
      if (story.title.toLowerCase().includes(searchTermLower)) return true
      
      // Source check (also high relevance)
      if (story.source.toLowerCase().includes(searchTermLower)) return true
      
      // Content check (can be expensive, so do it after title/source)
      if (story.content.toLowerCase().includes(searchTermLower)) return true
      
      // Tags check
      if (story.tags && story.tags.some(tag => 
        tag.toLowerCase().includes(searchTermLower)
      )) return true
      
      // Quick fuzzy matching for critical terms only
      if (searchTermLower.length >= 3) {
        const titleWords = story.title.toLowerCase().split(' ')
        if (titleWords.some(word => word.length >= 3 && fuzzyMatch(word, searchTermLower, 1))) return true
      }
      
      return false
    })

    // Lightning-fast sorting by relevance
    const sortedResults = filteredStories.sort((a, b) => {
      const aScore = getRelevanceScore(a, searchTermLower)
      const bScore = getRelevanceScore(b, searchTermLower)
      return bScore - aScore
    })

    const endTime = performance.now()
    console.log(`Search completed in ${endTime - startTime}ms`)

    onSearchResults(sortedResults)
    setResultCount(sortedResults.length)
    setIsSearching(false)
  }, [stories, generatedContent, searchInAll, onSearchResults])

  // Ultra-fast relevance scoring
  const getRelevanceScore = (story: NewsStory, searchTerm: string) => {
    let score = 0
    const titleLower = story.title.toLowerCase()
    
    // Title matches are highest priority
    if (titleLower.startsWith(searchTerm)) score += 20
    else if (titleLower.includes(searchTerm)) score += 15
    
    // Source matches
    if (story.source.toLowerCase().includes(searchTerm)) score += 10
    
    // Recent articles get boost
    const daysSincePublication = (Date.now() - new Date(story.publication_date).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSincePublication < 1) score += 5
    
    // High credibility boost
    if (story.credibility_score > 90) score += 3
    
    return score
  }

  // Fast fuzzy matching
  const fuzzyMatch = (str1: string, str2: string, maxDistance: number): boolean => {
    if (Math.abs(str1.length - str2.length) > maxDistance) return false
    
    let distance = 0
    const minLength = Math.min(str1.length, str2.length)
    
    for (let i = 0; i < minLength; i++) {
      if (str1[i] !== str2[i]) distance++
      if (distance > maxDistance) return false
    }
    
    return distance + Math.abs(str1.length - str2.length) <= maxDistance
  }

  // Instant suggestions generation
  const generateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([...recentSearches.slice(0, 3), ...TRENDING_TOPICS.slice(0, 4)])
      return
    }

    const inputLower = input.toLowerCase()
    const filtered = []

    // Recent searches first
    filtered.push(...recentSearches.filter(search => 
      search.toLowerCase().includes(inputLower)
    ).slice(0, 2))

    // Trending topics
    filtered.push(...TRENDING_TOPICS.filter(topic => 
      topic.toLowerCase().includes(inputLower)
    ).slice(0, 3))

    // AI tags
    filtered.push(...COMMON_AI_TAGS.filter(tag => 
      tag.toLowerCase().includes(inputLower)
    ).slice(0, 2))

    setSuggestions(filtered.slice(0, 6))
  }, [recentSearches])

  // Handle input change with instant response
  const handleInputChange = (value: string) => {
    setSearchTerm(value)
    onSearchTermChange(value)
    setSelectedSuggestionIndex(-1)
    generateSuggestions(value)
    debouncedSearch(value)
  }

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion)
    onSearchTermChange(suggestion)
    saveRecentSearch(suggestion)
    setShowSuggestions(false)
    performSearch(suggestion)
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    onSearchTermChange('')
    onSearchResults(stories)
    setResultCount(stories.length)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    searchInputRef.current?.focus()
  }

  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex])
        } else if (searchTerm.trim()) {
          saveRecentSearch(searchTerm)
          setShowSuggestions(false)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
        break
    }
  }

  // Global keyboard shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setShowSuggestions(true)
        generateSuggestions(searchTerm)
      }
      
      // Handle keyboard navigation when search is focused
      if (searchInputRef.current === document.activeElement) {
        handleKeyDown(e)
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [searchTerm, showSuggestions, suggestions, selectedSuggestionIndex])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
        setSelectedSuggestionIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-lg flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-white" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-brand-accent">Smart Search</h3>
        </div>
        
        {/* Ultra-Compact Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-gray-600">All News</span>
          <button
            onClick={() => {
              setSearchInAll(!searchInAll)
              if (searchTerm.trim()) {
                performSearch(searchTerm)
              }
            }}
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${
              searchInAll ? 'bg-brand-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                searchInAll ? 'translate-x-4' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Compact Search Input */}
      <div className="relative p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              setShowSuggestions(true)
              generateSuggestions(searchTerm)
            }}
            placeholder="Search headlines, keywords... (⌘K)"
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-150 font-body bg-white"
          />
          
          {/* Instant Loading Indicator */}
          {isSearching && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-3.5 w-3.5 border-2 border-brand-primary border-t-transparent rounded-full"></div>
            </div>
          )}
          
          {/* Clear Button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Ultra-Fast Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          >
            {recentSearches.length > 0 && searchTerm.length === 0 && (
              <div className="p-2 border-b border-gray-50">
                <div className="flex items-center space-x-1.5 mb-1.5">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-500">Recent</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.slice(0, 3).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="px-2 py-1 bg-gray-50 text-gray-700 rounded text-xs hover:bg-gray-100 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="py-1">
              {suggestions.map((suggestion, index) => {
                const isSelected = index === selectedSuggestionIndex
                const isRecent = recentSearches.includes(suggestion)
                const isTrending = TRENDING_TOPICS.includes(suggestion)
                const isTag = suggestion.startsWith('#')
                
                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full text-left px-3 py-1.5 text-sm transition-colors flex items-center space-x-2 ${
                      isSelected ? 'bg-brand-primary/10 text-brand-primary' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isRecent && <Clock className="h-3 w-3 text-gray-400" />}
                    {isTrending && <TrendingUp className="h-3 w-3 text-orange-400" />}
                    {isTag && <Hash className="h-3 w-3 text-blue-400" />}
                    {!isRecent && !isTrending && !isTag && <Search className="h-3 w-3 text-gray-400" />}
                    <span className={isSelected ? 'font-medium' : ''}>{suggestion}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Compact Search Results Info */}
      {searchTerm && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-700">
                {resultCount === 0 ? 'No results' : `${resultCount} result${resultCount !== 1 ? 's' : ''}`}
              </span>
              {searchInAll && (
                <span className="px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded text-xs font-medium">
                  All Content
                </span>
              )}
            </div>
            
            <div className="text-gray-500">
              ⌘K • ↵ search • ⎋ clear
            </div>
          </div>
        </div>
      )}
    </div>
  )
}