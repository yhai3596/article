import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Filter, Check } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  color_code: string
  is_active: boolean
  sort_order: number
}

interface CategorySelectorProps {
  selectedCategories: number[]
  onCategoriesChange: (categories: number[]) => void
}

export function CategorySelector({ selectedCategories, onCategoriesChange }: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.functions.invoke('category-manager', {
        body: { userId: null }
      })
      
      if (error) throw error
      setCategories(data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Fallback to default categories with the requested categories
      setCategories([
        { id: 1, name: 'AI Regulation', slug: 'ai-regulation', description: 'Government and regulatory news', color_code: '#DC2626', is_active: true, sort_order: 1 },
        { id: 2, name: 'AI Startups', slug: 'ai-startups', description: 'Startup announcements and news', color_code: '#16A34A', is_active: true, sort_order: 2 },
        { id: 3, name: 'AI Tools', slug: 'ai-tools', description: 'New AI tools and platforms', color_code: '#3B82F6', is_active: true, sort_order: 3 },
        { id: 4, name: 'AI Ethics', slug: 'ai-ethics', description: 'AI ethics and safety discussions', color_code: '#7C3AED', is_active: true, sort_order: 4 },
        { id: 5, name: 'Funding', slug: 'funding', description: 'Investment and funding news', color_code: '#059669', is_active: true, sort_order: 5 },
        { id: 6, name: 'Policy', slug: 'policy', description: 'AI policy and governance', color_code: '#D97706', is_active: true, sort_order: 6 },
        { id: 7, name: 'Product Launches', slug: 'product-launches', description: 'New product releases', color_code: '#9333EA', is_active: true, sort_order: 7 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoriesChange(selectedCategories.filter(id => id !== categoryId))
    } else {
      onCategoriesChange([...selectedCategories, categoryId])
    }
  }

  const selectAll = () => {
    onCategoriesChange(categories.map(cat => cat.id))
  }

  const clearAll = () => {
    onCategoriesChange([])
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-blue-600 animate-pulse" />
          <h3 className="text-lg font-semibold text-gray-900">Loading categories...</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-8 bg-gray-200 rounded-full animate-pulse" style={{ width: `${80 + Math.random() * 60}px` }}></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter by Category</h3>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Select All
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-gray-600 hover:text-gray-700 font-medium"
          >
            Clear All
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map(category => {
          const isSelected = selectedCategories.includes(category.id)
          
          return (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-transparent text-white shadow-lg transform scale-105'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              }`}
              style={isSelected ? { backgroundColor: category.color_code } : {}}
              title={category.description}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{category.name}</span>
                {isSelected && (
                  <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                )}
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {category.description}
              </div>
            </button>
          )
        })}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">
              {selectedCategories.length} categor{selectedCategories.length === 1 ? 'y' : 'ies'} selected
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            News feed will show stories from: {categories.filter(cat => selectedCategories.includes(cat.id)).map(cat => cat.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}