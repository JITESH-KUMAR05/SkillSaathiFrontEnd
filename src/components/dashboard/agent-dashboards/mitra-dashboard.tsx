'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon,
  FaceSmileIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { EnhancedChatInterface } from '../../chat/enhanced-chat-interface';
import { MoodTracker } from '../../features/mood-tracker';
import { WellnessTips } from '../../features/wellness-tips';

export function MitraDashboard() {
  const [activeFeature, setActiveFeature] = useState<'chat' | 'mood' | 'wellness'>('chat');

  const features = [
    {
      id: 'chat',
      name: 'Chat Support',
      icon: ChatBubbleLeftRightIcon,
      description: 'Talk to your caring AI friend',
    },
    {
      id: 'mood',
      name: 'Mood Tracking',
      icon: FaceSmileIcon,
      description: 'Track and understand your emotions',
    },
    {
      id: 'wellness',
      name: 'Wellness Tips',
      icon: HeartIcon,
      description: 'Personalized mental health guidance',
    },
  ];

  return (
    <div className="h-full flex">
      {/* Feature Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mitra</h1>
              <p className="text-sm text-gray-600">मित्र - Your Caring Friend</p>
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
                    ? 'bg-red-50 border-2 border-red-200 text-red-700'
                    : 'border-2 border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-red-100' : 'bg-gray-100'}`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-600'}`} />
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

        {/* Quick Stats */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Wellness</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mood Score</span>
              <div className="flex items-center space-x-1">
                <ChartBarIcon className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600">Good</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Check-ins</span>
              <span className="text-sm font-medium">3/5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Streak</span>
              <span className="text-sm font-medium text-orange-600">7 days</span>
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
            
            {activeFeature === 'chat' && (
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MicrophoneIcon className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <SpeakerWaveIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden">
          {activeFeature === 'chat' && (
            <EnhancedChatInterface 
              agent="mitra"
              placeholder="Share what's on your mind... मित्र यहाँ है आपके लिए"
              welcomeMessage="नमस्ते! I'm Mitra, your caring AI friend. I'm here to listen, support, and help you navigate through life's challenges. How are you feeling today?"
            />
          )}
          
          {activeFeature === 'mood' && <MoodTracker />}
          
          {activeFeature === 'wellness' && <WellnessTips />}
        </div>
      </div>
    </div>
  );
}
