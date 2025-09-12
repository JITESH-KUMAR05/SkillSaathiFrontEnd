import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useChatStore } from '@/store/chat-store';
import { AgentType, ChatRequest } from '@/types/modern';

export function useChat() {
  const { addMessage, setLoading, preferences } = useChatStore();
  const queryClient = useQueryClient();
  
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, agent }: { message: string, agent: AgentType }) => {
      const request: ChatRequest = {
        message,
        agent_type: agent,
        user_id: 'current_user', // Replace with actual user ID from auth
        voice_enabled: preferences.voice_enabled,
      };
      
      return apiService.sendMessage(request);
    },
    onMutate: ({ message, agent }) => {
      // Optimistically add user message
      addMessage(agent, {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      });
      setLoading(true);
    },
    onSuccess: (response, { agent }) => {
      // Add assistant response
      addMessage(agent, {
        role: 'assistant',
        content: response.response,
        timestamp: response.timestamp,
        agent,
      });
      
      // Generate voice if enabled
      if (response.audio_available && preferences.voice_enabled) {
        generateVoice(response.response, agent);
      }
    },
    onError: (error, { agent }) => {
      console.error('Chat error:', error);
      // Add error message
      addMessage(agent, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        agent,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });
  
  const generateVoice = async (text: string, agent: AgentType) => {
    try {
      const audioBlob = await apiService.generateVoice({
        text,
        agent_type: agent,
        user_id: 'current_user',
      });
      
      // Play audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
      
      // Cleanup
      audio.onended = () => URL.revokeObjectURL(audioUrl);
    } catch (error) {
      console.error('Voice generation error:', error);
    }
  };
  
  return {
    sendMessage: sendMessageMutation.mutate,
    isLoading: sendMessageMutation.isPending,
  };
}

// Hook for streaming chat (Azure OpenAI real-time responses)
export function useStreamingChat() {
  const { addMessage, updateMessage, setLoading } = useChatStore();
  
  const sendStreamingMessage = async (message: string, agent: AgentType) => {
    // Add user message
    addMessage(agent, {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    });
    
    // Add streaming assistant message
    const assistantMessageId = `${Date.now()}-assistant`;
    addMessage(agent, {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    });
    
    setLoading(true);
    
    try {
      const request = {
        message,
        agent_type: agent,
        user_id: 'current_user',
      };
      
      let accumulatedContent = '';
      
      // Stream response from Azure OpenAI
      for await (const chunk of apiService.streamChat(request)) {
        accumulatedContent += chunk;
        updateMessage(agent, assistantMessageId, {
          content: accumulatedContent,
        });
      }
      
      // Mark as complete
      updateMessage(agent, assistantMessageId, {
        isStreaming: false,
      });
      
    } catch (error) {
      console.error('Streaming error:', error);
      updateMessage(agent, assistantMessageId, {
        content: 'Sorry, I encountered an error. Please try again.',
        isStreaming: false,
      });
    } finally {
      setLoading(false);
    }
  };
  
  return { sendStreamingMessage };
}
