import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ChatRequest, ChatResponse, VoiceRequest, Agent, UserProfile, HealthResponse, AgentInfo, StreamChatRequest } from '@/types/modern';

class ApiService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 30000, // 30 seconds for Azure OpenAI responses
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Request interceptor for auth tokens
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }
  
  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get('/health');
    return response.data;
  }
  
  // Chat endpoints
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response: AxiosResponse<ChatResponse> = await this.client.post('/api/v1/chat/send', request);
    return response.data;
  }

  // Streaming chat (Server-Sent Events) for Azure OpenAI
  async *streamChat(request: StreamChatRequest): AsyncGenerator<string, void, unknown> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    if (!reader) return;
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content && parsed.content !== '[DONE]') {
                yield parsed.content;
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  // Voice/TTS endpoints (Murf AI)
  async generateVoice(request: VoiceRequest): Promise<Blob> {
    const response = await this.client.post('/api/v1/voice/generate', request, {
      responseType: 'blob', // Important for audio data
    });
    return response.data;
  }

  // Agent management
  async getAgents(): Promise<AgentInfo[]> {
    const response = await this.client.get('/api/v1/chat/agents');
    return response.data;
  }

  // User management
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await this.client.get(`/api/v1/users/${userId}/profile`);
    return response.data;
  }

  async updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
    const response = await this.client.put(`/api/v1/users/${userId}/profile`, profile);
    return response.data;
  }

  // User stats
  async getUserStats(userId: string): Promise<any> {
    const response = await this.client.get(`/api/v1/users/${userId}/stats`);
    return response.data;
  }  // Test Azure OpenAI connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const health = await this.healthCheck();
      return {
        success: true,
        message: `Connected successfully. Features: ${health.features.join(', ')}`
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
