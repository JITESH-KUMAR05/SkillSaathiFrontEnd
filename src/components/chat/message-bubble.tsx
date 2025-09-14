'use client';

import { motion } from 'framer-motion';
import { Volume2, Copy, CheckCheck, Sparkles, Zap, Target, User } from 'lucide-react';
import { useState } from 'react';
import { Message } from '@/types/modern';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chat-store';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
  onVoicePlay?: (text: string) => void;
}

export function MessageBubble({ message, isLast, onVoicePlay }: MessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.role === 'user';
  const { currentAgent } = useChatStore();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  const playAudio = () => {
    if (message.audioUrl) {
      const audio = new Audio(message.audioUrl);
      audio.play();
    } else if (onVoicePlay) {
      onVoicePlay(message.content);
    }
  };

  // Agent-specific styling
  const getAgentStyles = () => {
    if (isUser) {
      return {
        avatar: <User className="w-4 h-4" />,
        bgColor: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        textColor: 'text-white',
        bubbleBg: 'bg-blue-500',
        align: 'justify-end'
      };
    }

    switch (currentAgent) {
      case 'mitra':
        return {
          avatar: <Sparkles className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-br from-rose-400 to-pink-500',
          textColor: 'text-white',
          bubbleBg: 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200',
          align: 'justify-start'
        };
      case 'guru':
        return {
          avatar: <Zap className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-br from-emerald-400 to-teal-500',
          textColor: 'text-white',
          bubbleBg: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200',
          align: 'justify-start'
        };
      case 'parikshak':
        return {
          avatar: <Target className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-br from-indigo-400 to-purple-500',
          textColor: 'text-white',
          bubbleBg: 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200',
          align: 'justify-start'
        };
      default:
        return {
          avatar: <Sparkles className="w-4 h-4" />,
          bgColor: 'bg-gradient-to-br from-slate-400 to-gray-500',
          textColor: 'text-white',
          bubbleBg: 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200',
          align: 'justify-start'
        };
    }
  };

  const styles = getAgentStyles();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 group',
        styles.align
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg',
            styles.bgColor
          )}>
            {styles.avatar}
          </div>
        </div>
      )}
      
      <div className={cn(
        'max-w-[70%] group',
        isUser ? 'order-1' : 'order-2'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-3 shadow-sm relative transition-all duration-300',
          isUser 
            ? `${styles.bubbleBg} text-white ml-auto shadow-blue-200/50` 
            : `${styles.bubbleBg} text-gray-900 border hover:shadow-lg`,
          isHovered && !isUser && 'shadow-lg transform scale-[1.02]'
        )}>
          <div className="prose prose-sm max-w-none">
            {message.isStreaming ? (
              <div className="flex items-center gap-2">
                <span>{message.content}</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            )}
          </div>
          
          {/* Message Actions */}
          {!message.isStreaming && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                scale: isHovered ? 1 : 0.8 
              }}
              transition={{ duration: 0.2 }}
              className={cn(
                'absolute -top-10 opacity-0 group-hover:opacity-100 transition-all flex gap-1 z-10',
                isUser ? 'right-0' : 'left-0'
              )}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyToClipboard}
                className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md transition-all border border-gray-200"
                title="Copy message"
              >
                {isCopied ? <CheckCheck size={16} /> : <Copy size={16} />}
              </motion.button>
              
              {(message.audioUrl || onVoicePlay) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={playAudio}
                  className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md transition-all border border-gray-200"
                  title="Play audio"
                >
                  <Volume2 size={16} />
                </motion.button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          'text-xs text-gray-500 mt-1 px-1',
          isUser ? 'text-right' : 'text-left'
        )}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 order-2">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg',
            styles.bgColor
          )}>
            {styles.avatar}
          </div>
        </div>
      )}
    </motion.div>
  );
}
