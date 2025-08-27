'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAgentChat } from '@/lib/useAgentChat'
import { Mic, MicOff, ArrowLeft, Send, Loader2, Video, Monitor, Users, Calendar } from 'lucide-react'
import ChatGPTStyleVideoInterview from '@/components/interview/ChatGPTStyleVideoInterview'

const AGENT_META: Record<string, { title: string; subtitle: string; gradient: string; description: string; personaTips: string[] }> = {
  mitra: {
    title: 'Mitra',
    subtitle: 'Your Friendly Companion',
    gradient: 'from-blue-500 via-cyan-500 to-sky-400',
    description: 'Casual empathetic conversations, mood support, daily reflections.',
    personaTips: ['Ask about your day', 'Share how you feel', 'Discuss culture & festivals']
  },
  guru: {
    title: 'Guru',
    subtitle: 'Your Learning Mentor',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    description: 'Guided explanations, structured learning paths, skill development.',
    personaTips: ['Request step-by-step explanations', 'Ask for study plans', 'Practice concepts']
  },
  parikshak: {
    title: 'Parikshak',
    subtitle: 'Your Smart Evaluator & Interview Coach',
    gradient: 'from-emerald-500 via-green-500 to-teal-400',
    description: 'Mock interviews, assessments, performance feedback, and real-time practice.',
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
    <div className="min-h-screen px-4 py-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/')} className="rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition">
            <ArrowLeft className="w-4 h-4 inline mr-1" /> Back
          </button>
          <div className={`p-1 rounded-xl bg-gradient-to-r ${meta.gradient} shadow-lg`}> 
            <div className="bg-gray-900/80 backdrop-blur-md rounded-lg px-5 py-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">{meta.title}</h1>
              <p className="text-sm text-white/60 -mt-1">{meta.subtitle}</p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            {agentId === 'parikshak' && (
              <button
                onClick={() => setInterviewMode(!interviewMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  interviewMode 
                    ? 'bg-emerald-500 text-white shadow-lg' 
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Video className="w-4 h-4" />
                {interviewMode ? 'Exit Interview' : 'Start Video Interview'}
              </button>
            )}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></div>
              <span className="text-white/60">{connected ? 'Connected' : 'Offline'}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel rounded-2xl border border-white/10 h-[560px] flex flex-col overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center gap-3">
                <div className="text-white/80 text-sm">{meta.description}</div>
                {loading && <Loader2 className="w-4 h-4 animate-spin text-white/60 ml-auto" />}
                {error && <span className="text-red-400 text-xs ml-auto">{error}</span>}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map(m => (
                  <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : m.role === 'system' ? 'bg-white/5 text-white/70 border border-white/10' : 'bg-white/10 backdrop-blur-md text-white border border-white/10'}`}>{m.content}</div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
              <div className="p-4 border-t border-white/10">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="Type your message..."
                      className="w-full input-field pr-11"
                    />
                    <button
                      onClick={recording ? stopRecording : startRecording}
                      className={`absolute top-1/2 -translate-y-1/2 right-2 p-2 rounded-lg transition ${recording ? 'bg-red-500 recording-pulse' : 'hover:bg-white/10'}`}
                    >
                      {recording ? <MicOff className="w-4 h-4 text-white" /> : <Mic className="w-4 h-4 text-white/70" />}
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || !connected}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <aside className="space-y-5">
            <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
              <h2 className="text-white font-semibold text-lg">Interaction Tips</h2>
              <ul className="space-y-2 text-sm text-white/70 list-disc pl-5">
                {meta.personaTips.map(t => <li key={t}>{t}</li>)}
              </ul>
            </div>
            <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-4">
              <h2 className="text-white font-semibold text-lg">Voice</h2>
              <select value={voice} onChange={e => setVoice(e.target.value)} className="w-full input-field">
                <option value="en-IN-kavya">🇮🇳 Kavya (Female)</option>
                <option value="en-IN-arvind">🇮🇳 Arvind (Male)</option>
                <option value="en-US-sarah">🇺🇸 Sarah (US)</option>
                <option value="en-GB-james">🇬🇧 James (UK)</option>
              </select>
              <div className="text-xs text-white/50 leading-relaxed">
                Voice changes apply to new responses. For production integrate low-latency streaming.
              </div>
            </div>
            <div className="glass-panel rounded-2xl border border-white/10 p-5 space-y-3">
              <h2 className="text-white font-semibold text-lg">Session</h2>
              {agentId === 'parikshak' && (
                <div className="space-y-2 mb-4">
                  <button 
                    onClick={() => setInterviewMode(true)}
                    className="w-full btn-primary py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Launch Video Interview
                  </button>
                  <button 
                    onClick={() => send('Start a technical interview session')}
                    className="w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Monitor className="w-4 h-4" />
                    Technical Interview
                  </button>
                  <button 
                    onClick={() => send('Start a behavioral interview session')}
                    className="w-full btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Behavioral Interview
                  </button>
                </div>
              )}
              <button onClick={() => window.location.reload()} className="w-full btn-secondary py-2 text-sm">Reset Conversation</button>
              <button onClick={() => navigator.clipboard.writeText(messages.filter(m=>m.role!=='system').map(m=>`${m.role}: ${m.content}`).join('\n'))} className="w-full btn-secondary py-2 text-sm">Copy Transcript</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
