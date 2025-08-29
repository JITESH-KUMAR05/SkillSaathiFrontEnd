'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAgentChat } from '@/lib/useAgentChat'
import { Mic, MicOff, ArrowLeft, Send, Loader2, Video, Monitor, Users, Calendar, MessageSquare } from 'lucide-react'
import ChatGPTStyleVideoInterview from '@/components/interview/ChatGPTStyleVideoInterview'

const AGENT_META: Record<string, { 
  title: string; 
  subtitle: string; 
  gradient: string; 
  accentColor: string;
  bgColor: string;
  description: string; 
  personaTips: string[] 
}> = {
  mitra: {
    title: 'Mitra',
    subtitle: 'Your Empathetic Companion',
    gradient: 'from-pink-50 via-rose-50 to-pink-100',
    accentColor: 'text-pink-600',
    bgColor: 'bg-gradient-to-br from-pink-50/80 to-rose-100/60',
    description: 'Gentle conversations with cultural sensitivity and emotional intelligence for daily support.',
    personaTips: ['Ask about your day', 'Share how you feel', 'Discuss culture & festivals']
  },
  guru: {
    title: 'Guru',
    subtitle: 'Your Learning Mentor',
    gradient: 'from-purple-50 via-violet-50 to-purple-100',
    accentColor: 'text-purple-600',
    bgColor: 'bg-gradient-to-br from-purple-50/80 to-violet-100/60',
    description: 'Structured learning paths with adaptive explanations tailored to your pace and goals.',
    personaTips: ['Request step-by-step explanations', 'Ask for study plans', 'Practice concepts']
  },
  parikshak: {
    title: 'Parikshak',
    subtitle: 'Your Performance Coach',
    gradient: 'from-green-50 via-emerald-50 to-green-100',
    accentColor: 'text-green-600',
    bgColor: 'bg-gradient-to-br from-green-50/80 to-emerald-100/60',
    description: 'Smart evaluations with detailed feedback and performance analytics for continuous improvement.',
    personaTips: ['Say "start interview"', 'Ask for behavioral questions', 'Request technical assessments', 'Practice video interviews']
  }
}

