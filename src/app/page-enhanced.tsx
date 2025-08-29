'use client'

import { useRouter } from 'next/navigation'
import { Bot, Heart, GraduationCap, Target, Sparkles, CheckCircle, ArrowRight, Users, Zap, Shield, Moon, Sun, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const AGENTS = [
  {
    id: 'mitra',
    name: 'Mitra',
    tagline: 'Your Empathetic Companion',
    gradient: 'from-pink-400 via-rose-400 to-pink-500 dark:from-pink-500 dark:via-rose-500 dark:to-pink-600',
    cardGradient: 'from-pink-50/80 via-rose-50/80 to-pink-100/80 dark:from-pink-900/20 dark:via-rose-900/20 dark:to-pink-800/20',
    borderGradient: 'from-pink-200 to-rose-300 dark:from-pink-800 dark:to-rose-700',
    accentColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-gradient-to-br from-pink-50/60 to-rose-100/60 dark:from-pink-950/30 dark:to-rose-900/30',
    glowColor: 'rgba(236, 72, 153, 0.3)',
    icon: Heart,
    blurb: 'Experience empathetic conversations with advanced emotional intelligence, cultural sensitivity, and personalized support for your daily well-being.',
    highlights: ['Emotional Intelligence', 'Cultural Awareness', 'Mood Analysis', 'Personal Growth'],
    stats: { users: '12K+', satisfaction: '98%', uptime: '99.9%' },
    features: ['Voice Recognition', 'Multilingual Support', 'Sentiment Analysis', '24/7 Availability']
  },
  {
    id: 'guru',
    name: 'Guru',
    tagline: 'Your Learning Mentor',
    gradient: 'from-purple-400 via-violet-400 to-purple-500 dark:from-purple-500 dark:via-violet-500 dark:to-purple-600',
    cardGradient: 'from-purple-50/80 via-violet-50/80 to-purple-100/80 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-purple-800/20',
    borderGradient: 'from-purple-200 to-violet-300 dark:from-purple-800 dark:to-violet-700',
    accentColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-gradient-to-br from-purple-50/60 to-violet-100/60 dark:from-purple-950/30 dark:to-violet-900/30',
    glowColor: 'rgba(168, 85, 247, 0.3)',
    icon: GraduationCap,
    blurb: 'Unlock your learning potential with adaptive AI that creates personalized curricula, tracks progress, and adjusts to your unique learning style.',
    highlights: ['Adaptive Learning', 'Skill Assessment', 'Progress Tracking', 'Interactive Quizzes'],
    stats: { users: '18K+', satisfaction: '97%', uptime: '99.8%' },
    features: ['Personalized Curriculum', 'Real-time Feedback', 'Skill Mapping', 'Learning Analytics']
  },
  {
    id: 'parikshak',
    name: 'Parikshak',
    tagline: 'Your Performance Coach',
    gradient: 'from-green-400 via-emerald-400 to-green-500 dark:from-green-500 dark:via-emerald-500 dark:to-green-600',
    cardGradient: 'from-green-50/80 via-emerald-50/80 to-green-100/80 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-800/20',
    borderGradient: 'from-green-200 to-emerald-300 dark:from-green-800 dark:to-emerald-700',
    accentColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-gradient-to-br from-green-50/60 to-emerald-100/60 dark:from-green-950/30 dark:to-emerald-900/30',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    icon: Target,
    blurb: 'Master your skills with intelligent assessments, detailed performance analytics, and AI-powered feedback to accelerate your professional growth.',
    highlights: ['Performance Analytics', 'Skill Evaluation', 'Video Interviews', 'Career Guidance'],
    stats: { users: '10K+', satisfaction: '96%', uptime: '99.7%' },
    features: ['AI Assessments', 'Video Analysis', 'Performance Metrics', 'Growth Recommendations']
  }
]

export default function Landing() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [hovered, setHovered] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen transition-all duration-300">
      {/* Enhanced Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-200">SkillSaathi</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#agents" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Agents</a>
              <a href="#features" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Features</a>
              <a href="#about" className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">About</a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all theme-toggle"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all theme-toggle"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-white/40 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-slate-700/40 animate-slide-up">
              <div className="space-y-4">
                <a href="#agents" className="block text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Agents</a>
                <a href="#features" className="block text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Features</a>
                <a href="#about" className="block text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">About</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Enhanced Design */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 dark:from-purple-400/20 dark:to-pink-400/20 rounded-full blur-3xl animate-gentle-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/10 to-blue-400/10 dark:from-green-400/20 dark:to-blue-400/20 rounded-full blur-3xl animate-gentle-float stagger-3"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 dark:from-yellow-400/20 dark:to-orange-400/20 rounded-full blur-3xl animate-gentle-float stagger-5"></div>
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-12 relative">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 shadow-premium hover:shadow-premium-hover transition-all duration-300 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-soft-pulse"></div>
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Multi-Agent AI Platform for India</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full">
              <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-bold text-green-700 dark:text-green-300">Trusted by 40K+ Users</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="space-y-8 animate-slide-up stagger-1">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
              <span className="bg-gradient-to-r from-slate-800 via-purple-700 to-pink-600 dark:from-slate-200 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                Choose Your Perfect
              </span>
              <br />
              <span className="text-5xl md:text-7xl bg-gradient-to-r from-purple-600 via-pink-500 to-green-500 dark:from-purple-400 dark:via-pink-400 dark:to-green-400 bg-clip-text text-transparent animate-shimmer">
                AI Companion
              </span>
            </h1>
            
            <p className="text-slate-600 dark:text-slate-400 max-w-4xl mx-auto text-xl md:text-2xl leading-relaxed font-medium">
              Experience the future of AI interaction with personalized agents crafted for meaningful conversations, adaptive learning, and intelligent performance evaluation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-2xl font-semibold text-lg hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-premium hover:shadow-premium-hover btn-shine animate-glow-pulse">
                <span className="flex items-center gap-3">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/40 dark:border-slate-700/40 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold text-lg hover:bg-white/90 dark:hover:bg-slate-800/90 hover:-translate-y-1 transition-all duration-200 shadow-premium">
                Watch Demo
              </button>
            </div>

            {/* Feature Tags */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              {[
                { icon: Zap, text: 'Voice-Enabled', color: 'text-yellow-500' },
                { icon: Users, text: 'Culturally Aware', color: 'text-blue-500' },
                { icon: Bot, text: 'Real-time AI', color: 'text-purple-500' }
              ].map((feature, index) => (
                <div key={feature.text} className={`flex items-center gap-3 px-6 py-3 bg-white/60 dark:bg-slate-800/60 rounded-full border border-white/40 dark:border-slate-700/40 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all animate-slide-up stagger-${index + 2}`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 animate-slide-up stagger-3">
              {[
                { value: '40K+', label: 'Active Users' },
                { value: '97%', label: 'Satisfaction' },
                { value: '24/7', label: 'Available' }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Agents Section */}
      <section id="agents" className="py-20 px-6">
        <div className="max-w-5xl mx-auto space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-6 animate-slide-up">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-800 dark:text-slate-200">
              Meet Your AI
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent ml-4">
                Companions
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Each agent is uniquely designed with specialized capabilities to support different aspects of your personal and professional growth.
            </p>
          </div>

          {/* Agent Cards - Vertical Layout */}
          <div className="space-y-12">
            {AGENTS.map((agent, index) => {
              const IconComponent = agent.icon
              const isHovered = hovered === agent.id
              return (
                <div
                  key={agent.id}
                  className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ease-out animate-slide-up card-shimmer interactive-element stagger-${index + 1} cursor-pointer`}
                  style={{
                    boxShadow: isHovered 
                      ? `0 25px 50px ${agent.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.1)` 
                      : '0 8px 30px rgba(0, 0, 0, 0.1)'
                  }}
                  onMouseEnter={() => setHovered(agent.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                >
                  {/* Card Border Glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${agent.borderGradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                  
                  {/* Main Card Content */}
                  <div className={`relative m-[1px] rounded-3xl bg-gradient-to-br ${agent.cardGradient} backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-premium group-hover:shadow-premium-hover`}>
                    <div className="p-10 md:p-12">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                        
                        {/* Left Content */}
                        <div className="flex-1 space-y-8">
                          {/* Agent Header */}
                          <div className="flex items-start gap-6">
                            <div className={`relative p-6 rounded-3xl ${agent.bgColor} border border-white/40 dark:border-slate-700/40 shadow-premium group-hover:shadow-premium-hover transition-all duration-300 flex-shrink-0 group-hover:scale-110`}>
                              <IconComponent className={`w-10 h-10 ${agent.accentColor} transition-transform duration-300`} />
                              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-4xl font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors mb-3">{agent.name}</h3>
                              <p className={`text-xl font-semibold ${agent.accentColor} opacity-90 group-hover:opacity-100 mb-4`}>{agent.tagline}</p>
                              
                              {/* Enhanced Stats */}
                              <div className="flex items-center gap-8 text-sm text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-soft-pulse"></div>
                                  <Users className="w-4 h-4" />
                                  <span className="font-semibold">{agent.stats.users} users</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="font-semibold">{agent.stats.satisfaction} satisfaction</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Shield className="w-4 h-4 text-blue-500" />
                                  <span className="font-semibold">{agent.stats.uptime} uptime</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                            {agent.blurb}
                          </p>

                          {/* Highlights Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            {agent.highlights.map((highlight, idx) => (
                              <div key={highlight} className={`flex items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all animate-slide-up stagger-${idx + 1}`}>
                                <div className={`w-2 h-2 rounded-full ${agent.accentColor.replace('text-', 'bg-')}`}></div>
                                <span className="font-medium text-slate-700 dark:text-slate-300">{highlight}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Right Content - Features */}
                        <div className="lg:w-80 space-y-6">
                          <div className="bg-white/70 dark:bg-slate-800/70 rounded-3xl p-8 border border-white/40 dark:border-slate-700/40 shadow-premium">
                            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">Key Features</h4>
                            <div className="space-y-4">
                              {agent.features.map((feature, idx) => (
                                <div key={feature} className={`flex items-center gap-3 animate-slide-up stagger-${idx + 1}`}>
                                  <CheckCircle className={`w-5 h-5 ${agent.accentColor}`} />
                                  <span className="text-slate-600 dark:text-slate-400 font-medium">{feature}</span>
                                </div>
                              ))}
                            </div>
                            <button className={`w-full mt-8 px-6 py-4 bg-gradient-to-r ${agent.gradient} text-white rounded-2xl font-semibold hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-premium btn-shine`}>
                              <span className="flex items-center justify-center gap-3">
                                Start Chatting
                                <ArrowRight className="w-5 h-5" />
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-6 border-t border-white/20 dark:border-slate-800/50">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Bot className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">SkillSaathi</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Empowering India with culturally-aware AI companions for personal growth, learning, and professional development.
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Support</a>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">© 2024 SkillSaathi. Made with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  )
}
