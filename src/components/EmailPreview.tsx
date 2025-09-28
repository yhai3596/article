import React from 'react'
import { X, Mail, Download, Share2, ExternalLink } from 'lucide-react'

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

interface EmailPreviewProps {
  story?: NewsStory
  content: GeneratedContent[]
  onClose: () => void
}

export function EmailPreview({ story, content, onClose }: EmailPreviewProps) {
  if (!story) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Story Available</h3>
            <p className="text-gray-600 mb-4">Select a news story to preview the email.</p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const instagramContent = content.find(c => c.platform === 'instagram')?.content_text || 'No Instagram content generated'
  const linkedinContent = content.find(c => c.platform === 'linkedin')?.content_text || 'No LinkedIn content generated'
  const xContent = content.find(c => c.platform === 'x')?.content_text || 'No X content generated'

  const formatTwitterThread = (threadContent: string) => {
    const tweets = threadContent.split('--- NEXT TWEET ---')
    return tweets.map((tweet, index) => {
      const cleanTweet = tweet.trim()
      if (!cleanTweet) return null
      
      return (
        <div key={index} className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="font-semibold text-sm text-gray-600 mb-2">Tweet {index + 1}:</div>
          <div className="whitespace-pre-line text-sm">{cleanTweet}</div>
        </div>
      )
    }).filter(Boolean)
  }

  const downloadHTML = () => {
    const element = document.createElement('a')
    const htmlContent = generateEmailHTML()
    const file = new Blob([htmlContent], { type: 'text/html' })
    element.href = URL.createObjectURL(file)
    element.download = `newsmith_email_${new Date().toISOString().split('T')[0]}.html`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const generateEmailHTML = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daily AI News - NewSmith</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #007acc;
        }
        .header h1 {
            color: #007acc;
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header p {
            margin: 0;
            font-size: 16px;
            color: #666;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            background-color: #f8f9fa;
            border-left: 4px solid #007acc;
            border-radius: 0 8px 8px 0;
        }
        .section h2 {
            color: #007acc;
            margin-top: 0;
            font-size: 20px;
        }
        .source-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 NewSmith Daily AI News</h1>
            <p><strong>${currentDate}</strong></p>
        </div>

        <div class="source-info">
            <p><strong>📰 Source:</strong> ${story.source}</p>
            <p><strong>📅 Published:</strong> ${new Date(story.publication_date).toLocaleDateString()}</p>
            <p><strong>🔗 URL:</strong> <a href="${story.url}" style="color: #007acc;">${story.url}</a></p>
        </div>

        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; border-radius: 8px; color: white; text-align: center; margin: 20px 0;">
            <h2 style="margin: 0; font-size: 24px;">📰 ${story.title}</h2>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Generated by NewSmith AI News</p>
        </div>

        <div class="section" style="background-color: #fce4ec;">
            <h2>📱 INSTAGRAM REEL SCRIPT</h2>
            <div style="white-space: pre-line;">${instagramContent}</div>
        </div>

        <div class="section" style="background-color: #e3f2fd;">
            <h2>💼 LINKEDIN POST</h2>
            <div style="white-space: pre-line;">${linkedinContent}</div>
        </div>

        <div class="section" style="background-color: #f1f3f4;">
            <h2>🐦 X (TWITTER) THREAD</h2>
            ${xContent.split('--- NEXT TWEET ---').map((tweet, index) => {
              const cleanTweet = tweet.trim()
              return cleanTweet ? `
                <div style="margin: 15px 0; padding: 10px; background-color: white; border-radius: 5px; border-left: 3px solid #1da1f2;">
                    <strong>Tweet ${index + 1}:</strong><br>
                    <div style="white-space: pre-line; margin-top: 8px;">${cleanTweet}</div>
                </div>
              ` : ''
            }).join('')}
        </div>

        <div class="footer">
            <p><strong>NewSmith</strong> - Daily AI News Content Generator</p>
            <p>Powered by AI • Generated on ${currentDate}</p>
        </div>
    </div>
</body>
</html>`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email Newsletter Preview</h2>
              <p className="text-sm text-gray-600">Daily AI News - {currentDate}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadHTML}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download HTML</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
            {/* Email Header */}
            <div className="text-center mb-8 pb-6 border-b-4 border-blue-600">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">🤖 NewSmith Daily AI News</h1>
              <p className="text-lg text-gray-600 font-semibold">{currentDate}</p>
            </div>

            {/* Source Info */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div><strong>📰 Source:</strong> {story.source}</div>
                <div><strong>📅 Published:</strong> {new Date(story.publication_date).toLocaleDateString()}</div>
                <div><strong>🔗 URL:</strong> <a href={story.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">View Original</a></div>
              </div>
            </div>

            {/* Featured Story */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-8 rounded-lg text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">📰 {story.title}</h2>
              <p className="opacity-90">Generated by NewSmith AI News</p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Instagram Content */}
              <div className="bg-pink-50 border-l-4 border-pink-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-pink-700 mb-4">📱 INSTAGRAM REEL SCRIPT</h3>
                <div className="whitespace-pre-line text-gray-700">{instagramContent}</div>
              </div>

              {/* LinkedIn Content */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-blue-700 mb-4">💼 LINKEDIN POST</h3>
                <div className="whitespace-pre-line text-gray-700">{linkedinContent}</div>
              </div>

              {/* X Content */}
              <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">🐦 X (TWITTER) THREAD</h3>
                <div>{formatTwitterThread(xContent)}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-6 border-t border-gray-200 text-gray-600">
              <p className="font-semibold mb-2">NewSmith - Daily AI News Content Generator</p>
              <p className="text-sm">Powered by AI • Generated on {currentDate}</p>
              <p className="text-xs mt-4">
                You're receiving this because you subscribed to NewSmith daily AI news updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}