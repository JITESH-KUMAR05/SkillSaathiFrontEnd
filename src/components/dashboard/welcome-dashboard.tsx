'use client';

import { motion } from 'framer-motion';
import { 
  HeartIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  MicrophoneIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline';
import { useChatStore } from '@/store/chat-store';

export function WelcomeDashboard() {
  const { setCurrentAgent } = useChatStore();

  const features = [
    {
      icon: HeartIcon,
      title: 'Emotional Intelligence',
      description: 'AI-powered emotional support and mental wellness guidance',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      icon: DocumentTextIcon,
      title: 'Document Processing',
      description: 'Advanced OCR and document analysis for learning materials',
      color: 'text-teal-500',
      bgColor: 'bg-teal-50',
    },
    {
      icon: VideoCameraIcon,
      title: 'Video Interviews',
      description: 'AI-powered mock interviews with real-time feedback',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: MicrophoneIcon,
      title: 'Voice Synthesis',
      description: 'Natural Hindi & English voice responses with Murf AI',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  const agents = [
    {
      id: 'mitra',
      name: 'Mitra',
      displayName: 'मित्र (Friend)',
      description: 'Your caring companion for emotional support and mental wellness',
      icon: HeartIcon,
      color: 'from-red-400 to-pink-500',
      textColor: 'text-red-600',
      features: ['Emotional Support', 'Mood Tracking', 'Wellness Tips', 'Crisis Support'],
    },
    {
      id: 'guru',
      name: 'Guru',
      displayName: 'गुरु (Teacher)',
      description: 'Your learning mentor with document scanning and knowledge extraction',
      icon: AcademicCapIcon,
      color: 'from-teal-400 to-cyan-500',
      textColor: 'text-teal-600',
      features: ['Document Scanning', 'OCR Processing', 'Learning Plans', 'Knowledge Base'],
    },
    {
      id: 'parikshak',
      name: 'Parikshak',
      displayName: 'परीक्षक (Examiner)',
      description: 'Your interview coach with video interview capabilities',
      icon: BriefcaseIcon,
      color: 'from-blue-400 to-indigo-500',
      textColor: 'text-blue-600',
      features: ['Video Interviews', 'Resume Analysis', 'Mock Tests', 'Career Guidance'],
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to BuddyAgents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Your intelligent AI companions powered by Azure OpenAI and Murf AI. 
            Experience the future of personalized AI assistance with real-time streaming, 
            voice synthesis, and specialized capabilities for Indian users.
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Azure OpenAI Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Murf AI Voice</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Sub-2s Response</span>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Advanced AI Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Agent Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Choose Your AI Companion
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {agents.map((agent, index) => {
              const Icon = agent.icon;
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-2xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => setCurrentAgent(agent.id as any)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center mb-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${agent.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{agent.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{agent.displayName}</p>
                    <p className="text-gray-600">{agent.description}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-800 text-sm">Key Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {agent.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className={`w-full mt-6 py-3 px-4 bg-gradient-to-r ${agent.color} text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 group-hover:scale-105`}>
                    Start Conversation
                  </button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Powered by Enterprise-Grade Technology
          </h2>
          <div className="flex flex-wrap justify-center items-center space-x-8 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Azure OpenAI GPT-4o</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Next.js 15</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>Murf AI Voice</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>FastAPI Backend</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
