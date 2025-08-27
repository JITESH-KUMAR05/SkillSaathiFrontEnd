import apiClient from '@/lib/api';
import {
  ChatRequest,
  ChatResponse,
  ApiResponse,
} from '@/types';

export const chatService = {
  async sendMessage(data: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ApiResponse<ChatResponse>>('/api/chat', data);
    return response.data.data;
  },

  async getRAGSuggestions(query: string): Promise<any[]> {
    const response = await apiClient.get(`/knowledge/search?query=${encodeURIComponent(query)}`);
    return response.data.results || [];
  },
};
