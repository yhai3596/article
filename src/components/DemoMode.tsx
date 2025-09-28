import React, { useState, useEffect } from 'react'
import { Calendar, TrendingUp, Mail, Play, RefreshCw, Sparkles } from 'lucide-react'
import { ContentPreview } from './ContentPreview'
import { NewsStoryCard } from './NewsStoryCard'

// Demo data
const DEMO_STORIES = [
  {
    id: 1,
    source: 'TechCrunch',
    title: 'OpenAI Announces GPT-5 with Revolutionary Reasoning Capabilities',
    content: 'OpenAI has unveiled GPT-5, featuring unprecedented reasoning abilities that surpass human-level performance in complex logical tasks. The new model demonstrates remarkable improvements in mathematical problem-solving, code generation, and multi-step reasoning processes.',
    url: 'https://techcrunch.com/gpt5-announcement',
    publication_date: '2025-01-14T10:00:00Z',
    credibility_score: 95,
    selected_status: true,
    created_at: '2025-01-14T10:00:00Z'
  },
  {
    id: 2,
    source: 'The Verge',
    title: 'Meta Releases Open-Source AGI Research Framework',
    content: 'Meta has released a comprehensive open-source framework for AGI research, including pre-trained models, training infrastructure, and evaluation tools. This move aims to democratize artificial general intelligence development across the research community.',
    url: 'https://theverge.com/meta-agi-framework',
    publication_date: '2025-01-14T08:30:00Z',
    credibility_score: 88,
    selected_status: false,
    created_at: '2025-01-14T08:30:00Z'
  },
  {
    id: 3,
    source: 'Wired',
    title: 'Google DeepMind Achieves Breakthrough in Protein Folding Prediction',
    content: 'Google DeepMind\'s latest AlphaFold iteration can now predict protein structures with 99.9% accuracy, potentially revolutionizing drug discovery and biological research. The system can process complex protein interactions in real-time.',
    url: 'https://wired.com/deepmind-protein-breakthrough',
    publication_date: '2025-01-14T06:15:00Z',
    credibility_score: 92,
    selected_status: false,
    created_at: '2025-01-14T06:15:00Z'
  }
]

const DEMO_CONTENT = [
  {
    id: 1,
    story_id: 1,
    platform: 'instagram',
    content_text: `🚨 BREAKING: OpenAI just dropped GPT-5 and it\'s absolutely mind-blowing! 🤯

✨ What\'s new:
• Human-level reasoning abilities
• Advanced mathematical problem-solving 
• Next-gen code generation
• Multi-step logical processing

This isn\'t just an upgrade - it\'s a paradigm shift in AI capabilities! 🚀

The implications for education, research, and technology development are HUGE. We\'re literally watching the future unfold in real-time.

What\'s your first question for GPT-5? Drop it below! 👇

#OpenAI #GPT5 #ArtificialIntelligence #TechBreakthrough #Innovation #AI #MachineLearning #FutureIsNow`,
    generation_date: '2025-01-14T11:00:00Z'
  },
  {
    id: 2,
    story_id: 1,
    platform: 'linkedin',
    content_text: `OpenAI\'s GPT-5 release marks a pivotal moment in artificial intelligence development.

🔑 Key capabilities:
• Unprecedented reasoning performance
• Advanced mathematical problem-solving
• Enhanced code generation accuracy
• Multi-dimensional logical processing

This breakthrough has immediate implications for:
✓ Enterprise automation
✓ Research and development
✓ Educational technology
✓ Software engineering productivity

Organizations leveraging AI-first strategies will gain significant competitive advantages in the coming months.

How is your team preparing for the next wave of AI transformation?

#ArtificialIntelligence #GPT5 #TechLeadership #Innovation #DigitalTransformation #EnterpriseAI`,
    generation_date: '2025-01-14T11:00:00Z'
  },
  {
    id: 3,
    story_id: 1,
    platform: 'x',
    content_text: `🚨 THREAD: OpenAI just launched GPT-5 and the AI landscape just shifted dramatically. Here\'s what you need to know: 🧵

--- NEXT TWEET ---

1/ GPT-5 isn\'t just an incremental update. It\'s showing human-level reasoning capabilities across complex tasks that previous models struggled with.

--- NEXT TWEET ---

2/ The mathematical problem-solving abilities are particularly impressive. We\'re talking about solving multi-step calculus and advanced physics problems with near-perfect accuracy.

--- NEXT TWEET ---

3/ For developers: The code generation quality is a massive leap forward. It can understand complex architectural patterns and generate production-ready code.

--- NEXT TWEET ---

4/ But here\'s what\'s really exciting: The reasoning chains are transparent. You can see HOW it arrives at conclusions, making it incredibly valuable for research and education.

--- NEXT TWEET ---

5/ Industry impact will be immediate:
• Software development acceleration
• Scientific research breakthroughs
• Educational personalization
• Business process automation

--- NEXT TWEET ---

6/ This is the kind of advancement that defines technological eras. We\'re not just seeing better AI - we\'re witnessing the emergence of artificial reasoning.

The future just accelerated. #GPT5 #OpenAI #AI`,
    generation_date: '2025-01-14T11:00:00Z'
  }
]

