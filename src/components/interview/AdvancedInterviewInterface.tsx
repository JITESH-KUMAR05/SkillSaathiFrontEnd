'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import VideoConferenceLayout from './VideoConferenceLayout'
import { VideoStream } from './VideoComponents'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Monitor, 
  MonitorOff, 
  Phone, 
  PhoneOff, 
  Settings, 
  Volume2, 
  VolumeX, 
  Camera, 
  ScreenShare,
  MessageSquare,
  FileText,
  Clock,
  User,
  Brain,
  Target,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Grid3X3,
  Square,
  MonitorSpeaker,
  SplitSquareHorizontal,
  Zap,
  Eye,
  Users,
  Share2
} from 'lucide-react'

interface InterviewSession {
  id: string
  interviewerName: string
  candidateName: string
  position: string
  duration: number
  status: 'waiting' | 'active' | 'completed'
  startTime: Date
  topics: string[]
  notes: string[]
}

interface InteractionTip {
  id: string
  category: 'voice' | 'video' | 'behavior' | 'technical'
  title: string
  description: string
  icon: React.ReactNode
}

const AdvancedInterviewInterface: React.FC = () => {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState<'session' | 'tips' | 'notes' | 'controls'>('session')
  const [layoutMode, setLayoutMode] = useState<'grid' | 'speaker' | 'presentation' | 'sidebar'>('sidebar')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)
  
  const [session] = useState<InterviewSession>({
    id: '1',
    interviewerName: 'AI Interview Agent',
    candidateName: 'John Doe',
    position: 'Senior Frontend Developer',
    duration: 0,
    status: 'active',
    startTime: new Date(),
    topics: ['React.js', 'TypeScript', 'System Design', 'Problem Solving'],
    notes: []
  })

  const interactionTips: InteractionTip[] = [
    {
      id: '1',
      category: 'voice',
      title: 'Clear Speech',
      description: 'Speak clearly and at a moderate pace. Pause between thoughts.',
      icon: <Mic className="w-4 h-4" />
    },
    {
      id: '2',
      category: 'video',
      title: 'Eye Contact',
      description: 'Look directly at the camera to maintain eye contact.',
      icon: <Camera className="w-4 h-4" />
    },
    {
      id: '3',
      category: 'behavior',
      title: 'Active Listening',
      description: 'Nod and respond appropriately to show engagement.',
      icon: <Brain className="w-4 h-4" />
    },
    {
      id: '4',
      category: 'technical',
      title: 'Screen Sharing',
      description: 'Use screen sharing for code examples and demonstrations.',
      icon: <ScreenShare className="w-4 h-4" />
    }
  ]

  const startCall = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
    setIsCallActive(true)
  } catch (error) {
    console.error('Error accessing media devices:', error)
    alert('Please allow camera and microphone access.')
  }
}

  const endCall = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCallActive(false)
    setIsScreenSharing(false)
  }

  const toggleMute = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const startScreenShare = async () => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
    if (screenRef.current) {
      screenRef.current.srcObject = screenStream
    }
    setIsScreenSharing(true)

    // Handle screen share ending
    screenStream.getVideoTracks()[0].onended = () => {
      setIsScreenSharing(false)
    }
  } catch (error) {
    console.error('Error starting screen share:', error)
    alert('Please allow screen-sharing permissions.')
  }
}

  const stopScreenShare = () => {
    const stream = screenRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsScreenSharing(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        // Update session duration
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  return (
    <div className="flex h-screen bg-gradient-primary overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 glass-medium backdrop-blur-20 border-r border-white/10",
        sidebarCollapsed ? "w-16" : "w-80"
      )}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h2 className="font-display text-lg font-semibold gradient-text">
                Interview Studio
              </h2>
            )}
            <Button
              variant="glass"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {!sidebarCollapsed && (
          <>
            {/* Sidebar Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { key: 'session', label: 'Session', icon: Clock },
                { key: 'tips', label: 'Tips', icon: Lightbulb },
                { key: 'notes', label: 'Notes', icon: FileText },
                { key: 'controls', label: 'Voice', icon: Settings }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={cn(
                    "flex-1 p-3 text-sm font-medium transition-all duration-200",
                    activeTab === key
                      ? "text-electric-400 border-b-2 border-electric-400 bg-white/5"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4 mx-auto mb-1" />
                  <div className="text-xs">{label}</div>
                </button>
              ))}
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'session' && (
                <div className="space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-electric-400">Current Session</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-white/60" />
                        <div>
                          <div className="text-sm text-white">{session.candidateName}</div>
                          <div className="text-xs text-white/60">{session.position}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-white/60" />
                        <div className="text-sm text-white">
                          {isCallActive ? formatDuration(session.duration) : 'Not started'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-white/60" />
                        <div className="text-sm text-white">
                          {session.status === 'active' ? 'In Progress' : 'Waiting'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-emerald-400">Interview Topics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {session.topics.map((topic, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span className="text-sm text-white/80">{topic}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'tips' && (
                <div className="space-y-3">
                  {interactionTips.map((tip) => (
                    <Card key={tip.id} variant="glass" className="p-3">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          tip.category === 'voice' && "bg-coral-500/20 text-coral-400",
                          tip.category === 'video' && "bg-electric-500/20 text-electric-400",
                          tip.category === 'behavior' && "bg-emerald-500/20 text-emerald-400",
                          tip.category === 'technical' && "bg-gold-500/20 text-gold-400"
                        )}>
                          {tip.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{tip.title}</h4>
                          <p className="text-xs text-white/70 mt-1">{tip.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-gold-400">Quick Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-white/50 resize-none focus:outline-none focus:border-electric-400"
                        placeholder="Add interview notes..."
                      />
                      <Button variant="primary" size="sm" className="mt-2 w-full">
                        Save Notes
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'controls' && (
                <div className="space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-electric-400">Voice Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Microphone</span>
                        <Button
                          variant={isMuted ? "secondary" : "primary"}
                          size="sm"
                          onClick={toggleMute}
                          className="p-2"
                        >
                          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Speaker</span>
                        <Button
                          variant={isSpeakerOn ? "primary" : "secondary"}
                          size="sm"
                          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                          className="p-2"
                        >
                          {isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white">Voice Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          className="w-full accent-electric-500"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-emerald-400">AI Voice Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm text-white">Voice Style</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-sm text-white">
                          <option value="professional">Professional</option>
                          <option value="friendly">Friendly</option>
                          <option value="casual">Casual</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white">Speech Speed</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          className="w-full accent-emerald-500"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Interview Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="glass-light backdrop-blur-20 border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  isCallActive ? "bg-emerald-400 animate-pulse" : "bg-gray-500"
                )} />
                <span className="font-medium text-white">
                  {isCallActive ? 'Interview Active' : 'Ready to Start'}
                </span>
              </div>
              {isCallActive && (
                <div className="text-sm text-white/70">
                  Duration: {formatDuration(session.duration)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="glass" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Video Area */}
        <div className="flex-1">
          <VideoConferenceLayout
            participants={[
              {
                id: 'candidate',
                name: 'You',
                isLocal: true,
                isMuted: isMuted,
                isVideoEnabled: isVideoEnabled,
                connectionQuality: 'excellent',
                streamType: 'camera'
              },
              {
                id: 'ai-interviewer',
                name: 'AI Interviewer',
                isAI: true,
                isMuted: false,
                isVideoEnabled: true,
                connectionQuality: 'excellent',
                streamType: 'ai'
              }
            ]}
            currentUser="candidate"
            layoutMode={layoutMode}
            onLayoutChange={(mode) => setLayoutMode(mode as any)}
          />
        </div>

        {/* Control Bar */}
        <div className="glass-medium backdrop-blur-20 border-t border-white/10 p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isMuted ? "secondary" : "glass"}
              size="lg"
              onClick={toggleMute}
              className="p-4"
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </Button>

            <Button
              variant={isVideoEnabled ? "glass" : "secondary"}
              size="lg"
              onClick={toggleVideo}
              className="p-4"
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>

            <Button
              variant={isScreenSharing ? "primary" : "glass"}
              size="lg"
              onClick={isScreenSharing ? stopScreenShare : startScreenShare}
              className="p-4"
            >
              {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
            </Button>

            {!isCallActive ? (
              <Button
                variant="primary"
                size="lg"
                onClick={startCall}
                className="px-8 py-4"
              >
                <Phone className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="lg"
                onClick={endCall}
                className="px-8 py-4 bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                End Interview
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedInterviewInterface
