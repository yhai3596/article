import { createClient } from '@supabase/supabase-js'

// Use environment variables for production deployment
// Fallback to actual project credentials for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocsugjfjrpcuexqxehee.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jc3VnamZqcnBjdWV4cXhlaGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNDA1MDEsImV4cCI6MjA3NDYxNjUwMX0.abA2yFZ1OaK0A0d90AeEJrdmcMRNUh5-qGpHHdJ47Xg'

// Validate that Supabase credentials are provided
if (supabaseUrl && supabaseAnonKey) {
  console.log('✅ Supabase configured successfully')
  console.log('🔗 Connected to:', supabaseUrl)
} else {
  console.error('❌ Supabase credentials missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)