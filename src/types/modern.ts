// Modern Types for BuddyAgents - Azure OpenAI Integration

// Agent Types
export type AgentType = 'mitra' | 'guru' | 'parikshak';

export interface Agent {
  id: AgentType;
  name: string;
  displayName: string;
  emoji: string;
  description: string;
  color: string;
  role: string;
  capabilities: string[];
  voiceId: string;
}

// Message Types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agent?: AgentType;
  audioUrl?: string;
  isStreaming?: boolean;
}

// API Response Types
export interface ChatResponse {
  response: string;
  agent_type: AgentType;
  voice_id: string;
  voice_info: {
    name: string;
    language: string;
    gender: string;
  };
  timestamp: string;
  audio_available: boolean;
}

// Chat Request Type
export interface ChatRequest {
  message: string;
  agent_type: AgentType;
  user_id: string;
  voice_enabled: boolean;
}

// Streaming Chat Request
export interface StreamChatRequest {
  message: string;
  agent_type: AgentType;
  user_id: string;
}

// Voice Types
export interface VoiceRequest {
  text: string;
  agent_type: AgentType;
  user_id: string;
}

// User Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  created_at: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  voice_enabled: boolean;
  voice_speed: number;
  language: 'en-IN' | 'hi-IN' | 'bn-IN' | 'ta-IN';
  auto_play_voice: boolean;
}

// UI State Types  
export interface ChatState {
  messages: Record<AgentType, Message[]>;
  currentAgent: AgentType;
  isLoading: boolean;
  isConnected: boolean;
}

// WebRTC Types (for Parikshak video interviews)
export interface VideoCallState {
  isActive: boolean;
  isConnecting: boolean;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  peer?: any; // SimplePeer instance
}

// Interview Session Types
export interface InterviewSession {
  id: string;
  agent: 'parikshak';
  startTime: string;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  responses: InterviewResponse[];
  status: 'active' | 'completed' | 'paused';
  metrics: InterviewMetrics;
}

export interface InterviewQuestion {
  id: string;
  type: 'behavioral' | 'technical' | 'situational';
  question: string;
  expectedDuration: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewResponse {
  questionId: string;
  response: string;
  duration: number;
  timestamp: string;
  confidence_score?: number;
  technical_accuracy?: number;
}

export interface InterviewMetrics {
  overall_score: number;
  communication_score: number;
  technical_score: number;
  confidence_level: number;
  eye_contact_percentage: number;
  speaking_pace: number; // words per minute
  filler_words_count: number;
}

// API Health Response
export interface HealthResponse {
  status: string;
  features: string[];
}

// Agent Info Response
export interface AgentInfo {
  agent_type: AgentType;
  voice_id: string;
  voice_name: string;
  description: string;
  language: string;
}
