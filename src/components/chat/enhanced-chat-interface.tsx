'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon,
  MicrophoneIcon,
  SpeakerWaveIcon,
  StopIcon,
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  TrashIcon
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
  placeholder = "Type your message or speak...",
  welcomeMessage,
  showFileUpload = false
}: EnhancedChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceActivated, setIsVoiceActivated] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceSupport, setVoiceSupport] = useState({ speechRecognition: false, audioPlayback: false });
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [hasAudioReady, setHasAudioReady] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [autoVoiceEnabled, setAutoVoiceEnabled] = useState(false);
  const [lastVoiceTriggeredMessageId, setLastVoiceTriggeredMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading, clearMessages } = useChatStore();
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

    // Check initial auto-voice status from backend
    const checkAutoVoiceStatus = async () => {
      try {
        const response = await fetch('/api/v1/voice/auto-voice/status');
        if (response.ok) {
          const data = await response.json();
          setAutoVoiceEnabled(data.enabled);
          console.log('✅ Auto-voice status loaded:', data.enabled);
        }
      } catch (error) {
        console.error('❌ Failed to check auto-voice status:', error);
      }
    };

    initVoiceService();
    checkAutoVoiceStatus();
    
    // Cleanup on unmount
    return () => {
      voiceService.dispose();
    };
  }, [agent, handleVoiceInput]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [agentMessages]);

  // Auto-play agent responses when auto-voice is enabled
  useEffect(() => {
    const lastMessage = agentMessages[agentMessages.length - 1];
    
    // Only trigger auto-voice if:
    // 1. Message exists and is from assistant
    // 2. Message has content
    // 3. Auto-voice is enabled and not currently speaking
    // 4. Chat is not loading (to avoid triggering on partial streaming messages)
    if (lastMessage && 
        lastMessage.role === 'assistant' && 
        lastMessage.content && 
        autoVoiceEnabled && 
        !isVoiceSpeaking && 
        !isLoading) {
      
      console.log('🎵 Auto-voice triggering for message:', lastMessage.content.substring(0, 50) + '...');
      handleVoicePlay(lastMessage.content);
    } else if (lastMessage && 
               lastMessage.role === 'assistant' && 
               lastMessage.content && 
               !isLoading) {
      // Manual mode - just show play button after streaming is complete
      setHasAudioReady(true);
      setShowPlayButton(true);
    }
  }, [agentMessages, autoVoiceEnabled, isLoading]);

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
      setShowPlayButton(false);
    } else {
      // Try to play current audio first, then generate new if needed
      if (hasAudioReady) {
        setIsVoiceSpeaking(true);
        setShowPlayButton(false);
        try {
          await voiceService.playCurrentAudio();
        } finally {
          setIsVoiceSpeaking(false);
        }
      } else {
        const lastMessage = agentMessages[agentMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content) {
          setIsVoiceSpeaking(true);
          setShowPlayButton(false);
          try {
            await voiceService.speakText(lastMessage.content, true);
          } finally {
            setIsVoiceSpeaking(false);
          }
        }
      }
    }
  };

  const startNewChat = () => {
    // Clear messages for current agent
    clearMessages(agent);
    // Stop any ongoing voice
    voiceService.stopCurrentAudio();
    setIsVoiceSpeaking(false);
    setHasAudioReady(false);
    setShowPlayButton(false);
    setVoiceTranscript('');
    setMessage('');
  };

  const handleVoicePlay = async (text: string) => {
    if (isVoiceSpeaking) {
      voiceService.stopCurrentAudio();
      setIsVoiceSpeaking(false);
      return;
    }
    
    setIsVoiceSpeaking(true);
    try {
      await voiceService.speakText(text, true);
    } catch (error) {
      console.error('Voice playback failed:', error);
    } finally {
      setIsVoiceSpeaking(false);
    }
  };

  const toggleAutoVoice = async () => {
    const newState = !autoVoiceEnabled;
    setAutoVoiceEnabled(newState);
    
    try {
      // Send auto-voice setting to backend (correct URL)
      const response = await fetch('http://localhost:8000/api/v1/voice/auto-voice/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: newState }),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update auto-voice setting: ${response.status} ${errorData}`);
      }
      
      const result = await response.json();
      console.log(`Auto-voice ${newState ? 'enabled' : 'disabled'}:`, result.message);
    } catch (error) {
      console.error('Failed to update auto-voice setting:', error);
      // Revert state on error
      setAutoVoiceEnabled(!newState);
      // Show user-friendly error
      alert(`Failed to ${newState ? 'enable' : 'disable'} auto-voice. Please try again.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Chat Header with New Chat Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
            {agent.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              {agent.charAt(0).toUpperCase() + agent.slice(1)}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {agentMessages.length > 0 ? `${agentMessages.length} messages` : 'Start a conversation'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* New Chat Button */}
          {agentMessages.length > 0 && (
            <button
              onClick={startNewChat}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              title="Start new conversation"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Chat</span>
            </button>
          )}
          
          {/* Clear All Button */}
          {agentMessages.length > 0 && (
            <button
              onClick={startNewChat}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          {/* Auto-Voice Toggle Button */}
          <button
            onClick={toggleAutoVoice}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              autoVoiceEnabled
                ? "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800"
                : "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            )}
            title={`${autoVoiceEnabled ? 'Disable' : 'Enable'} auto-voice for all responses`}
          >
            <SpeakerWaveIcon className="w-4 h-4" />
            <span>{autoVoiceEnabled ? 'Auto ON' : 'Auto OFF'}</span>
          </button>
        </div>
      </div>
      {/* Voice Status Indicator */}
      {(isListening || voiceTranscript || isVoiceSpeaking || showPlayButton) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-4 bg-blue-100 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {isListening && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300">Listening...</span>
                </div>
              )}
              {isVoiceSpeaking && (
                <div className="flex items-center space-x-2">
                  <SpeakerWaveIcon className="w-4 h-4 text-green-600 animate-pulse" />
                  <span className="text-sm text-green-700 dark:text-green-300">Speaking...</span>
                </div>
              )}
              {showPlayButton && (
                <button
                  onClick={toggleVoiceSpeaking}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <SpeakerWaveIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">🔊 Click to Play Response</span>
                </button>
              )}
            </div>
            {voiceTranscript && (
              <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                "{voiceTranscript}"
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome Message */}
        {welcomeMessage && agentMessages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center p-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Welcome to {agent.charAt(0).toUpperCase() + agent.slice(1)}!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{welcomeMessage}</p>
              {voiceSupport.speechRecognition && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  💬 You can speak directly or type your message
                </p>
              )}
              {!voiceSupport.speechRecognition && voiceSupport.audioPlayback && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
                  🎧 Voice playback available • Speech recognition not supported in this browser
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Message List */}
        <AnimatePresence>
          {agentMessages.map((msg, index) => (
            <motion.div
              key={`${msg.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble
                message={msg}
                isLast={index === agentMessages.length - 1}
                onVoicePlay={handleVoicePlay}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <TypingIndicator />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-end space-x-2">
          {/* Voice Controls */}
          <div className="flex flex-col space-y-2">
            {/* Voice Activation Toggle */}
            <button
              onClick={toggleVoiceActivation}
              disabled={!voiceSupport.speechRecognition}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isVoiceActivated
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
                !voiceSupport.speechRecognition && "opacity-50 cursor-not-allowed"
              )}
              title={isVoiceActivated ? "Disable continuous listening" : "Enable continuous listening"}
            >
              {isVoiceActivated ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
            </button>

            {/* Manual Voice Toggle */}
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={!voiceSupport.speechRecognition}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-blue-500 text-white hover:bg-blue-600",
                !voiceSupport.speechRecognition && "opacity-50 cursor-not-allowed"
              )}
              title={isListening ? "Stop listening" : "Start listening"}
            >
              {isListening ? (
                <StopIcon className="w-4 h-4" />
              ) : (
                <MicrophoneIcon className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Text Input */}
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className={cn(
                "w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
                "bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600",
                "text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              rows={1}
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          {/* Send Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!message.trim() || isLoading}
            className={cn(
              "p-3 rounded-lg transition-colors",
              message.trim() && !isLoading
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            )}
            title="Send message"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>

          {/* Voice Playback Toggle */}
          <button
            onClick={toggleVoiceSpeaking}
            disabled={!voiceSupport.audioPlayback || !agentMessages.some(m => m.role === 'assistant')}
            className={cn(
              "p-3 rounded-lg transition-colors",
              isVoiceSpeaking
                ? "bg-green-500 text-white animate-pulse"
                : "bg-purple-500 text-white hover:bg-purple-600",
              (!voiceSupport.audioPlayback || !agentMessages.some(m => m.role === 'assistant')) && 
                "opacity-50 cursor-not-allowed"
            )}
            title={isVoiceSpeaking ? "Stop speaking" : "Replay last response"}
          >
            <SpeakerWaveIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Voice Support Status */}
        {(!voiceSupport.speechRecognition || !voiceSupport.audioPlayback) && (
          <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex items-center space-x-2 mb-1">
                <span>⚠️</span>
                <span className="font-medium">Limited Voice Features</span>
              </div>
              <div className="text-xs space-y-1">
                {!voiceSupport.speechRecognition && (
                  <div>• Speech recognition not supported - please type messages</div>
                )}
                {!voiceSupport.audioPlayback && (
                  <div>• Audio playback not supported</div>
                )}
                {voiceSupport.audioPlayback && !voiceSupport.speechRecognition && (
                  <div>• Voice responses available - messages will be spoken aloud</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}