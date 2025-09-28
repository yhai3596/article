-- DailyByte AI News - Complete Database Setup Script
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (User profiles)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    full_name TEXT,
    company TEXT,
    role TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. News Categories Table
CREATE TABLE news_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color_code VARCHAR(7) DEFAULT '#3B82F6',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. News Stories Table
CREATE TABLE news_stories (
    id SERIAL PRIMARY KEY,
    source TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    url TEXT NOT NULL,
    publication_date TIMESTAMP NOT NULL,
    credibility_score INTEGER DEFAULT 0,
    selected_status BOOLEAN DEFAULT false,
    category_id INTEGER REFERENCES news_categories(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Generated Content Table
CREATE TABLE generated_content (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL REFERENCES news_stories(id),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'x', 'email')),
    content_text TEXT NOT NULL,
    image_url TEXT,
    generation_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. User Preferences Table
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    email TEXT NOT NULL,
    schedule_time TIME DEFAULT '09:00:00',
    notification_settings JSONB DEFAULT '{}',
    platform_priorities JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. User Category Preferences Table
CREATE TABLE user_category_preferences (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    category_id INTEGER NOT NULL REFERENCES news_categories(id),
    is_enabled BOOLEAN DEFAULT true,
    priority_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

-- Insert default categories
INSERT INTO news_categories (name, slug, description, color_code, sort_order) VALUES
('AI Research', 'ai-research', 'Latest breakthroughs in artificial intelligence research', '#8B5CF6', 1),
('Company News', 'company-news', 'Major AI company announcements and updates', '#3B82F6', 2),
('Product Launches', 'product-launches', 'New AI products and service releases', '#10B981', 3),
('Industry Analysis', 'industry-analysis', 'Market trends and industry insights', '#F59E0B', 4),
('Startups', 'startups', 'AI startup funding and developments', '#EF4444', 5),
('Funding News', 'funding-news', 'Investment and acquisition news', '#8B5CF6', 6),
('Tech Policy', 'tech-policy', 'AI regulation and policy developments', '#6B7280', 7),
('AI Safety', 'ai-safety', 'AI ethics and safety discussions', '#DC2626', 8);

-- Create indexes for better performance
CREATE INDEX idx_news_stories_publication_date ON news_stories(publication_date DESC);
CREATE INDEX idx_news_stories_category ON news_stories(category_id);
CREATE INDEX idx_news_stories_selected ON news_stories(selected_status);
CREATE INDEX idx_generated_content_story ON generated_content(story_id);
CREATE INDEX idx_generated_content_platform ON generated_content(platform);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_category_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_category_preferences
CREATE POLICY "Users can view own category preferences" ON user_category_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own category preferences" ON user_category_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own category preferences" ON user_category_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for news-related tables
CREATE POLICY "Anyone can read news categories" ON news_categories
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read news stories" ON news_stories
    FOR SELECT USING (true);

CREATE POLICY "Anyone can read generated content" ON generated_content
    FOR SELECT USING (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (new.id, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();