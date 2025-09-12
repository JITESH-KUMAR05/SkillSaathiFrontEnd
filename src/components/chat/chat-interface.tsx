'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { useChatStore } from '@/store/chat-store';
import { useStreamingChat } from '@/hooks/use-chat';
import { cn } from '@/lib/utils';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { currentAgent, messages, isLoading, preferences } = useChatStore();
  const { sendStreamingMessage } = useStreamingChat();
  
  const currentMessages = messages[currentAgent] || [];
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    const message = inputValue.trim();
    setInputValue('');
    
    // Use streaming for real-time Azure OpenAI responses
    await sendStreamingMessage(message, currentAgent);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const toggleRecording = () => {
    // TODO: Implement voice recording
    setIsRecording(!isRecording);
  };
  
  // Auto-resize textarea
  const adjustTextareaHeight = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
  };
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {currentAgent === 'mitra' ? '🤗' : currentAgent === 'guru' ? '🎓' : '💼'}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {currentAgent === 'mitra' ? 'मित्र (Mitra)' : 
               currentAgent === 'guru' ? 'गुरु (Guru)' : 
               'परीक्षक (Parikshak)'}
            </h2>
            <p className="text-sm text-gray-500">
              {currentAgent === 'mitra' ? 'Your caring friend for emotional support' :
               currentAgent === 'guru' ? 'Your learning mentor for growth' :
               'Your interview coach for career success'}
            </p>
          </div>
          {preferences.voice_enabled && (
            <div className="ml-auto flex items-center gap-2 text-sm text-green-600">
              <Volume2 size={16} />
              <span>Voice enabled</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-4">
              {currentAgent === 'mitra' ? '🤗' : currentAgent === 'guru' ? '🎓' : '💼'}
            </div>
            <h3 className="text-lg font-medium mb-2">
              Start a conversation with {currentAgent === 'mitra' ? 'Mitra' : currentAgent === 'guru' ? 'Guru' : 'Parikshak'}
            </h3>
            <p className="text-sm">
              {currentAgent === 'mitra' ? 'Share your thoughts, feelings, or just say hello!' :
               currentAgent === 'guru' ? 'Ask about learning, career guidance, or skill development.' :
               'Practice interviews, get feedback, or prepare for your next opportunity.'}
            </p>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {currentMessages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === currentMessages.length - 1}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                adjustTextareaHeight(e);
              }}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${currentAgent}...`}
              className={cn(
                'w-full resize-none rounded-xl border border-gray-200 px-4 py-3 pr-12',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                'max-h-32 min-h-[48px] leading-6 scrollbar-thin scrollbar-thumb-gray-300'
              )}
              rows={1}
              disabled={isLoading}
            />
            
            {/* Voice Recording Button */}
            <button
              type="button"
              onClick={toggleRecording}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors',
                isRecording 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              )}
              disabled={isLoading}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          </div>
          
          {/* Send Button */}
          <motion.button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            whileHover={{ scale: inputValue.trim() && !isLoading ? 1.05 : 1 }}
            whileTap={{ scale: inputValue.trim() && !isLoading ? 0.95 : 1 }}
            className={cn(
              'p-3 rounded-xl transition-colors',
              inputValue.trim() && !isLoading
                ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            )}
          >
            <Send size={20} />
          </motion.button>
        </form>
        
        {/* Helper Text */}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            {preferences.voice_enabled && (
              <div className="flex items-center gap-1">
                <Volume2 size={12} />
                <span>Voice responses enabled</span>
              </div>
            )}
            <span className="text-green-600">✨ Powered by Azure OpenAI GPT-4o</span>
          </div>
          <span>Press Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
