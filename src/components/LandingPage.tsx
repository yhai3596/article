import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Users, Mail, Instagram, Linkedin, Twitter, Clock, Shield, TrendingUp, Filter, Share2, Globe, Sparkles, BarChart3, Rocket, CheckCircle, ArrowRight, Star, Play, Eye } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Enhanced animation setup for fade-in effects
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in-up');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const features = [
    {
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-2xl flex items-center justify-center shadow-gradient group-hover:scale-110 transition-transform duration-300">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      ),
      title: "AI-Powered Content",
      description: "Generate professional social media content using advanced AI technology",
      benefit: "Never write from scratch again — get posts written in your brand voice"
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-brand-secondary to-purple-600 rounded-2xl flex items-center justify-center shadow-gradient group-hover:scale-110 transition-transform duration-300">
          <Eye className="w-8 h-8 text-white" />
        </div>
      ),
      title: "Stay Focused",
      description: "Only see news that matters to your audience with smart AI filtering",
      benefit: "Cut through the noise and focus on what drives engagement"
    },
    {
      icon: (
        <div className="w-16 h-16 bg-gradient-to-br from-brand-accent to-gray-800 rounded-2xl flex items-center justify-center shadow-gradient group-hover:scale-110 transition-transform duration-300">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
      ),
      title: "Content Growth Tools",
      description: "Track performance and share directly to all major platforms with analytics",
      benefit: "Grow your audience with data-driven content that performs"
    }
  ];

  const platforms = [
    {
      icon: <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm"><img src="/images/instagram_logo.jpg" alt="Instagram" className="w-full h-full object-contain" /></div>,
      name: "Instagram",
      color: "bg-gradient-to-br from-purple-500 to-pink-500",
      preview: "/imgs/instagram_mobile_post_interface_mockup_template.jpg",
      description: "Stories & posts with perfect visual appeal",
      mockupAlt: "Instagram post preview showing AI news content"
    },
    {
      icon: <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm"><img src="/images/linkedin_logo.png" alt="LinkedIn" className="w-full h-full object-contain" /></div>,
      name: "LinkedIn",
      color: "bg-gradient-to-br from-blue-600 to-blue-700",
      preview: "/imgs/linkedin_ad_mockup_feed_preview_professional.jpg",
      description: "Professional content that builds authority",
      mockupAlt: "LinkedIn post preview showing professional AI news content"
    },
    {
      icon: <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm"><img src="/images/x_twitter_logo.jpg" alt="X (Twitter)" className="w-full h-full object-contain" /></div>,
      name: "X (Twitter)",
      color: "bg-gradient-to-br from-gray-800 to-black",
      preview: "/imgs/threads_post_preview_9.jpg",
      description: "Engaging threads that spark conversations",
      mockupAlt: "X/Twitter thread preview showing AI news content"
    },
    {
      icon: <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm"><img src="/images/facebook_logo.jpg" alt="Facebook" className="w-full h-full object-contain" /></div>,
      name: "Facebook",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      preview: "/imgs/modern_social_media_app_icons_set.jpg",
      description: "Community-focused posts that drive engagement",
      mockupAlt: "Facebook post preview showing AI news content"
    },
    {
      icon: <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm"><img src="/images/threads_logo.png" alt="Threads" className="w-full h-full object-contain" /></div>,
      name: "Threads",
      color: "bg-gradient-to-br from-gray-700 to-gray-900",
      preview: "/imgs/meta_threads_mobile_post_mockup_light_dark_mode.jpg",
      description: "Conversational content for authentic connections",
      mockupAlt: "Threads post preview showing AI news content"
    }
  ];

  const benefits = [
    { icon: <Clock className="w-8 h-8 text-brand-primary" />, text: "Save 10+ hours per week", subtext: "Automated content creation" },
    { icon: <Shield className="w-8 h-8 text-brand-success" />, text: "Professional quality content", subtext: "AI-optimized for each platform" },
    { icon: <Rocket className="w-8 h-8 text-brand-secondary" />, text: "Grow your audience", subtext: "Consistent, engaging content" }
  ];

  const testimonials = [
    {
      name: "Saman Ahmed",
      role: "LinkedIn Influencer & Outreach Specialist",
      company: "",
      content: "DailyByte has transformed how we share AI news. The content quality is exceptional and saves us hours daily. Our engagement increased 300% in just 2 months.",
      avatar: "/images/saman_ahmed.jpg",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Tech Journalist",
      company: "Future Tech Media",
      content: "The most efficient way to stay on top of AI trends and create engaging content for multiple platforms. It's like having a content team in your pocket.",
      avatar: "/images/michael_rodriguez.jpg",
      rating: 5
    },
    {
      name: "Markandey Sharma",
      role: "300k+ Followers & Top AI Voice",
      company: "",
      content: "Our AI news engagement increased 300% after using DailyByte. The automated email system is incredible and our audience loves the consistent quality.",
      avatar: "/images/markandey_sharma.jpg",
      rating: 5
    }
  ];

  const trustedBy = [
    { name: "Stripe", users: "2.5K+" },
    { name: "Airbnb", users: "1.8K+" },
    { name: "Dropbox", users: "3.2K+" },
    { name: "GitLab", users: "1.5K+" },
    { name: "Zapier", users: "2.1K+" },
    { name: "DoorDash", users: "1.2K+" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-background via-white to-brand-background">

      {/* Navigation */}
      <nav className="px-6 py-4 bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center shadow-soft">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-brand-accent">DailyByte</span>
              <span className="text-xs text-gray-500 font-medium block leading-none whitespace-nowrap">Transform news into content</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-brand-accent font-medium transition-colors btn-secondary py-2 px-4 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-primary text-sm px-5 py-2"
            >
              Start Free Today
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-background via-white to-purple-50 opacity-60"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl leading-headingLarge text-brand-accent tracking-tight">
              Get AI news turned into
              <span className="text-gradient"> ready-to-post </span>
              content for every major platform
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-body leading-body max-w-3xl mx-auto">
              The only platform to turn the latest news into ready-to-share posts every day
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => navigate('/signup')}
                className="btn-accent text-lg px-8 py-4 shadow-gradient"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary text-lg px-8 py-4"
              >
                <Bot className="w-5 h-5 mr-2 inline" />
                Sign In
              </button>
            </div>
            
            {/* Trust Row */}
            <div className="pt-8 fade-in-up">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex -space-x-2">
                  <img src="/images/profile_new_1.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src="/images/profile_new_2.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  <img src="/images/profile_new_3.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  Trusted by <span className="font-bold text-brand-accent">500+</span> content creators
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 opacity-60">
                {trustedBy.slice(0, 4).map((company, index) => (
                  <div key={index} className="text-xs text-gray-500 font-medium">
                    {company.name} • {company.users}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Showcase Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-accent mb-6">
              Create content for <span className="text-gradient">every platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-body">
              Generate platform-optimized content with real previews and instant posting capabilities
            </p>
          </div>
          
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {platforms.slice(0, 3).map((platform, index) => (
              <div key={index} className="fade-in-up group">
                <div className="card-neumorphic p-6 hover:shadow-gradient transition-all duration-300 group-hover:-translate-y-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {platform.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-brand-accent">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  <div className="platform-mockup group-hover:scale-105">
                    <img 
                      src={platform.preview} 
                      alt={platform.mockupAlt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {platforms.slice(3, 5).map((platform, index) => (
                <div key={index + 3} className="fade-in-up group">
                  <div className="card-neumorphic p-6 hover:shadow-gradient transition-all duration-300 group-hover:-translate-y-2">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {platform.icon}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg text-brand-accent">{platform.name}</h3>
                        <p className="text-sm text-gray-600">{platform.description}</p>
                      </div>
                    </div>
                    <div className="platform-mockup group-hover:scale-105">
                      <img 
                        src={platform.preview} 
                        alt={platform.mockupAlt}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 lg:py-24 bg-gradient-to-br from-white to-brand-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-accent mb-6">
              Everything you need to <span className="text-gradient">dominate</span> AI content
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-body">
              Powerful features designed to transform how you create and share AI news content
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="fade-in-up group">
                <div className="card-gradient p-8 h-full hover:shadow-gradient transition-all duration-300 group-hover:-translate-y-1">
                  <div className="mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="font-heading font-bold text-xl text-brand-accent mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4 leading-body">{feature.description}</p>
                  <div className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-xl p-4 border border-brand-primary/20">
                    <p className="text-brand-accent font-medium text-sm">
                      💡 {feature.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto text-center fade-in-up">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-accent mb-12">
            Why content creators choose <span className="text-gradient">DailyByte</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="card-neumorphic p-6 group hover:shadow-gradient transition-all duration-300">
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-brand-accent mb-2">{benefit.text}</h3>
                <p className="text-gray-600 text-sm">{benefit.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-16 lg:py-24 bg-gradient-to-br from-brand-background to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-brand-accent mb-6">
              Loved by <span className="text-gradient">hundreds</span> of creators worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about their content transformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="fade-in-up">
                <div className="card-neumorphic p-6 h-full hover:shadow-gradient transition-all duration-300">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-body italic">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-heading font-bold text-brand-accent">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}{testimonial.company && ` at ${testimonial.company}`}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 lg:py-24 bg-gradient-to-br from-brand-primary via-brand-secondary to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center fade-in-up">
          <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6">
            Ready to transform your AI content strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90 leading-body">
            Join hundreds of creators who've already up their content game with DailyByte
          </p>
          <div className="flex justify-center py-8">
            <button
              onClick={() => navigate('/signup')}
              className="bg-white text-brand-accent font-medium px-8 py-4 rounded-pill shadow-neumorphic hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
            >
              Start Creating Content Now
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-brand-accent text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-secondary rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="font-heading font-bold text-xl">DailyByte</span>
              </div>
              <p className="text-gray-300 leading-body max-w-md">
                Transform AI news into engaging social media content across all major platforms. Built for creators, by creators.
              </p>
              <div className="text-xs text-gray-400 mt-4 opacity-60">
                Created by <span className="font-medium">MiniMax Agent</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DailyByte. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;