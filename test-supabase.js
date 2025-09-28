// Test Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ocsugjfjrpcuexqxehee.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3VnamZqcnBjdWV4cXhlaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDA1MDEsImV4cCI6MjA3NDYxNjUwMX0.abA2yFZ1OaK0A0d90AeEJrdmcMRNUh5-qGpHHdJ47Xg'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  console.log('📍 URL:', supabaseUrl)
  
  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase.from('news_categories').select('*').limit(5)
    
    if (error) {
      console.error('❌ Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful!')
    console.log('📊 Found', data.length, 'news categories:')
    data.forEach(category => {
      console.log(`  - ${category.name} (${category.slug})`)
    })
    
    // Test 2: Check if we can query news_stories table
    const { data: stories, error: storiesError } = await supabase
      .from('news_stories')
      .select('*')
      .limit(3)
    
    if (storiesError) {
      console.warn('⚠️ News stories table query failed:', storiesError.message)
    } else {
      console.log('📰 Found', stories.length, 'news stories')
    }
    
    return true
  } catch (err) {
    console.error('❌ Connection test failed:', err.message)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase setup is working correctly!')
    console.log('🚀 Ready for deployment to Vercel')
  } else {
    console.log('\n💥 Supabase setup needs attention')
  }
  process.exit(success ? 0 : 1)
})