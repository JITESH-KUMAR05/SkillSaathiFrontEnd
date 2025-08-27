'use client'

import { useRouter } from 'next/navigation'
import { Bot, User, BookOpen, ClipboardCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'

const AGENTS = [
  {
    id: 'mitra',
    name: 'Mitra',
    tagline: 'Friendly emotional companion',
    gradient: 'from-blue-500 via-cyan-500 to-sky-400',
    blurb: 'Casual talk, emotional support, cultural context.',
    highlights: ['Empathy first', 'Daily reflections', 'Mood aware']
  },
  {
    id: 'guru',
    name: 'Guru',
    tagline: 'Learning mentor & guide',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    blurb: 'Structured learning, clear explanations, skill growth.',
    highlights: ['Step-by-step', 'Adaptive depth', 'Career help']
  },
  {
    id: 'parikshak',
    name: 'Parikshak',
    tagline: 'Smart evaluator & coach',
    gradient: 'from-emerald-500 via-green-500 to-teal-400',
    blurb: 'Quizzes, performance feedback, practice drills.',
    highlights: ['Adaptive quizzes', 'Progress metrics', 'Actionable feedback']
  }
]

export default function Landing() {
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="min-h-screen px-5 py-10 md:py-16">
      <div className="max-w-7xl mx-auto">
        <header className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> Multi‑Agent AI Platform for India
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Choose Your AI Companion
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Personalized agents crafted for conversation, learning, and evaluation. Voice-ready, culturally aware, real‑time.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-3">
          {AGENTS.map(agent => (
            <button
              key={agent.id}
              onClick={() => router.push(`/agents/${agent.id}`)}
              onMouseEnter={() => setHovered(agent.id)}
              onMouseLeave={() => setHovered(null)}
              className={`group relative rounded-3xl overflow-hidden p-[1px] transition-transform duration-300 ${hovered === agent.id ? 'scale-[1.03]' : 'scale-100'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${agent.gradient} opacity-70 group-hover:opacity-100 blur-xl transition`}></div>
              <div className="relative h-full w-full rounded-3xl bg-gray-900/80 backdrop-blur-xl border border-white/10 flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  <div className={`inline-flex mb-5 items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${agent.gradient} text-white shadow`}> 
                    <Bot className="w-3.5 h-3.5" /> {agent.name}
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-1 tracking-tight">{agent.tagline}</h2>
                  <p className="text-sm text-white/60 leading-relaxed flex-1">{agent.blurb}</p>
                  <ul className="mt-5 space-y-2">
                    {agent.highlights.map(h => (
                      <li key={h} className="flex items-start gap-2 text-white/70 text-xs">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/40" /> {h}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-6 pt-4">
                  <div className="w-full rounded-xl bg-white/5 border border-white/10 group-hover:border-white/20 text-white/80 text-sm py-3 text-center font-medium tracking-wide transition-colors">
                    Enter {agent.name}'s Space →
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        <section className="mt-20 grid gap-10 md:grid-cols-3">
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Real‑time Voice</h3>
            <p className="text-sm text-white/60 leading-relaxed">Low-latency pipeline ready for Murf AI streaming integration with natural Indian voices.</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Context Memory</h3>
            <p className="text-sm text-white/60 leading-relaxed">Session-aware responses leveraging agent personas and expandable RAG layers.</p>
          </div>
          <div className="glass-panel rounded-2xl p-6 border border-white/10">
            <h3 className="text-white font-semibold mb-2">Focused Spaces</h3>
            <p className="text-sm text-white/60 leading-relaxed">Each agent has a dedicated workspace tuned for its core objective & interaction style.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
