'use client';

import { motion } from 'framer-motion';
import { Volume2, Copy, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { Message } from '@/types/modern';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
  onVoicePlay?: (text: string) => void;
}

export function MessageBubble({ message, isLast, onVoicePlay }: MessageBubbleProps) {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';
  
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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex gap-3 group',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
            {message.agent === 'mitra' ? '🤗' : message.agent === 'guru' ? '🎓' : '💼'}
          </div>
        </div>
      )}
      
      <div className={cn(
        'max-w-[70%] group',
        isUser ? 'order-1' : 'order-2'
      )}>
        <div className={cn(
          'rounded-2xl px-4 py-3 shadow-sm relative',
          isUser 
            ? 'bg-blue-500 text-white ml-auto' 
            : 'bg-white text-gray-900 border border-gray-200'
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
            <div className={cn(
              'absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1',
              isUser ? 'right-0' : 'left-0'
            )}>
              <button
                onClick={copyToClipboard}
                className="p-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                title="Copy message"
              >
                {isCopied ? <CheckCheck size={14} /> : <Copy size={14} />}
              </button>
              
              {(message.audioUrl || onVoicePlay) && (
                <button
                  onClick={playAudio}
                  className="p-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  title="Play audio"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      )}
    </motion.div>
  );
}
