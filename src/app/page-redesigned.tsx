'use client'

import { useRouter } from 'next/navigation'
import { 
  Bot, Heart, GraduationCap, Target, Sparkles, ArrowRight, 
  Mic, Globe, Clock, Brain, TrendingUp, MessageCircle,
  Moon, Sun, Menu, X, ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const AGENTS = [
  {
    id: 'mitra',
    name: 'Mitra',
    tagline: 'Your Empathetic Companion',
    icon: Heart,
    description: 'Advanced emotional intelligence for meaningful conversations and personal well-being support.',
    features: [
      { icon: Brain, text: 'Emotional Intelligence' },
      { icon: Globe, text: 'Cultural Sensitivity' },
      { icon: MessageCircle, text: 'Natural Conversations' },
      { icon: Clock, text: 'Always Available' }
    ],
    gradient: 'from-rose-500 to-pink-600',
    bgGradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30',
    borderColor: 'border-rose-200 dark:border-rose-800/50'
  },
  {
    id: 'guru',
    name: 'Guru', 
    tagline: 'Your Learning Mentor',
    icon: GraduationCap,
    description: 'Personalized learning paths with adaptive AI that grows with your knowledge and skills.',
    features: [
      { icon: TrendingUp, text: 'Adaptive Learning' },
      { icon: Target, text: 'Skill Assessment' },
      { icon: Brain, text: 'Progress Tracking' },
      { icon: Sparkles, text: 'Interactive Quizzes' }
    ],
    gradient: 'from-violet-500 to-purple-600',
    bgGradient: 'from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30',
    borderColor: 'border-violet-200 dark:border-violet-800/50'
  },
  {
    id: 'parikshak',
    name: 'Parikshak',
    tagline: 'Your Performance Coach',
    icon: Target,
    description: 'Intelligent performance analysis with detailed feedback for continuous professional growth.',
    features: [
      { icon: TrendingUp, text: 'Performance Analytics' },
      { icon: Brain, text: 'Smart Evaluation' },
      { icon: MessageCircle, text: 'Video Interviews' },
      { icon: Sparkles, text: 'Growth Insights' }
    ],
    gradient: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
    borderColor: 'border-emerald-200 dark:border-emerald-800/50'
  }
]

const GLOBAL_FEATURES = [
  { icon: Mic, text: 'Voice-Enabled' },
  { icon: Globe, text: 'Multilingual' },
  { icon: Clock, text: 'Real-Time' }
]

export default function Landing() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">SkillSaathi</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#agents" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                AI Agents
              </a>
              <a href="#features" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                Features
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3">
              <a href="#agents" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                AI Agents
              </a>
              <a href="#features" className="block text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
                Features
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Personal Development Platform
          </div>

          {/* Main Heading */}
          <div className="space-y-6 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
              Choose Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Companion
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Personalized AI agents designed for meaningful conversations, adaptive learning, and intelligent performance coaching.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '0.2s'}}>
            <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl font-semibold text-lg transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg">
              Watch Demo
            </button>
          </div>

          {/* Global Features */}
          <div className="flex flex-wrap justify-center gap-6 pt-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
            {GLOBAL_FEATURES.map((feature, index) => (
              <div key={feature.text} className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                <feature.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section id="agents" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Meet Your AI Companions
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Each agent is specialized to support different aspects of your personal and professional growth.
            </p>
          </div>

          {/* Agent Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AGENTS.map((agent, index) => {
              const IconComponent = agent.icon
              return (
                <div
                  key={agent.id}
                  className={`group bg-gradient-to-br ${agent.bgGradient} border ${agent.borderColor} rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer animate-slide-up`}
                  style={{animationDelay: `${index * 0.1}s`}}
                  onClick={() => router.push(`/agents/${agent.id}`)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${agent.name} chat`}
                >
                  {/* Agent Icon & Header */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${agent.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{agent.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400 font-medium">{agent.tagline}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {agent.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <feature.icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button className={`w-full px-6 py-3 bg-gradient-to-r ${agent.gradient} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                    Start Chatting
                    <ChevronRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
            Our AI companions use cutting-edge technology to provide personalized, intelligent interactions.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <Mic className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Voice Recognition</h3>
              <p className="text-slate-600 dark:text-slate-300">Natural speech processing for seamless conversations</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <Globe className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Multilingual Support</h3>
              <p className="text-slate-600 dark:text-slate-300">Communicate in your preferred language</p>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all">
              <Brain className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Adaptive Intelligence</h3>
              <p className="text-slate-600 dark:text-slate-300">AI that learns and adapts to your unique needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SkillSaathi</span>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Empowering growth through intelligent AI companions designed for India's diverse needs.
          </p>
          <div className="flex justify-center space-x-8 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Support</a>
          </div>
          <p className="text-slate-500 text-sm">© 2024 SkillSaathi. Built with ❤️ in India.</p>
        </div>
      </footer>
    </div>
  )
}
