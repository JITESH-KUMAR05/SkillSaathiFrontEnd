'use client'

import { useRouter } from 'next/navigation'
import { Bot, Heart, GraduationCap, Target, Sparkles, CheckCircle, ArrowRight, Users, Zap, Shield } from 'lucide-react'
import { useState } from 'react'

const AGENTS = [
  {
    id: 'mitra',
    name: 'Mitra',
    tagline: 'Your Empathetic Companion',
    gradient: 'from-pink-50 via-rose-50 to-pink-100',
    borderGradient: 'from-pink-200 to-rose-300',
    accentColor: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50/80 to-rose-100/60',
    glowColor: 'rgba(236, 72, 153, 0.2)',
    icon: Heart,
    blurb: 'Gentle conversations with cultural sensitivity and emotional intelligence for daily support.',
    highlights: ['Empathetic responses', 'Cultural awareness', 'Mood tracking', 'Daily check-ins'],
    stats: { users: '10K+', satisfaction: '98%' }
  },
  {
    id: 'guru',
    name: 'Guru',
    tagline: 'Your Learning Mentor',
    gradient: 'from-purple-50 via-violet-50 to-purple-100',
    borderGradient: 'from-purple-200 to-violet-300',
    accentColor: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50/80 to-violet-100/60',
    glowColor: 'rgba(168, 85, 247, 0.2)',
    icon: GraduationCap,
    blurb: 'Structured learning paths with adaptive explanations tailored to your pace and goals.',
    highlights: ['Personalized curriculum', 'Adaptive difficulty', 'Progress tracking', 'Skill assessments'],
    stats: { users: '15K+', satisfaction: '96%' }
  },
  {
    id: 'parikshak',
    name: 'Parikshak',
    tagline: 'Your Performance Coach',
    gradient: 'from-green-50 via-emerald-50 to-green-100',
    borderGradient: 'from-green-200 to-emerald-300',
    accentColor: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50/80 to-emerald-100/60',
    glowColor: 'rgba(16, 185, 129, 0.2)',
    icon: Target,
    blurb: 'Smart evaluations with detailed feedback and performance analytics for continuous improvement.',
    highlights: ['Intelligent quizzes', 'Detailed analytics', 'Performance insights', 'Growth recommendations'],
    stats: { users: '8K+', satisfaction: '97%' }
  }
]

