'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
  PhotoIcon,
  DocumentIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useChatStore } from '@/store/chat-store';
import { AgentType } from '@/types/modern';
import { MessageBubble } from './message-bubble';
import { TypingIndicator } from './typing-indicator';
import { useChat } from '@/hooks/useChat';
import { cn } from '@/lib/utils';
import { voiceService, VoiceInputEvent } from '@/services/enhanced-voice-service';

interface EnhancedChatInterfaceProps {
  agent: AgentType;
  placeholder?: string;
  welcomeMessage?: string;
  showFileUpload?: boolean;
}

export function EnhancedChatInterface({ 
  agent, 
  placeholder = "Type your message...",
  welcomeMessage,
  showFileUpload = false
}: EnhancedChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceActivated, setIsVoiceActivated] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState({ speechRecognition: false, audioPlayback: false });
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading } = useChatStore();
  const { sendMessage } = useChat();
  
  const agentMessages = messages[agent] || [];

    // Initialize voice service
  useEffect(() => {
    const initVoiceService = () => {
      try {
        // Check voice support
        const support = voiceService.isSupported();
        setVoiceSupport(support);
        
        // Configure voice service for this agent
        voiceService.updateSettings({
          agent,
          language: 'en-IN',
          autoPlay: true,
          speechRecognition: true,
          voiceActivation: false
        });

        // Set up event handlers
        voiceService.setEventHandlers({
          onVoiceInput: handleVoiceInput,
          onVoiceStart: () => setIsListening(true),
          onVoiceEnd: () => setIsListening(false),
          onError: (error) => console.error('Voice service error:', error)
        });

        console.log('✅ Voice service initialized with support:', support);
      } catch (error) {
        console.error('❌ Failed to initialize voice service:', error);
        setVoiceSupport({ speechRecognition: false, audioPlayback: false });
      }
    };

    initVoiceService();
    
    // Cleanup on unmount
    return () => {
      voiceService.dispose();
    };
  }, [agent]);

  // Handle voice input events
  const handleVoiceInput = useCallback((event: VoiceInputEvent) => {
    if (event.isFinal && event.text.trim()) {
      // Set the message and auto-send
      setMessage(event.text);
      handleSendMessage(event.text);
      setVoiceTranscript('');
    } else {
      // Show interim transcript
      setVoiceTranscript(event.text);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  // Auto-play agent responses when voice is enabled
  useEffect(() => {
    const playLatestResponse = async () => {
      if (!voiceSupport.audioPlayback || isVoiceSpeaking || isLoading) return;
      
      const lastMessage = agentMessages[agentMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
        setIsVoiceSpeaking(true);
        try {
          await voiceService.speakText(lastMessage.content, true);
        } catch (error) {
          console.error('Failed to play response:', error);
        } finally {
          setIsVoiceSpeaking(false);
        }
      }
    };

    playLatestResponse();
  }, [agentMessages, voiceSupport.audioPlayback, isVoiceSpeaking, isLoading]);

  const handleSendMessage = async (text: string = message) => {
    if (!text.trim() || isLoading) return;
    
    setMessage('');
    setVoiceTranscript('');
    
    try {
      await sendMessage(agent, text);  // Fixed parameter order: agent first, then text
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [agentMessages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message.trim();
    setMessage('');
    
    await sendMessage(agent, userMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
  };

  const handleVoicePlay = async (text: string) => {
    try {
      if (voiceService && isVoiceSupported) {
        if (voiceService.isSpeaking()) {
          voiceService.stop();
          setIsVoiceSpeaking(false);
        } else {
          setIsVoiceSpeaking(true);
          await voiceService.speakAgentResponse(text, agent);
          setIsVoiceSpeaking(false);
        }
      }
    } catch (error) {
      console.error('Voice playback error:', error);
      setIsVoiceSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Welcome Message */}
        {welcomeMessage && agentMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border"
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">Welcome!</div>
                <div className="text-gray-700">{welcomeMessage}</div>
                <button
                  onClick={() => handleVoicePlay(welcomeMessage)}
                  disabled={!isVoiceSupported}
                  className={cn(
                    "mt-2 flex items-center space-x-1 text-sm transition-colors",
                    isVoiceSupported 
                      ? "text-blue-600 hover:text-blue-700" 
                      : "text-gray-400 cursor-not-allowed"
                  )}
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                  <span>Play voice</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Messages */}
        <AnimatePresence>
          {agentMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              onVoicePlay={handleVoicePlay}
            />
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          {/* File Upload Area (for Guru) */}
          {showFileUpload && (
            <div className="mb-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex items-center justify-center space-x-4 text-gray-500">
                <PhotoIcon className="w-6 h-6" />
                <span>Drop images or documents here to analyze</span>
                <DocumentIcon className="w-6 h-6" />
              </div>
            </div>
          )}

          {/* Input Container */}
          <div className="flex items-end space-x-3">
            {/* Voice Recording */}
            <button
              onClick={handleVoiceRecord}
              className={cn(
                'p-3 rounded-xl transition-all duration-200',
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              )}
            >
              {isRecording ? (
                <StopIcon className="w-5 h-5" />
              ) : (
                <MicrophoneIcon className="w-5 h-5" />
              )}
            </button>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                rows={1}
                className="w-full p-4 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                style={{ minHeight: '56px' }}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                className={cn(
                  'absolute right-2 bottom-2 p-2 rounded-xl transition-all duration-200',
                  message.trim() && !isLoading
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                )}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Playback Status */}
            {isVoiceSpeaking && (
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl">
                <SpeakerWaveIcon className="w-5 h-5 text-blue-500 animate-pulse" />
                <span className="text-sm text-blue-700">Playing...</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>Press Enter to send, Shift+Enter for new line</span>
              {agent === 'mitra' && (
                <span className="text-red-500">• Emotional support available 24/7</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Azure OpenAI Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
