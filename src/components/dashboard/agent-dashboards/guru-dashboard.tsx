'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  CameraIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { EnhancedChatInterface } from '../../chat/enhanced-chat-interface';
import { DocumentScanner } from '../../features/document-scanner';
import { LearningPath } from '../../features/learning-path';
import { KnowledgeBase } from '../../features/knowledge-base';

export function GuruDashboard() {
  const [activeFeature, setActiveFeature] = useState<'chat' | 'scanner' | 'learning' | 'knowledge'>('chat');

  const features = [
    {
      id: 'chat',
      name: 'AI Tutoring',
      icon: ChatBubbleLeftRightIcon,
      description: 'Get personalized learning assistance',
    },
    {
      id: 'scanner',
      name: 'Document Scanner',
      icon: CameraIcon,
      description: 'Scan and analyze study materials',
    },
    {
      id: 'learning',
      name: 'Learning Paths',
      icon: BookOpenIcon,
      description: 'Structured learning journeys',
    },
    {
      id: 'knowledge',
      name: 'Knowledge Base',
      icon: ClipboardDocumentCheckIcon,
      description: 'Your personal study repository',
    },
  ];

  return (
    <div className="h-full flex">
      {/* Feature Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Guru</h1>
              <p className="text-sm text-gray-600">गुरु - Your Learning Mentor</p>
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
                    ? 'bg-teal-50 border-2 border-teal-200 text-teal-700'
                    : 'border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-teal-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-600'}`} />
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

        {/* Quick Upload */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-2 p-3 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors">
              <CameraIcon className="w-4 h-4 text-teal-600" />
              <span className="text-sm text-teal-700">Scan Document</span>
            </button>
            <button className="w-full flex items-center space-x-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowUpTrayIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Upload PDF</span>
            </button>
          </div>
        </div>

        {/* Study Stats */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Study Progress</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Documents Scanned</span>
              <span className="text-sm font-medium text-teal-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Study Sessions</span>
              <span className="text-sm font-medium text-teal-600">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Learning Streak</span>
              <span className="text-sm font-medium text-orange-600">5 days</span>
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
            
            {activeFeature === 'scanner' && (
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg text-sm transition-colors">
                  New Scan
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden">
          {activeFeature === 'chat' && (
            <EnhancedChatInterface 
              agent="guru"
              placeholder="Ask about any topic you want to learn... आपका सवाल क्या है?"
              welcomeMessage="नमस्ते! I'm Guru, your learning mentor. I can help you understand complex topics, scan documents for quick insights, create personalized study plans, and guide your educational journey. What would you like to learn today?"
              showFileUpload={true}
            />
          )}
          
          {activeFeature === 'scanner' && <DocumentScanner />}
          
          {activeFeature === 'learning' && <LearningPath />}
          
          {activeFeature === 'knowledge' && <KnowledgeBase />}
        </div>
      </div>
    </div>
  );
}
