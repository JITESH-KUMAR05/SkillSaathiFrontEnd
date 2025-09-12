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
  agent?: Agent;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  role: 'user' | 'assistant';
  metadata: Record<string, any>;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  filename: string;
  content: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// Chat types
export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  message_id: string;
}

// Form types
export interface CreateConversationRequest {
  agent_id: string;
  title?: string;
}

export interface UpdateConversationRequest {
  title: string;
}

// UI types
export interface AgentCard {
  id: string;
  name: string;
  type: Agent['type'];
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isLoading?: boolean;
}

export interface ConversationSummary {
  id: string;
  title: string;
  agentName: string;
  agentType: Agent['type'];
  lastMessage: string;
  lastMessageTime: string;
  messageCount: number;
}
