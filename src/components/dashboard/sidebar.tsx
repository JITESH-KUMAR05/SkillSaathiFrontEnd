'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChatBubbleLeftIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  HeartIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useChatStore } from '@/store/chat-store';
import { AgentType } from '@/types/modern';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const AGENTS = [
  {
    id: 'mitra' as AgentType,
    name: 'Mitra',
    displayName: 'मित्र',
    icon: HeartIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50 hover:bg-red-100',
    description: 'Emotional Support',
  },
  {
    id: 'guru' as AgentType,
    name: 'Guru',
    displayName: 'गुरु',
    icon: AcademicCapIcon,
    color: 'text-teal-500',
    bgColor: 'bg-teal-50 hover:bg-teal-100',
    description: 'Learning Mentor',
  },
  {
    id: 'parikshak' as AgentType,
    name: 'Parikshak',
    displayName: 'परीक्षक',
    icon: BriefcaseIcon,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    description: 'Interview Coach',
  },
];

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const { currentAgent, setCurrentAgent, messages, clearHistory } = useChatStore();
  const [activeSection, setActiveSection] = useState<'agents' | 'chats' | 'settings'>('agents');

  const currentAgentInfo = AGENTS.find(agent => agent.id === currentAgent);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-gray-50/50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2"
            >
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🤖 BuddyAgents
              </div>
            </motion.div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Navigation Tabs */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'agents', label: 'Agents', icon: ChatBubbleLeftIcon },
              { key: 'chats', label: 'History', icon: DocumentTextIcon },
              { key: 'settings', label: 'Settings', icon: Cog6ToothIcon },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSection(key as any)}
                className={cn(
                  'flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors',
                  activeSection === key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeSection === 'agents' && (
          <div className="p-4 space-y-3">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-gray-700 mb-4">Select Your AI Companion</h3>
            )}
            
            {AGENTS.map((agent, index) => {
              const Icon = agent.icon;
              const isActive = currentAgent === agent.id;
              const messageCount = messages[agent.id]?.length || 0;
              
              return (
                <motion.button
                  key={agent.id}
                  onClick={() => setCurrentAgent(agent.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full p-4 rounded-xl border-2 transition-all duration-300 relative overflow-hidden',
                    isActive
                      ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg shadow-blue-200/50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                    />
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className={cn('p-3 rounded-xl shadow-sm', agent.bgColor)}
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Icon className={cn('w-6 h-6', agent.color)} />
                    </motion.div>
                    
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-gray-900">{agent.name}</span>
                          <span className="text-sm text-gray-500 font-medium">{agent.displayName}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{agent.description}</p>
                        {messageCount > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-1 mt-2"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs text-green-600 font-medium">{messageCount} messages</span>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}

        {activeSection === 'chats' && (
          <div className="p-4">
            {!isCollapsed && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">Chat History</h3>
                  <button
                    onClick={() => clearHistory()}
                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                
                {currentAgent && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Current: {currentAgentInfo?.name}</span>
                      <span className="text-xs text-gray-500">
                        {messages[currentAgent]?.length || 0} messages
                      </span>
                    </div>
                    
                    <button className="w-full flex items-center space-x-2 p-3 rounded-lg border border-dashed border-gray-300 hover:border-gray-400 transition-colors">
                      <PlusIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">New Chat Session</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="p-4 space-y-4">
            {!isCollapsed && (
              <>
                <h3 className="text-sm font-medium text-gray-700 mb-4">Settings</h3>
                
                {/* Voice Settings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MicrophoneIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Voice Responses</span>
                    </div>
                    <div className="w-10 h-6 bg-blue-600 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full ml-auto shadow-sm"></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <VideoCameraIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Video Interviews</span>
                    </div>
                    <div className="w-10 h-6 bg-gray-300 rounded-full flex items-center p-1">
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Language Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language Preference
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                    <option>English + Hindi</option>
                    <option>English Only</option>
                    <option>Hindi Only</option>
                  </select>
                </div>

                {/* Theme Settings */}
                <div className="pt-4 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 border border-blue-300 bg-blue-50 rounded-lg text-sm">
                      Light
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                      Dark
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>Powered by Azure OpenAI & Murf AI</div>
            <div className="flex justify-center space-x-3">
              <span>🔒 Secure</span>
              <span>⚡ Fast</span>
              <span>🇮🇳 Made for India</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
