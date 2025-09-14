import { useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { AgentType } from '@/types/modern';

export function useChat() {
  const { addMessage, updateMessage, setLoading } = useChatStore();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (agent: AgentType, content: string) => {
    try {
      setError(null);
      setLoading(true);

      // Add user message
      addMessage(agent, {
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
        agent,
      });

      // Create a temporary message for streaming and get its ID
      const streamingMessageId = addMessage(agent, {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        agent,
        isStreaming: true,
      });

      // Send to backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content,
          agent_type: agent,
          user_id: 'current_user'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream');
      }

      let accumulatedContent = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim() === '' || data === '[DONE]') {
                continue;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.chunk) {
                  accumulatedContent += parsed.chunk;
                  // Update the existing streaming message
                  updateMessage(agent, streamingMessageId, {
                    content: accumulatedContent,
                    isStreaming: true,
                  });
                } else if (parsed.done) {
                  // Mark as complete
                  updateMessage(agent, streamingMessageId, {
                    content: accumulatedContent,
                    isStreaming: false,
                  });
                  return;
                }
              } catch (e) {
                // Ignore parsing errors for streaming data
              }
            }
          }
        }
        
        // If we reach here, mark the final message as complete
        if (accumulatedContent) {
          updateMessage(agent, streamingMessageId, {
            content: accumulatedContent,
            isStreaming: false,
          });
        }
        
      } finally {
        reader.releaseLock();
      }

    } catch (err) {
      console.error('Chat error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Add error message
      addMessage(agent, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        agent,
        isStreaming: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    error,
  };
}