export default function AgentPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const router = useRouter()
  const meta = AGENT_META[agentId] || AGENT_META['mitra']

  const [voice, setVoice] = useState('en-IN-kavya')
  const [interviewMode, setInterviewMode] = useState(false)
  const { messages, send, connected, loading, error, connect } = useAgentChat({ agentId, voice })
  const [input, setInput] = useState('')
  const [recording, setRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Handle reconnection logic
  useEffect(() => {
    if (!connected && !loading && error) {
      console.warn('WebSocket disconnected. Will retry in 5 seconds...');
      const retryTimeout = setTimeout(() => {
        connect();
      }, 5000);
      return () => clearTimeout(retryTimeout);
    }
  }, [connected, loading, error, connect])

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.lang = 'en-IN'
      recognition.onstart = () => setRecording(true)
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript
        setInput(transcript)
      }
      recognition.onerror = () => setRecording(false)
      recognition.onend = () => setRecording(false)
      recognitionRef.current = recognition
      recognition.start()
    }
  }
  const stopRecording = () => { recognitionRef.current?.stop(); setRecording(false) }

  const handleSend = () => {
    if (!input.trim()) return
    send(input)
    setInput('')
  }

  // If in interview mode and this is Parikshak, show the video interview interface
  if (interviewMode && agentId === 'parikshak') {
    return <ChatGPTStyleVideoInterview onExit={() => setInterviewMode(false)} />
  }

  useEffect(() => {
    if (!connected && !loading) {
      console.warn('WebSocket disconnected. Retrying connection...')
      const retryTimeout = setTimeout(() => {
        connect()
      }, 5000)
      return () => clearTimeout(retryTimeout)
    }
  }, [connected, loading, connect])

  return (
    <div className="min-h-screen px-6 py-8 md:p-12 bg-gradient-to-br from-white via-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 animate-slide-up">
          <button 
            onClick={() => router.push('/')} 
            className="rounded-2xl px-6 py-3 bg-white/80 backdrop-blur-md hover:bg-white/90 text-slate-700 hover:text-slate-900 transition-all duration-200 shadow-soft hover:shadow-medium border border-white/40 fast-hover"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" /> Back to Home
          </button>
          
          {/* Agent Header Card */}
          <div className={`flex-1 p-6 rounded-3xl bg-gradient-to-r ${meta.gradient} border border-white/30 shadow-premium`}> 
            <div className="bg-white/90 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/40">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${meta.bgColor} border border-white/50`}>
                  <div className={`w-6 h-6 ${meta.accentColor}`}>●</div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{meta.title}</h1>
                  <p className={`text-sm font-medium ${meta.accentColor} opacity-80`}>{meta.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connection & Actions */}
          <div className="flex items-center gap-4">
            {agentId === 'parikshak' && (
              <button
                onClick={() => setInterviewMode(!interviewMode)}
                className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 border shadow-soft hover:shadow-medium ${
                  interviewMode 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-400' 
                    : 'bg-white/80 hover:bg-white/90 text-slate-700 border-white/40'
                }`}
              >
                <Video className="w-5 h-5" />
                {interviewMode ? 'Exit Interview' : 'Start Video Interview'}
              </button>
            )}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/70 rounded-2xl border border-white/40 shadow-soft">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-soft-pulse' : 'bg-red-500'}`}></div>
              <span className="text-slate-600 font-medium text-sm">{connected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="grid lg:grid-cols-3 gap-8 min-h-[70vh]">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-premium h-[560px] flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className={`p-6 bg-gradient-to-r ${meta.gradient} border-b border-white/20`}>
                <div className="bg-white/90 backdrop-blur-md rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${meta.bgColor}`}>
                      <MessageSquare className={`w-5 h-5 ${meta.accentColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800">Chat with {meta.title}</h3>
                      <p className={`text-sm ${meta.accentColor} opacity-80`}>{meta.description}</p>
                    </div>
                    {loading && <Loader2 className={`w-5 h-5 animate-spin ${meta.accentColor}`} />}
                    {error && <span className="text-red-500 text-xs">{error}</span>}
                  </div>
                </div>
              </div>
              
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-white/50 to-slate-50/80 scrollbar-thin">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft border ${
                      m.role === 'user' 
                        ? `bg-gradient-to-r ${meta.gradient} text-white border-white/30` 
                        : m.role === 'system' 
                          ? 'bg-slate-100/80 text-slate-600 border-white/50' 
                          : 'bg-white/90 text-slate-700 border-white/50'
                    }`}>
                      {m.role !== 'user' && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${meta.accentColor} bg-opacity-60`}></div>
                          <span className={`text-xs font-semibold ${meta.accentColor}`}>{meta.title}</span>
                        </div>
                      )}
                      {m.content}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              
              {/* Input Area */}
              <div className="p-6 border-t border-white/20 bg-white/60 backdrop-blur-md">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder={`Message ${meta.title}...`}
                      className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/90 border border-white/50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-slate-300 transition-all shadow-soft"
                    />
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`absolute top-1/2 -translate-y-1/2 right-3 p-2 rounded-xl transition-all ${
                        recording 
                          ? 'bg-red-500 text-white animate-soft-pulse' 
                          : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || !connected}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all shadow-soft hover:shadow-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-r ${meta.gradient} text-white border border-white/30`}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Sidebar */}
          <aside className="space-y-6">
            {/* Interaction Tips */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${meta.bgColor}`}>
                  <div className={`w-4 h-4 ${meta.accentColor}`}>💡</div>
                </div>
                <h2 className="text-slate-800 font-bold text-lg">Interaction Tips</h2>
              </div>
              <ul className="space-y-3">
                {meta.personaTips.map(tip => (
                  <li key={tip} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className={`w-1.5 h-1.5 rounded-full ${meta.accentColor} bg-opacity-60 mt-2 flex-shrink-0`}></div>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Voice Settings */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${meta.bgColor}`}>
                  <div className={`w-4 h-4 ${meta.accentColor}`}>🔊</div>
                </div>
                <h2 className="text-slate-800 font-bold text-lg">Voice</h2>
              </div>
              <select 
                value={voice} 
                onChange={e => setVoice(e.target.value)} 
                className="w-full px-4 py-3 rounded-2xl bg-white/90 border border-white/50 text-slate-700 focus:outline-none focus:border-slate-300 transition-all shadow-soft"
              >
                <option value="en-IN-kavya">🇮🇳 Kavya (Female)</option>
                <option value="en-IN-arvind">🇮🇳 Arvind (Male)</option>
                <option value="en-US-sarah">🇺🇸 Sarah (US)</option>
                <option value="en-GB-james">🇬🇧 James (UK)</option>
              </select>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                Voice changes apply to new responses. For production integrate low-latency streaming.
              </p>
            </div>

            {/* Session Controls */}
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 shadow-premium p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${meta.bgColor}`}>
                  <div className={`w-4 h-4 ${meta.accentColor}`}>⚙️</div>
                </div>
                <h2 className="text-slate-800 font-bold text-lg">Session</h2>
              </div>
              {agentId === 'parikshak' && (
                <div className="space-y-3 mb-4">
                  <button 
                    onClick={() => setInterviewMode(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-2xl shadow-soft hover:shadow-medium transition-all flex items-center justify-center gap-3"
                  >
                    <Video className="w-4 h-4" />
                    Launch Video Interview
                  </button>
                  <button 
                    onClick={() => send('Start a technical interview session')}
                    className="w-full px-4 py-3 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-800 font-semibold rounded-2xl border border-white/50 shadow-soft hover:shadow-medium transition-all flex items-center justify-center gap-3"
                  >
                    <Monitor className="w-4 h-4" />
                    Technical Interview
                  </button>
                  <button 
                    onClick={() => send('Start a behavioral interview session')}
                    className="w-full px-4 py-3 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-800 font-semibold rounded-2xl border border-white/50 shadow-soft hover:shadow-medium transition-all flex items-center justify-center gap-3"
                  >
                    <Users className="w-4 h-4" />
                    Behavioral Interview
                  </button>
                </div>
              )}
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.reload()} 
                  className="w-full px-4 py-3 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-800 font-semibold rounded-2xl border border-white/50 shadow-soft hover:shadow-medium transition-all"
                >
                  Reset Conversation
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(messages.filter(m=>m.role!=='system').map(m=>`${m.role}: ${m.content}`).join('\n'))} 
                  className="w-full px-4 py-3 bg-white/90 hover:bg-white text-slate-700 hover:text-slate-800 font-semibold rounded-2xl border border-white/50 shadow-soft hover:shadow-medium transition-all"
                >
                  Copy Transcript
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
