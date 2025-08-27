'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Mic, MicOff, Volume2, Settings, Bot, User, BookOpen, ClipboardCheck } from 'lucide-react'

interface Message {
  id: number
  type: 'user' | 'agent'
  content: string
  agent?: string
  timestamp: Date
}

interface Agent {
  id: string
  name: string
  description: string
  icon: any
  color: string
  expertise: string[]
}

const agents: Agent[] = [
  {
    id: 'mitra',
    name: 'Mitra',
    description: 'Your friendly companion for casual conversations',
    icon: User,
    color: 'from-blue-500 to-cyan-500',
    expertise: ['Casual Chat', 'Emotional Support', 'Daily Life']
  },
  {
    id: 'guru',
    name: 'Guru',
    description: 'Your learning guide and knowledge mentor',
    icon: BookOpen,
    color: 'from-purple-500 to-pink-500',
    expertise: ['Education', 'Skill Building', 'Career Guidance']
  },
  {
    id: 'parikshak',
    name: 'Parikshak',
    description: 'Your assessment and evaluation expert',
    icon: ClipboardCheck,
    color: 'from-green-500 to-emerald-500',
    expertise: ['Tests', 'Evaluations', 'Progress Tracking']
  }
]

const voiceOptions = [
  { id: 'en-IN-kavya', name: 'Kavya (Indian Female)', flag: '🇮🇳' },
  { id: 'en-IN-arvind', name: 'Arvind (Indian Male)', flag: '🇮🇳' },
  { id: 'en-US-sarah', name: 'Sarah (US Female)', flag: '🇺🇸' },
  { id: 'en-GB-james', name: 'James (British Male)', flag: '🇬🇧' }
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<string>('mitra')
  const [isRecording, setIsRecording] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('en-IN-kavya')
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const ws = new WebSocket('ws://localhost:8000/ws')
        
        ws.onopen = () => {
          console.log('🔗 WebSocket connected')
          setIsConnected(true)
          setMessages(prev => [...prev, {
            id: Date.now(),
            type: 'agent',
            content: '🎉 Connected to AI Multi-Agent Platform! Choose an agent and start chatting.',
            agent: 'system',
            timestamp: new Date()
          }])
        }

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data)
          console.log('📨 Received:', data)
          
          if (data.type === 'agent_response') {
            setMessages(prev => [...prev, {
              id: Date.now(),
              type: 'agent',
              content: data.message,
              agent: data.agent,
              timestamp: new Date()
            }])
          } else if (data.type === 'audio_url') {
            const audio = new Audio(data.url)
            audio.play()
          }
        }

        ws.onclose = () => {
          console.log('🔌 WebSocket disconnected')
          setIsConnected(false)
          setTimeout(connectWebSocket, 3000)
        }

        ws.onerror = (error) => {
          console.error('❌ WebSocket error:', error)
          setIsConnected(false)
        }

        setSocket(ws)
      } catch (error) {
        console.error('💥 Failed to connect:', error)
        setTimeout(connectWebSocket, 3000)
      }
    }

    connectWebSocket()
    return () => socket?.close()
  }, [])

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket || !isConnected) return

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    socket.send(JSON.stringify({
      type: 'user_message',
      message: inputMessage,
      agent: selectedAgent,
      voice: selectedVoice
    }))

    setInputMessage('')
  }

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-IN'

      recognition.onstart = () => {
        setIsRecording(true)
        console.log('🎤 Recording started')
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputMessage(transcript)
        console.log('🗣️ Transcribed:', transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('🚫 Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        console.log('🎤 Recording ended')
      }

      recognitionRef.current = recognition
      recognition.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const currentAgent = agents.find(agent => agent.id === selectedAgent)

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="glass-panel p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              BuddyAgents
            </h1>
            <p className="text-white/80 text-lg">AI Multi-Agent Companion Platform for India</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} ${isConnected ? 'animate-pulse' : ''}`}></div>
              <span className="text-sm text-white/60">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Choose Your Agent
            </h2>
            <div className="space-y-3">
              {agents.map((agent) => {
                const IconComponent = agent.icon
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 border ${
                      selectedAgent === agent.id
                        ? 'border-blue-400 bg-gradient-to-r ' + agent.color + ' shadow-lg scale-105'
                        : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${agent.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{agent.name}</h3>
                        <p className="text-sm text-white/70 mt-1">{agent.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {agent.expertise.slice(0, 2).map((skill) => (
                            <span key={skill} className="text-xs px-2 py-1 bg-white/20 rounded-full text-white/80">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Voice Settings */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Settings
            </h2>
            <select 
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full input-field"
            >
              {voiceOptions.map((voice) => (
                <option key={voice.id} value={voice.id} className="bg-gray-800 text-white">
                  {voice.flag} {voice.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="glass-panel h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {currentAgent && (
                    <>
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${currentAgent.color}`}>
                        <currentAgent.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{currentAgent.name}</h3>
                        <p className="text-white/70">{currentAgent.description}</p>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto scrollbar-hide space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`message-bubble ${message.type === 'user' ? 'user-message' : 'agent-message'}`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/20">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder={`Message ${currentAgent?.name}...`}
                    className="w-full input-field pr-12"
                  />
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-300 ${
                      isRecording 
                        ? 'bg-red-500 recording-pulse' 
                        : 'hover:bg-white/10'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="w-4 h-4 text-white" />
                    ) : (
                      <Mic className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !isConnected}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              
              {/* Voice Wave Animation */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="voice-wave"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
