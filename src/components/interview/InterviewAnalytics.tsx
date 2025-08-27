'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Eye, 
  Volume2, 
  Brain, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Smile,
  Frown,
  Meh,
  Star,
  Award,
  Download,
  Share2
} from 'lucide-react'

interface AnalyticsMetric {
  id: string
  label: string
  value: number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  color: string
  icon: React.ReactNode
}

interface InteractionAnalytics {
  eyeContact: number
  speechClarity: number
  responseTime: number
  confidence: number
  engagement: number
}

interface ConversationFlow {
  timestamp: number
  speaker: 'candidate' | 'ai'
  duration: number
  sentiment: 'positive' | 'neutral' | 'negative'
  topics: string[]
}

const InterviewAnalyticsDashboard: React.FC = () => {
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [analytics, setAnalytics] = useState<InteractionAnalytics>({
    eyeContact: 85,
    speechClarity: 92,
    responseTime: 3.2,
    confidence: 78,
    engagement: 89
  })

  const [conversationFlow, setConversationFlow] = useState<ConversationFlow[]>([
    {
      timestamp: Date.now() - 300000,
      speaker: 'ai',
      duration: 15,
      sentiment: 'neutral',
      topics: ['introduction', 'greeting']
    },
    {
      timestamp: Date.now() - 240000,
      speaker: 'candidate',
      duration: 45,
      sentiment: 'positive',
      topics: ['background', 'experience']
    },
    {
      timestamp: Date.now() - 180000,
      speaker: 'ai',
      duration: 20,
      sentiment: 'neutral',
      topics: ['technical-questions', 'react']
    },
    {
      timestamp: Date.now() - 60000,
      speaker: 'candidate',
      duration: 120,
      sentiment: 'positive',
      topics: ['technical-solution', 'problem-solving']
    }
  ])

  // Update time elapsed
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate real-time analytics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        eyeContact: Math.max(0, Math.min(100, prev.eyeContact + (Math.random() - 0.5) * 5)),
        speechClarity: Math.max(0, Math.min(100, prev.speechClarity + (Math.random() - 0.5) * 3)),
        responseTime: Math.max(1, prev.responseTime + (Math.random() - 0.5) * 0.5),
        confidence: Math.max(0, Math.min(100, prev.confidence + (Math.random() - 0.5) * 4)),
        engagement: Math.max(0, Math.min(100, prev.engagement + (Math.random() - 0.5) * 3))
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-400/20'
    if (score >= 60) return 'from-yellow-500/20 to-yellow-400/20'
    return 'from-red-500/20 to-red-400/20'
  }

  const metrics: AnalyticsMetric[] = [
    {
      id: 'eye-contact',
      label: 'Eye Contact',
      value: analytics.eyeContact,
      unit: '%',
      trend: analytics.eyeContact > 80 ? 'up' : 'down',
      color: 'text-blue-400',
      icon: <Eye className="w-4 h-4" />
    },
    {
      id: 'speech-clarity',
      label: 'Speech Clarity',
      value: analytics.speechClarity,
      unit: '%',
      trend: 'up',
      color: 'text-green-400',
      icon: <Volume2 className="w-4 h-4" />
    },
    {
      id: 'response-time',
      label: 'Avg Response Time',
      value: analytics.responseTime,
      unit: 's',
      trend: analytics.responseTime < 4 ? 'up' : 'down',
      color: 'text-purple-400',
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 'confidence',
      label: 'Confidence Level',
      value: analytics.confidence,
      unit: '%',
      trend: analytics.confidence > 75 ? 'up' : 'down',
      color: 'text-orange-400',
      icon: <Target className="w-4 h-4" />
    }
  ]

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id} variant="glass" className="p-4">
            <CardContent className="p-0">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", `bg-gradient-to-br ${getScoreBackground(metric.value)}`)}>
                  {metric.icon}
                </div>
                <div className="flex items-center gap-1">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="w-3 h-3 text-red-400" />
                  ) : (
                    <div className="w-3 h-3" />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className={cn("text-2xl font-bold", getScoreColor(metric.value))}>
                  {metric.value.toFixed(metric.unit === 's' ? 1 : 0)}{metric.unit}
                </div>
                <div className="text-xs text-white/70">{metric.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Score */}
        <Card variant="glass" className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-gold-400" />
              Overall Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Score Visualization */}
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${analytics.engagement * 2.51} 251`}
                      className="text-electric-400 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={cn("text-2xl font-bold", getScoreColor(analytics.engagement))}>
                        {analytics.engagement.toFixed(0)}
                      </div>
                      <div className="text-xs text-white/70">Score</div>
                    </div>
                  </div>
                </div>
                <div className="text-white/70 text-sm">
                  Based on eye contact, speech clarity, and response quality
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="space-y-3">
                {[
                  { label: 'Technical Skills', score: 88, color: 'bg-electric-400' },
                  { label: 'Communication', score: 92, color: 'bg-emerald-400' },
                  { label: 'Problem Solving', score: 75, color: 'bg-gold-400' },
                  { label: 'Cultural Fit', score: 85, color: 'bg-purple-400' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-white/70">{item.label}</div>
                    <div className="flex-1 bg-white/10 rounded-full h-2">
                      <div 
                        className={cn("h-2 rounded-full transition-all duration-1000", item.color)}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm text-white text-right">{item.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation Timeline */}
        <Card variant="glass" className="p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {conversationFlow.map((flow, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                    flow.speaker === 'ai' 
                      ? "bg-electric-500/20 text-electric-400" 
                      : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {flow.speaker === 'ai' ? <Brain className="w-4 h-4" /> : 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-white capitalize">{flow.speaker}</span>
                      <span className="text-xs text-white/50">
                        {formatTime(Math.floor((Date.now() - flow.timestamp) / 1000))} ago
                      </span>
                      <div className="flex items-center gap-1">
                        {flow.sentiment === 'positive' && <Smile className="w-3 h-3 text-emerald-400" />}
                        {flow.sentiment === 'neutral' && <Meh className="w-3 h-3 text-yellow-400" />}
                        {flow.sentiment === 'negative' && <Frown className="w-3 h-3 text-red-400" />}
                      </div>
                    </div>
                    <div className="text-xs text-white/70">
                      Duration: {flow.duration}s
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {flow.topics.map((topic) => (
                        <span 
                          key={topic}
                          className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-white/70"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card variant="glass" className="p-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Detailed Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Speaking Time Distribution */}
            <div className="space-y-3">
              <h4 className="text-sm text-white/70">Speaking Time</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">You</span>
                  <span className="text-sm text-white">65%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white">AI Interviewer</span>
                  <span className="text-sm text-white">35%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-electric-400 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </div>

            {/* Response Quality */}
            <div className="space-y-3">
              <h4 className="text-sm text-white/70">Response Quality</h4>
              <div className="space-y-2">
                {[
                  { label: 'Relevance', score: 92 },
                  { label: 'Depth', score: 78 },
                  { label: 'Clarity', score: 95 },
                  { label: 'Examples', score: 85 }
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-sm text-white">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-white/10 rounded-full h-1">
                        <div 
                          className="bg-electric-400 h-1 rounded-full transition-all duration-1000"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-xs text-white/70 w-8">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="text-sm text-white/70">Recommendations</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Maintain good eye contact</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Reduce response time slightly</span>
                </div>
                <div className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-electric-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-white">Add more specific examples</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <div className="flex justify-end gap-3">
        <Button variant="glass" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share Report
        </Button>
        <Button variant="primary" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}

export default InterviewAnalyticsDashboard
