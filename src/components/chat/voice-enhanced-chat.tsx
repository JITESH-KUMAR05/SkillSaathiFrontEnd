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
  }, [agent, handleVoiceInput]);

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
      await sendMessage(agent, text);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceActivation = () => {
    const newState = voiceService.toggleVoiceActivation();
    setIsVoiceActivated(newState);
  };

  const startListening = () => {
    if (voiceSupport.speechRecognition) {
      voiceService.startListening();
    }
  };

  const stopListening = () => {
    voiceService.stopListening();
  };

  const toggleVoiceSpeaking = async () => {
    if (isVoiceSpeaking) {
      voiceService.stopCurrentAudio();
      setIsVoiceSpeaking(false);
    } else {
      const lastMessage = agentMessages[agentMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
        setIsVoiceSpeaking(true);
        try {
          await voiceService.speakText(lastMessage.content, true);
        } finally {
          setIsVoiceSpeaking(false);
        }
      }
    }
  };

  // Show welcome message
  useEffect(() => {
    if (welcomeMessage && agentMessages.length === 0) {
      // Add welcome message to store if needed
    }
  }, [welcomeMessage, agentMessages.length]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Voice Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-sm font-bold">{agent[0].toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 capitalize">{agent}</h3>
            <p className="text-xs text-gray-500">
              {isListening ? "🎤 Listening..." : 
               isVoiceSpeaking ? "🔊 Speaking..." : 
               "Ready to help"}
            </p>
          </div>
        </div>
        
        {/* Voice Controls */}
        <div className="flex items-center space-x-2">
          {/* Voice Activation Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoiceActivation}
            disabled={!voiceSupport.speechRecognition}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isVoiceActivated
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200",
              !voiceSupport.speechRecognition && "opacity-50 cursor-not-allowed"
            )}
            title={isVoiceActivated ? "Disable continuous listening" : "Enable continuous listening"}
          >
            {isVoiceActivated ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
          </motion.button>

          {/* Manual Voice Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            disabled={!voiceSupport.speechRecognition}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isListening
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200",
              !voiceSupport.speechRecognition && "opacity-50 cursor-not-allowed"
            )}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
          </motion.button>

          {/* Speaker Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVoiceSpeaking}
            disabled={!voiceSupport.audioPlayback}
            className={cn(
              "p-2 rounded-lg transition-colors",
              isVoiceSpeaking
                ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200",
              !voiceSupport.audioPlayback && "opacity-50 cursor-not-allowed"
            )}
            title={isVoiceSpeaking ? "Stop speaking" : "Replay last response"}
          >
            <SpeakerWaveIcon className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {agentMessages.map((message, index) => (
            <MessageBubble
              key={`${agent}-${index}`}
              message={message}
              isLast={index === agentMessages.length - 1}
              onVoicePlay={(text) => voiceService.speakText(text, true)}
            />
          ))}
        </AnimatePresence>
        
        {isLoading && <TypingIndicator />}
        
        {/* Voice transcript preview */}
        {voiceTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <p className="text-blue-700 text-sm">
              🎤 {voiceTranscript}
            </p>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex items-end space-x-3">
          {showFileUpload && (
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload image"
              >
                <PhotoIcon className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload document"
              >
                <DocumentIcon className="w-5 h-5" />
              </motion.button>
            </div>
          )}
          
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "🎤 Listening..." : placeholder}
              className="w-full resize-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all max-h-32"
              rows={1}
              disabled={isLoading || isListening}
            />
            
            {/* Voice indicator in input */}
            {isListening && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-2 h-2 bg-red-500 rounded-full"
                />
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={(!message.trim() && !voiceTranscript) || isLoading}
            className={cn(
              "p-3 rounded-xl transition-all",
              (message.trim() || voiceTranscript) && !isLoading
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </motion.button>
        </div>
        
        {/* Voice support status */}
        <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-500">
          <span className={cn(
            "flex items-center space-x-1",
            voiceSupport.speechRecognition ? "text-green-600" : "text-red-500"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              voiceSupport.speechRecognition ? "bg-green-500" : "bg-red-500"
            )} />
            <span>Voice Input</span>
          </span>
          
          <span className={cn(
            "flex items-center space-x-1",
            voiceSupport.audioPlayback ? "text-green-600" : "text-red-500"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              voiceSupport.audioPlayback ? "bg-green-500" : "bg-red-500"
            )} />
            <span>Audio Output</span>
          </span>
        </div>
      </form>
    </div>
  );
}