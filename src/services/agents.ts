import apiClient from '@/lib/api';
import {
  Agent,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

export const agentsService = {
  async getAgents(): Promise<Agent[]> {
    const response = await apiClient.get<ApiResponse<Agent[]>>('/api/agents');
    return response.data.data;
  },

  async getAgent(id: string): Promise<Agent> {
    const response = await apiClient.get<ApiResponse<Agent>>(`/api/agents/${id}`);
    return response.data.data;
  },

  async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    const response = await apiClient.post<ApiResponse<Agent>>('/api/agents', agentData);
    return response.data.data;
  },

  async updateAgent(id: string, agentData: Partial<Agent>): Promise<Agent> {
    const response = await apiClient.put<ApiResponse<Agent>>(`/api/agents/${id}`, agentData);
    return response.data.data;
  },

  async deleteAgent(id: string): Promise<void> {
    await apiClient.delete(`/api/agents/${id}`);
  },
};
