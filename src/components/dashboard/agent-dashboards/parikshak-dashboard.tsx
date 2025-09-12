'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BriefcaseIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  PlayIcon,
  StopIcon
} from '@heroicons/react/24/outline';
import { EnhancedChatInterface } from '../../chat/enhanced-chat-interface';
import { VideoInterview } from '../../features/video-interview';
import { MockTests } from '../../features/mock-tests';
import { ResumeAnalyzer } from '../../features/resume-analyzer';

export function ParikshakDashboard() {
  const [activeFeature, setActiveFeature] = useState<'chat' | 'interview' | 'resume' | 'tests'>('chat');

  const features = [
    {
      id: 'chat',
      name: 'Career Guidance',
      icon: ChatBubbleLeftRightIcon,
      description: 'Get personalized career advice',
    },
    {
      id: 'interview',
      name: 'Video Interview',
      icon: VideoCameraIcon,
      description: 'Practice with AI-powered interviews',
    },
    {
      id: 'resume',
      name: 'Resume Analysis',
      icon: DocumentTextIcon,
      description: 'Optimize your resume for success',
    },
    {
      id: 'tests',
      name: 'Mock Tests',
      icon: ClipboardDocumentCheckIcon,
      description: 'Practice aptitude and skill tests',
    },
  ];

  return (
    <div className="h-full flex">
      {/* Feature Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
              <BriefcaseIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Parikshak</h1>
              <p className="text-sm text-gray-600">परीक्षक - Your Interview Coach</p>
            </div>
          </div>
        </div>

        {/* Features Menu */}
        <div className="p-4 space-y-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeFeature === feature.id;
            
            return (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                    : 'border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-gray-600">{feature.description}</div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Interview */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <VideoCameraIcon className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-700">Start Interview</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <DocumentTextIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Upload Resume</span>
            </button>
          </div>
        </div>

        {/* Interview Stats */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Interview Progress</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Interviews Completed</span>
              <span className="text-sm font-medium text-blue-600">7</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Score</span>
              <span className="text-sm font-medium text-green-600">8.2/10</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Practice Streak</span>
              <span className="text-sm font-medium text-orange-600">12 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {features.find(f => f.id === activeFeature)?.name}
              </h2>
              <p className="text-sm text-gray-600">
                {features.find(f => f.id === activeFeature)?.description}
              </p>
            </div>
            
            {activeFeature === 'interview' && (
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors">
                  <PlayIcon className="w-4 h-4" />
                  <span>Start New Interview</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden">
          {activeFeature === 'chat' && (
            <EnhancedChatInterface 
              agent="parikshak"
              placeholder="Ask about career guidance, interview tips... आपका करियर लक्ष्य क्या है?"
              welcomeMessage="नमस्ते! I'm Parikshak, your interview coach and career mentor. I can help you prepare for interviews with video practice sessions, analyze your resume, conduct mock tests, and provide personalized career guidance. What would you like to work on today?"
            />
          )}
          
          {activeFeature === 'interview' && <VideoInterview />}
          
          {activeFeature === 'resume' && <ResumeAnalyzer />}
          
          {activeFeature === 'tests' && <MockTests />}
        </div>
      </div>
    </div>
  );
}
