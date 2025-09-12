'use client';

import { motion } from 'framer-motion';
import { AgentType } from '@/types/modern';
import { useChatStore } from '@/store/chat-store';
import { cn } from '@/lib/utils';

const AGENTS = [
  {
    id: 'mitra' as AgentType,
    name: 'Mitra',
    displayName: 'मित्र (Mitra)',
    emoji: '🤗',
    description: 'Your caring friend for emotional support',
    color: 'bg-gradient-to-br from-red-400 to-pink-500',
    textColor: 'text-red-600',
    borderColor: 'border-red-300',
  },
  {
    id: 'guru' as AgentType,
    name: 'Guru', 
    displayName: 'गुरु (Guru)',
    emoji: '🎓',
    description: 'Your learning mentor for growth',
    color: 'bg-gradient-to-br from-teal-400 to-cyan-500',
    textColor: 'text-teal-600',
    borderColor: 'border-teal-300',
  },
  {
    id: 'parikshak' as AgentType,
    name: 'Parikshak',
    displayName: 'परीक्षक (Parikshak)', 
    emoji: '💼',
    description: 'Your interview coach for career success',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
    textColor: 'text-blue-600', 
    borderColor: 'border-blue-300',
  },
];

export function AgentSelector() {
  const { currentAgent, setCurrentAgent, messages } = useChatStore();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {AGENTS.map((agent) => {
        const messageCount = messages[agent.id]?.length || 0;
        const isActive = currentAgent === agent.id;
        
        return (
          <motion.div
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              'relative overflow-hidden rounded-xl cursor-pointer transition-all duration-200',
              isActive 
                ? `ring-2 ring-offset-2 ${agent.borderColor.replace('border-', 'ring-')}`
                : 'hover:shadow-lg'
            )}
            onClick={() => setCurrentAgent(agent.id)}
          >
            <div className={cn('h-40 p-6 text-white', agent.color)}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl mb-2">{agent.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{agent.displayName}</h3>
                  <p className="text-sm opacity-90 leading-tight">{agent.description}</p>
                </div>
                
                {messageCount > 0 && (
                  <div className="bg-white bg-opacity-20 rounded-full px-2 py-1 text-xs">
                    {messageCount} msgs
                  </div>
                )}
              </div>
              
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-white bg-opacity-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </div>
            
            <div className="p-4 bg-white border-t">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{isActive ? 'Active' : 'Click to chat'}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
