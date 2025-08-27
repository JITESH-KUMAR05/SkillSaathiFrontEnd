import apiClient from '@/lib/api';
import {
  Conversation,
  Message,
  ChatRequest,
  ChatResponse,
  CreateConversationRequest,
  UpdateConversationRequest,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const conversationsService = {
  async getConversations(page = 1, size = 20): Promise<PaginatedResponse<Conversation>> {
    const response = await apiClient.get<PaginatedResponse<Conversation>>(
      `/api/chat/conversations?skip=${(page - 1) * size}&limit=${size}`
    );
    return response.data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get<ApiResponse<Conversation>>(`/api/chat/conversations/${id}`);
    return response.data.data;
  },

  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post<ApiResponse<Conversation>>('/api/chat/conversations', data);
    return response.data.data;
  },

  async updateConversation(id: string, data: UpdateConversationRequest): Promise<Conversation> {
    const response = await apiClient.put<ApiResponse<Conversation>>(`/api/chat/conversations/${id}`, data);
    return response.data.data;
  },

  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/api/chat/conversations/${id}`);
  },

  async getMessages(conversationId: string, page = 1, size = 50): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      `/api/chat/conversations/${conversationId}/messages?skip=${(page - 1) * size}&limit=${size}`
    );
    return response.data;
  },
};
