'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  User, 
  Bot, 
  Brain, 
  BookOpen, 
  CheckCircle2,
  Circle,
  Play,
  Pause,
  RefreshCw,
  Database,
  Key,
  Cloud,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Agent configurations with Indian market focus
const AGENTS = {
  mitra: {
    id: 'mitra',
    name: 'Mitra',
    description: 'Cultural Guide & Personal Assistant',
    avatar: '🙏',
    color: '#FF6B35',
    expertise: 'Cultural insights, festivals, traditions, personal assistance',
    personality: 'Warm, culturally aware, helpful companion'
  },
  guru: {
    id: 'guru',
    name: 'Guru',
    description: 'Knowledge & Education Expert',
    avatar: '📚',
    color: '#4ECDC4',
    expertise: 'Education, learning paths, skill development, academic guidance',
    personality: 'Wise, patient, encouraging teacher'
  },
  parikshak: {
    id: 'parikshak',
    name: 'Parikshak',
    description: 'Business & Career Advisor',
    avatar: '💼',
    color: '#45B7D1',
    expertise: 'Career guidance, business insights, professional development',
    personality: 'Strategic, analytical, results-oriented mentor'
  }
};

// Voice options for Murf AI (Indian and international voices)
const VOICE_OPTIONS = [
  { id: 'en-IN-arvind', name: 'Arvind (Hindi-English)', accent: 'Indian', gender: 'Male' },
  { id: 'en-IN-kavya', name: 'Kavya (Hindi-English)', accent: 'Indian', gender: 'Female' },
  { id: 'en-US-marcus', name: 'Marcus (US)', accent: 'American', gender: 'Male' },
  { id: 'en-US-natalie', name: 'Natalie (US)', accent: 'American', gender: 'Female' },
  { id: 'en-GB-oliver', name: 'Oliver (UK)', accent: 'British', gender: 'Male' },
  { id: 'en-GB-emma', name: 'Emma (UK)', accent: 'British', gender: 'Female' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  agent?: string;
  timestamp: Date;
  audioUrl?: string;
}

interface WebSocketMessage {
  type: 'text' | 'audio' | 'error' | 'status';
  content: string;
  agent?: string;
  audioUrl?: string;
}

export default function HomePage() {
  // Core state
  const [selectedAgent, setSelectedAgent] = useState<string>('mitra');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Configuration state
  const [selectedVoice, setSelectedVoice] = useState('en-IN-kavya');
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.8);
  const [murfApiKey, setMurfApiKey] = useState('');
  const [azureApiKey, setAzureApiKey] = useState('');
  const [azureEndpoint, setAzureEndpoint] = useState('');
  
  // Refs for WebSocket and Audio
  const wsRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection with minimal latency configuration
  const initializeWebSocket = useCallback(() => {
        const ws = new WebSocket('ws://localhost:8000/ws');    ws.onopen = () => {
      setIsConnected(true);
      toast.success('Connected to AI companion');
      console.log('WebSocket connected for minimal latency streaming');
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'text':
            const newMessage: Message = {
              id: Date.now().toString(),
              role: 'assistant',
              content: data.content,
              agent: data.agent || selectedAgent,
              timestamp: new Date(),
              audioUrl: data.audioUrl
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            // Trigger minimal latency audio streaming if available
            if (data.audioUrl) {
              playAudioStream(data.audioUrl);
            }
            break;
            
          case 'audio':
            // Handle real-time audio streaming
            if (data.audioUrl) {
              playAudioStream(data.audioUrl);
            }
            break;
            
          case 'error':
            toast.error(data.content);
            break;
            
          case 'status':
            setIsProcessing(data.content.includes('processing'));
            break;
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsProcessing(false);
      toast.error('Disconnected from AI companion');
      
      // Auto-reconnect after 3 seconds
      setTimeout(initializeWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error occurred');
    };

    wsRef.current = ws;
  }, [selectedAgent]);

  // Play audio stream with minimal latency
  const playAudioStream = useCallback(async (audioUrl: string) => {
    try {
      setIsSpeaking(true);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      audio.playbackRate = speechSpeed;
      
      audio.onended = () => {
        setIsSpeaking(false);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        toast.error('Audio playback failed');
      };
      
      await audio.play();
      audioRef.current = audio;
      
    } catch (error) {
      console.error('Audio streaming error:', error);
      setIsSpeaking(false);
      toast.error('Audio streaming failed');
    }
  }, [volume, speechSpeed]);

  // Send message with agent selection and streaming
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !isConnected || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const messageData = {
        type: 'chat',
        content: content.trim(),
        agent: selectedAgent,
        voice: selectedVoice,
        config: {
          speed: speechSpeed,
          volume: volume,
          streaming: true,
          minimal_latency: true
        }
      };

      wsRef.current?.send(JSON.stringify(messageData));
      
    } catch (error) {
      console.error('Send message error:', error);
      setIsProcessing(false);
      toast.error('Failed to send message');
    }
  }, [isConnected, isProcessing, selectedAgent, selectedVoice, speechSpeed, volume]);

  // Initialize speech recognition for voice input
  const initializeSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Indian English
    
    recognition.onstart = () => {
      setIsListening(true);
      toast.info('Listening... Speak now');
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      toast.success('Voice input captured');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.onerror = (event: any) => {
      setIsListening(false);
      toast.error(`Speech recognition error: ${event.error}`);
    };
    
    speechRecognitionRef.current = recognition;
  }, []);

  // Toggle voice listening
  const toggleListening = useCallback(() => {
    if (!speechRecognitionRef.current) {
      initializeSpeechRecognition();
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
    } else {
      speechRecognitionRef.current.start();
    }
  }, [isListening, initializeSpeechRecognition]);

  // Stop current audio
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsSpeaking(false);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize WebSocket on mount
  useEffect(() => {
    initializeWebSocket();
    initializeSpeechRecognition();
    
    return () => {
      wsRef.current?.close();
      speechRecognitionRef.current?.abort();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [initializeWebSocket, initializeSpeechRecognition]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            AI Multi-Agent Companion for India
          </h1>
          <p className="text-slate-300 text-lg">
            Choose your AI companion • Voice-enabled • Minimal latency streaming
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Agent Selection - Takes 80% screen coverage */}
          <div className="lg:col-span-3">
            <Tabs value={selectedAgent} onValueChange={setSelectedAgent} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800/50">
                {Object.values(AGENTS).map((agent) => (
                  <TabsTrigger 
                    key={agent.id} 
                    value={agent.id}
                    className="data-[state=active]:bg-slate-700 text-white"
                  >
                    <span className="text-2xl mr-2">{agent.avatar}</span>
                    {agent.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.values(AGENTS).map((agent) => (
                <TabsContent key={agent.id} value={agent.id}>
                  <Card className="bg-slate-800/50 border-slate-700 mb-6">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                          style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                        >
                          {agent.avatar}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-white text-2xl">{agent.name}</CardTitle>
                          <p className="text-slate-300 mt-1">{agent.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="bg-slate-700 text-slate-200">
                              {agent.expertise}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className="text-sm text-slate-300">
                            {isConnected ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Chat Interface */}
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                          <Bot className="w-5 h-5" />
                          Chat with {agent.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          {isSpeaking && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={stopAudio}
                              className="border-red-500 text-red-400 hover:bg-red-500/10"
                            >
                              <VolumeX className="w-4 h-4 mr-1" />
                              Stop
                            </Button>
                          )}
                          {isProcessing && (
                            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 animate-pulse">
                              <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                              Processing
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Messages */}
                      <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-slate-900/30 rounded-lg p-4">
                        {messages.length === 0 ? (
                          <div className="text-center text-slate-400 py-8">
                            <div className="text-4xl mb-2">{agent.avatar}</div>
                            <p>Start a conversation with {agent.name}</p>
                            <p className="text-sm mt-2">
                              Personality: {agent.personality}
                            </p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex gap-3 ${
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              {message.role === 'assistant' && (
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                                  style={{ backgroundColor: `${agent.color}20`, color: agent.color }}
                                >
                                  {agent.avatar}
                                </div>
                              )}
                              
                              <div
                                className={`max-w-[80%] rounded-lg p-3 ${
                                  message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-700 text-slate-100'
                                }`}
                              >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                  {message.audioUrl && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => playAudioStream(message.audioUrl!)}
                                      className="h-6 px-2 text-xs"
                                    >
                                      <Volume2 className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                              
                              {message.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm flex-shrink-0">
                                  <User className="w-4 h-4 text-slate-300" />
                                </div>
                              )}
                            </div>
                          ))
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      {/* Input Section */}
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={`Ask ${agent.name} anything...`}
                            className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 min-h-[60px] resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage(inputText);
                              }
                            }}
                          />
                          <div className="flex flex-col gap-2">
                            <Button
                              onClick={toggleListening}
                              variant={isListening ? "destructive" : "outline"}
                              size="icon"
                              disabled={!isConnected}
                              className="w-12 h-12"
                            >
                              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </Button>
                            <Button
                              onClick={() => sendMessage(inputText)}
                              disabled={!inputText.trim() || !isConnected || isProcessing}
                              className="w-12 h-12 bg-blue-600 hover:bg-blue-700"
                            >
                              <Play className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Press Enter to send • Shift+Enter for new line</span>
                          <span>•</span>
                          <span>Voice input: {isListening ? 'ON' : 'OFF'}</span>
                          <span>•</span>
                          <span>Streaming: Minimal latency</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Configuration Panel - 20% screen coverage */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Voice Selection */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Voice Selection
                  </label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {VOICE_OPTIONS.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id} className="text-white">
                          <div className="flex flex-col">
                            <span>{voice.name}</span>
                            <span className="text-xs text-slate-400">
                              {voice.accent} • {voice.gender}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio Controls */}
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Speech Speed: {speechSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2.0"
                    step="0.1"
                    value={speechSpeed}
                    onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Volume: {Math.round(volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <Separator className="bg-slate-600" />

                {/* API Configuration */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Configuration
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Murf AI API Key
                      </label>
                      <Input
                        type="password"
                        value={murfApiKey}
                        onChange={(e) => setMurfApiKey(e.target.value)}
                        placeholder="Enter Murf API key"
                        className="bg-slate-700 border-slate-600 text-white text-xs"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Azure OpenAI Key
                      </label>
                      <Input
                        type="password"
                        value={azureApiKey}
                        onChange={(e) => setAzureApiKey(e.target.value)}
                        placeholder="Enter Azure API key"
                        className="bg-slate-700 border-slate-600 text-white text-xs"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">
                        Azure Endpoint
                      </label>
                      <Input
                        value={azureEndpoint}
                        onChange={(e) => setAzureEndpoint(e.target.value)}
                        placeholder="https://your-endpoint.openai.azure.com"
                        className="bg-slate-700 border-slate-600 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Database Setup */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Database Setup
                  </h3>
                  
                  <div className="space-y-2 text-xs text-slate-400">
                    <p>• ChromaDB for vector storage</p>
                    <p>• 7-day authentication persistence</p>
                    <p>• User profile management</p>
                    <p>• Cultural knowledge base</p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-2 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    Setup Database
                  </Button>
                </div>

                <Separator className="bg-slate-600" />

                {/* Performance Status */}
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Performance
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Connection</span>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-slate-300">{isConnected ? 'Connected' : 'Offline'}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Streaming</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                        Minimal Latency
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Voice Engine</span>
                      <span className="text-slate-300">Murf AI</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
