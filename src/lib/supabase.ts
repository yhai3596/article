import { createClient } from '@supabase/supabase-js'

// Use environment variables for production deployment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://imcuvinfqoqxyomiofgz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltY3V2aW5mcW9xeHlvbWlvZmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNzM0MjgsImV4cCI6MjA3MDc0OTQyOH0.WLOd6ul-CrtW_xQrvWgE_wAWkv2S2rCVDZErziG051c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)