export default function Landing() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen px-6 py-12 md:py-20 relative">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl animate-gentle-float"></div>
        <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-green-200/20 to-blue-200/20 rounded-full blur-3xl animate-gentle-float stagger-3"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-gentle-float stagger-5"></div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Enhanced Header Section with Quick Actions */}
        <header className="text-center space-y-8 mb-20 animate-slide-up">
          {/* Premium badge with pulse effect */}
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/80 backdrop-blur-lg border border-white/50 text-slate-600 text-sm font-medium shadow-premium hover:shadow-premium-hover transition-all duration-300 hero-glow fast-hover">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-soft-pulse"></div>
              <Sparkles className="w-5 h-5 text-purple-500" /> 
              <span className="font-semibold">Multi-Agent AI Platform for India</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-xs font-bold text-green-700">
              <Shield className="w-3 h-3" />
              Trusted
            </div>
          </div>
          
          {/* Hero title with enhanced styling */}
          <div className="hero-glow space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
              <span className="bg-gradient-to-r from-slate-800 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                Choose Your
              </span>
              <br />
              <span className="text-5xl md:text-7xl bg-gradient-to-r from-purple-600 via-pink-500 to-green-600 bg-clip-text text-transparent animate-shimmer">
                AI Companion
              </span>
            </h1>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-6">
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-sm hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl btn-shine fast-hover">
                Try Demo
              </button>
              <button className="px-6 py-3 bg-white/80 backdrop-blur-sm border border-white/40 text-slate-700 rounded-full font-semibold text-sm hover:bg-white/90 hover:-translate-y-1 transition-all duration-200 shadow-lg fast-hover">
                Watch Video
              </button>
            </div>
          </div>
          
          {/* Enhanced description */}
          <div className="space-y-6">
            <p className="text-slate-600 max-w-3xl mx-auto text-xl md:text-2xl leading-relaxed font-medium">
              Personalized agents crafted for meaningful conversation, adaptive learning, and intelligent evaluation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2 px-4 py-3 bg-white/60 rounded-full border border-white/40 fast-hover hover:bg-white/80">
                <Zap className="w-4 h-4 text-yellow-500" />
                Voice-ready
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/60 rounded-full border border-white/40 fast-hover hover:bg-white/80">
                <Users className="w-4 h-4 text-blue-500" />
                Culturally aware
              </div>
              <div className="flex items-center gap-2 px-4 py-3 bg-white/60 rounded-full border border-white/40 fast-hover hover:bg-white/80">
                <Bot className="w-4 h-4 text-purple-500" />
                Real-time responsive
              </div>
            </div>
          </div>

          {/* Enhanced stats section */}
          <div className="flex flex-wrap justify-center gap-8 pt-6">
            <div className="text-center p-4 rounded-2xl bg-white/50 border border-white/30 fast-hover hover:bg-white/70">
              <div className="text-3xl font-bold text-slate-800 mb-1">30K+</div>
              <div className="text-sm text-slate-500">Active Users</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/50 border border-white/30 fast-hover hover:bg-white/70">
              <div className="text-3xl font-bold text-slate-800 mb-1">97%</div>
              <div className="text-sm text-slate-500">Satisfaction</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white/50 border border-white/30 fast-hover hover:bg-white/70">
              <div className="text-3xl font-bold text-slate-800 mb-1">24/7</div>
              <div className="text-sm text-slate-500">Available</div>
            </div>
          </div>
        </header>

        {/* Vertical Agent Cards - Enhanced Design */}
        <div className="space-y-8 mb-24 max-w-4xl mx-auto">
          {AGENTS.map((agent, index) => {
            const IconComponent = agent.icon
            const isHovered = hovered === agent.id
            return (
              <div
                key={agent.id}
                className={`group relative rounded-3xl overflow-hidden transition-all duration-500 ease-out animate-slide-up card-shimmer interactive-element stagger-${index + 1}`}
                style={{
                  boxShadow: isHovered 
                    ? `0 25px 50px ${agent.glowColor}, 0 0 0 1px rgba(255, 255, 255, 0.4)` 
                    : '0 8px 25px rgba(148, 163, 184, 0.1)'
                }}
                onMouseEnter={() => setHovered(agent.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Animated gradient border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${agent.borderGradient} opacity-50 group-hover:opacity-80 transition-opacity duration-500`}></div>
                
                {/* Main card content */}
                <div className="relative m-[1px] rounded-3xl bg-white/90 backdrop-blur-xl border border-white/60 professional-card shadow-premium group-hover:shadow-premium-hover">
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      
                      {/* Left section - Agent info */}
                      <div className="flex-1 space-y-6">
                        {/* Agent header */}
                        <div className="flex items-start gap-6">
                          <div className={`relative p-5 rounded-3xl ${agent.bgColor} border border-white/60 shadow-soft group-hover:shadow-medium transition-all duration-300 flex-shrink-0`}>
                            <IconComponent className={`w-8 h-8 ${agent.accentColor} transition-transform duration-300 group-hover:scale-110`} />
                            <div className="absolute -inset-1 bg-gradient-to-r from-white/50 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors mb-2">{agent.name}</h3>
                            <p className={`text-lg font-semibold ${agent.accentColor} opacity-80 group-hover:opacity-100 mb-3`}>{agent.tagline}</p>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-soft-pulse"></div>
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{agent.stats.users} users</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium">{agent.stats.satisfaction} satisfaction</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-700 transition-colors">
                          {agent.blurb}
                        </p>

                        {/* Enhanced highlights grid */}
                        <div className="grid grid-cols-2 gap-4">
                          {agent.highlights.map((highlight, idx) => (
                            <div key={highlight} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/30 group-hover:bg-white/70 group-hover:border-white/50 transition-all duration-300">
                              <div className="relative">
                                <CheckCircle className={`w-5 h-5 ${agent.accentColor} opacity-70 group-hover:opacity-100 transition-all duration-300`} />
                                <div className="absolute inset-0 bg-current rounded-full opacity-0 group-hover:opacity-20 scale-150 transition-all duration-300"></div>
                              </div>
                              <span className="text-slate-600 font-medium group-hover:text-slate-700 transition-colors text-sm">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right section - Colorful CTA Button */}
                      <div className="md:w-64 flex-shrink-0">
                        <button
                          onClick={() => router.push(`/agents/${agent.id}`)}
                          className={`w-full group relative overflow-hidden rounded-2xl p-8 text-white font-bold text-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl`}
                          style={{
                            background: agent.id === 'mitra' 
                              ? 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
                              : agent.id === 'guru'
                              ? 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
                              : 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)'
                          }}
                        >
                          {/* Button glow effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative z-10 space-y-3">
                            <div className="flex items-center justify-center gap-3">
                              <IconComponent className="w-6 h-6" />
                              <span>Enter Space</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm opacity-90">
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                              <span>Start Now</span>
                            </div>
                          </div>

                          {/* Animated background pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </div>
                        </button>

                        {/* Additional quick actions */}
                        <div className="mt-4 space-y-2">
                          <button className="w-full text-sm text-slate-600 hover:text-slate-800 py-2 px-4 rounded-lg bg-white/60 hover:bg-white/80 border border-white/40 hover:border-white/60 transition-all duration-200 font-medium">
                            Preview Demo
                          </button>
                          <button className="w-full text-sm text-slate-600 hover:text-slate-800 py-2 px-4 rounded-lg bg-white/60 hover:bg-white/80 border border-white/40 hover:border-white/60 transition-all duration-200 font-medium">
                            Learn More
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

        {/* Enhanced Feature Highlights Section */}
        <section className="animate-slide-up stagger-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Why Choose Our AI Platform?
            </h2>
            <p className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Advanced technology meets human understanding for the perfect AI companion experience
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="professional-card glass-card-fast interactive-element card-shimmer shadow-premium fast-hover card-hover-fast">
              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 shadow-soft">
                    <Sparkles className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-bold text-xl mb-2">Real-time Voice</h3>
                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Under 100ms response time</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Ultra-low latency voice conversations with natural Indian accents and cultural nuances for seamless communication.
                </p>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl btn-shine fast-hover">
                  Try Voice Demo
                </button>
              </div>
            </div>
            
            <div className="professional-card glass-card-fast interactive-element card-shimmer shadow-premium fast-hover card-hover-fast">
              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 shadow-soft">
                    <Bot className="w-7 h-7 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-bold text-xl mb-2">Context Memory</h3>
                    <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
                      <Shield className="w-4 h-4" />
                      <span>Secure & Private</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Advanced session awareness with persistent memory and expandable knowledge base for personalized interactions.
                </p>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl btn-shine fast-hover">
                  Learn More
                </button>
              </div>
            </div>
            
            <div className="professional-card glass-card-fast interactive-element card-shimmer shadow-premium fast-hover card-hover-fast">
              <div className="p-8">
                <div className="flex items-center gap-6 mb-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-soft">
                    <Target className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-800 font-bold text-xl mb-2">Focused Spaces</h3>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                      <Users className="w-4 h-4" />
                      <span>Tailored Experience</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Dedicated environments optimized for each agent's unique interaction style and specialized purpose.
                </p>
                <button className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl btn-shine fast-hover">
                  Explore Spaces
                </button>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <button className="px-8 py-4 bg-gradient-to-r from-slate-800 to-purple-800 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:-translate-y-1 transition-all duration-200 shadow-xl hover:shadow-2xl btn-shine fast-hover">
              Get Started Today
            </button>
            <p className="text-slate-500 text-sm mt-4">No credit card required • Free trial available</p>
          </div>
        </section>
      </div>
    </div>
  )
}
