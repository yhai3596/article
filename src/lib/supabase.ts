import { createClient } from '@supabase/supabase-js'

// Use environment variables for production deployment
// Replace these with your actual Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Validate that Supabase credentials are provided
if (!supabaseUrl.includes('your-project-id') && !supabaseAnonKey.includes('your-anon-key')) {
  console.log('✅ Supabase configured successfully')
} else {
  console.warn('⚠️ Please configure your Supabase credentials in environment variables or update the fallback values')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)