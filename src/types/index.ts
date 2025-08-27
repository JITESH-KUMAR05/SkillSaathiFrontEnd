// Types for the multi-agent system

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'research' | 'creative' | 'coding' | 'general' | 'companion' | 'mentor' | 'interview';
  description: string;
  system_prompt: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  agent_id: string;
  title: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
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