interface DemoModeProps {
  onGenerateContent: (storyId?: number) => void
  onSendEmail: () => void
  isGenerating: boolean
}

export function DemoMode({ onGenerateContent, onSendEmail, isGenerating }: DemoModeProps) {
  const [stories, setStories] = useState(DEMO_STORIES)
  const [content, setContent] = useState(DEMO_CONTENT)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate news update
  const simulateNewsUpdate = async () => {
    setIsUpdating(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update timestamps to make stories appear \'fresh\'
    const updatedStories = stories.map(story => ({
      ...story,
      created_at: new Date().toISOString(),
      publication_date: new Date().toISOString()
    }))
    
    setStories(updatedStories)
    setLastUpdate(new Date().toLocaleString())
    setIsUpdating(false)
  }

  // Simulate content generation
  const simulateContentGeneration = async (storyId?: number) => {
    // In demo mode, we just refresh the existing content timestamps
    const updatedContent = content.map(c => ({
      ...c,
      generation_date: new Date().toISOString()
    }))
    
    setContent(updatedContent)
  }

  const selectedStory = stories.find(story => story.selected_status)
  const todayContent = content.filter(c => {
    const today = new Date().toDateString()
    const contentDate = new Date(c.generation_date).toDateString()
    return today === contentDate
  })

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">Demo Mode Active</h3>
            <p className="text-sm text-blue-700">
              Experiencing NewSmith with sample data and pre-generated content. 
              All features work offline with realistic examples.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Demo Actions</h2>
          {lastUpdate && (
            <span className="text-sm text-gray-500">Last update: {lastUpdate}</span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={simulateNewsUpdate}
            disabled={isUpdating}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span>{isUpdating ? 'Updating...' : 'Update News'}</span>
          </button>
          
          <button
            onClick={() => {
              simulateContentGeneration()
              onGenerateContent()
            }}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            <Play className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span>{isGenerating ? 'Generating...' : 'Generate Content'}</span>
          </button>
          
          <button
            onClick={onSendEmail}
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span>Preview Email</span>
          </button>
        </div>
      </div>

      {/* Featured Story */}
      {selectedStory && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Today\'s Featured Story</h2>
          <NewsStoryCard 
            story={selectedStory} 
            onGenerateContent={() => {
              simulateContentGeneration(selectedStory.id)
              onGenerateContent(selectedStory.id)
            }}
          />
        </div>
      )}

      {/* Generated Content */}
      {todayContent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Generated Content</h2>
            <div className="text-sm text-gray-600">
              {todayContent.length} pieces generated
            </div>
          </div>
          <ContentPreview content={todayContent} story={selectedStory} />
        </div>
      )}

      {/* All Demo Stories */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Demo News Stories</h2>
        <div className="grid gap-6">
          {stories.map(story => (
            <NewsStoryCard 
              key={story.id} 
              story={story}
              onGenerateContent={() => {
                simulateContentGeneration(story.id)
                onGenerateContent(story.id)
              }}
            />
          ))}
        </div>
      </div>

      {/* Demo Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About Demo Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">What\'s Included:</h4>
            <ul className="space-y-1">
              <li>• Real-world AI news examples</li>
              <li>• Professional social media content</li>
              <li>• Email newsletter templates</li>
              <li>• Interactive content generation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Demo vs Production:</h4>
            <ul className="space-y-1">
              <li>• Demo uses pre-generated examples</li>
              <li>• Production connects to live APIs</li>
              <li>• All features work in both modes</li>
              <li>• Seamless upgrade path available</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}