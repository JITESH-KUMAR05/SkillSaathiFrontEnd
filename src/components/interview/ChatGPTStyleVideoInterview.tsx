'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MonitorOff, 
  MessageSquare, 
  Settings, 
  Users, 
  Clock, 
  FileText, 
  Volume2, 
  VolumeX, 
  Camera, 
  CameraOff,
  Share2,
  Grid3X3,
  Square,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Brain,
  Zap,
  Eye,
  Target,
  Lightbulb,
  User,
  Send,
  RotateCcw,
  Download,
  Upload
} from 'lucide-react'

// Chat Message Interface
interface ChatMessage {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp: Date
}

// Session Interface
interface InterviewSession {
  id: string
  duration: number
  status: 'waiting' | 'active' | 'completed'
  startTime: Date
  participantCount: number
}

const ChatGPTStyleVideoInterview: React.FC<{ onExit?: () => void }> = ({ onExit }) => {
  // Main state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState<'chat' | 'session' | 'tips' | 'notes'>('chat')
  
  // Video/Audio state
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'system',
      content: 'Welcome to your AI interview session. I\'m here to help you succeed!',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  
  // Session state
  const [session] = useState<InterviewSession>({
    id: '1',
    duration: 0,
    status: 'active',
    startTime: new Date(),
    participantCount: 2
  })
  
  // Video refs
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const aiVideoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)

  // Start video call
  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream
      }
      setIsCallActive(true)
    } catch (error) {
      console.error('Error accessing media devices:', error)
      alert('Please allow camera and microphone access.')
    }
  }

  // End video call
  const endCall = () => {
    const stream = userVideoRef.current?.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCallActive(false)
    setIsScreenSharing(false)
  }

  // Toggle video
  const toggleVideo = () => {
    const stream = userVideoRef.current?.srcObject as MediaStream
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOn(videoTrack.enabled)
      }
    }
  }

  // Toggle mute
  const toggleMute = () => {
    const stream = userVideoRef.current?.srcObject as MediaStream
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
      }
    }
  }

  // Start screen sharing
  const startScreenShare = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      if (screenShareRef.current) {
        screenShareRef.current.srcObject = screenStream
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

  // Send message
  const sendMessage = () => {
    if (!inputMessage.trim()) return
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, newMessage])
    setInputMessage('')
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Thank you for your response. Can you elaborate on that point?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  // Auto-start call when component mounts
  useEffect(() => {
    startCall()
  }, [])

  const sidebarWidth = sidebarOpen ? 'w-80' : 'w-16'
  const mainWidth = sidebarOpen ? 'calc(100% - 20rem)' : 'calc(100% - 4rem)'

  return (
    <div className="flex h-screen bg-gradient-primary overflow-hidden">
      
      {/* Sidebar - ChatGPT Style */}
      <div className={cn(
        "transition-all duration-300 bg-dark-900/95 backdrop-blur-20 border-r border-white/10 flex flex-col",
        sidebarWidth
      )}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-semibold gradient-text">
                Interview Studio
              </h2>
              {onExit && (
                <Button
                  variant="glass"
                  size="sm"
                  onClick={onExit}
                  className="p-2"
                  title="Exit Interview"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          <Button
            variant="glass"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        {sidebarOpen && (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-white/10">
              {[
                { key: 'chat', label: 'Chat', icon: MessageSquare },
                { key: 'session', label: 'Session', icon: Clock },
                { key: 'tips', label: 'Tips', icon: Lightbulb },
                { key: 'notes', label: 'Notes', icon: FileText }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={cn(
                    "flex-1 p-3 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                    activeTab === key
                      ? "bg-electric-500/20 text-electric-400 border-b-2 border-electric-400"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              
              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] p-3 rounded-lg text-sm",
                            message.role === 'user'
                              ? "bg-electric-500/20 text-white ml-4"
                              : message.role === 'ai'
                              ? "bg-white/10 text-white mr-4"
                              : "bg-yellow-500/20 text-yellow-300 mx-auto text-center"
                          )}
                        >
                          {message.role === 'ai' && (
                            <div className="flex items-center gap-2 mb-1">
                              <Brain className="w-3 h-3 text-electric-400" />
                              <span className="text-xs text-electric-400">AI Interviewer</span>
                            </div>
                          )}
                          <p>{message.content}</p>
                          <div className="text-xs text-white/50 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-white/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-electric-400"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={sendMessage}
                        className="p-2"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Session Tab */}
              {activeTab === 'session' && (
                <div className="p-4 space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Session Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Status:</span>
                        <span className="text-sm text-emerald-400">Live</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Duration:</span>
                        <span className="text-sm text-white">00:15:32</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-white/70">Participants:</span>
                        <span className="text-sm text-white">2</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tips Tab */}
              {activeTab === 'tips' && (
                <div className="p-4 space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-emerald-400">Interview Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-white/80">
                        <li className="flex items-start gap-2">
                          <Eye className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          Maintain eye contact with the camera
                        </li>
                        <li className="flex items-start gap-2">
                          <Mic className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          Speak clearly and at moderate pace
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          Use specific examples in answers
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                          Show enthusiasm and confidence
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notes Tab */}
              {activeTab === 'notes' && (
                <div className="p-4 space-y-4">
                  <Card variant="glass" className="p-4">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white">Interview Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <textarea
                        placeholder="Take notes during the interview..."
                        className="w-full h-40 bg-white/10 border border-white/20 rounded-lg p-3 text-sm text-white placeholder-white/50 focus:outline-none focus:border-electric-400 resize-none"
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Main Content Area - 70-80% width */}
      <div 
        className="flex-1 flex flex-col"
        style={{ width: mainWidth }}
      >
        
        {/* Video Area */}
        <div className="flex-1 p-6">
          {isScreenSharing ? (
            /* Screen Share Layout */
            <div className="h-full grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Screen Share */}
              <div className="lg:col-span-3 bg-dark-800 rounded-2xl overflow-hidden">
                <video
                  ref={screenShareRef}
                  autoPlay
                  className="w-full h-full object-contain"
                />
              </div>
              
              {/* Video Thumbnails */}
              <div className="lg:col-span-1 space-y-4">
                {/* User Video */}
                <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden relative">
                  <video
                    ref={userVideoRef}
                    autoPlay
                    muted
                    className={cn(
                      "w-full h-full object-cover",
                      !isVideoOn && "hidden"
                    )}
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
                      <CameraOff className="w-8 h-8 text-white/50" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">
                    You
                  </div>
                </div>

                {/* AI Video */}
                <div className="aspect-video bg-gradient-interview rounded-xl overflow-hidden relative">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Brain className="w-12 h-12 text-white/80 mx-auto mb-2 animate-pulse" />
                      <div className="text-white text-sm">AI Interviewer</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Normal Video Layout */
            <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Video */}
              <div className="bg-dark-800 rounded-2xl overflow-hidden relative group">
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  className={cn(
                    "w-full h-full object-cover",
                    !isVideoOn && "hidden"
                  )}
                />
                {!isVideoOn && (
                  <div className="absolute inset-0 bg-dark-700 flex items-center justify-center">
                    <div className="text-center">
                      <CameraOff className="w-16 h-16 text-white/50 mb-4" />
                      <p className="text-white/70">Video is off</p>
                    </div>
                  </div>
                )}
                
                {/* Video Controls Overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                    <span className="text-white text-sm font-medium">You</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="glass"
                      size="sm"
                      onClick={toggleVideo}
                      className="p-2"
                    >
                      {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="glass"
                      size="sm"
                      className="p-2"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* AI Video */}
              <div className="bg-gradient-interview rounded-2xl overflow-hidden relative group">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 animate-pulse-glow">
                      <Brain className="w-12 h-12 text-white/80" />
                    </div>
                    <div className="text-white text-lg font-medium mb-2">AI Interviewer</div>
                    <div className="text-white/70 text-sm">Processing your response...</div>
                  </div>
                </div>
                
                {/* AI Activity Indicators */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping" />
                  <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping animation-delay-200" />
                  <div className="w-2 h-2 bg-electric-400 rounded-full animate-ping animation-delay-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="p-4 bg-dark-900/95 backdrop-blur-20 border-t border-white/10">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            
            {/* Primary Controls */}
            <div className="flex items-center gap-3">
              <Button
                variant={isMuted ? "secondary" : "glass"}
                size="lg"
                onClick={toggleMute}
                className="p-4"
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              
              <Button
                variant={isVideoOn ? "glass" : "secondary"}
                size="lg"
                onClick={toggleVideo}
                className="p-4"
              >
                {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </Button>
              
              <Button
                variant={isScreenSharing ? "primary" : "glass"}
                size="lg"
                onClick={isScreenSharing ? () => setIsScreenSharing(false) : startScreenShare}
                className="p-4"
                title={isScreenSharing ? "Stop Screen Share" : "Share Screen"}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
              </Button>
            </div>

            {/* Session Info */}
            <div className="hidden md:flex items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                <span>Recording</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>00:15:32</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>2 participants</span>
              </div>
            </div>

            {/* End Call */}
            <Button
              variant="secondary"
              size="lg"
              onClick={endCall}
              className="p-4 bg-red-600 hover:bg-red-700"
            >
              <PhoneOff className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatGPTStyleVideoInterview
