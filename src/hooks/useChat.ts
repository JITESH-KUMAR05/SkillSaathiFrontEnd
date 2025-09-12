import { useState } from 'react';
import { useChatStore } from '@/store/chat-store';
import { AgentType } from '@/types/modern';

export function useChat() {
  const { addMessage, setLoading } = useChatStore();
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

      // Create a temporary message for streaming
      const tempMessageId = `temp-${Date.now()}`;
      addMessage(agent, {
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
        agent,
        isStreaming: true,
      });

      // Send to backend
      const response = await fetch(`/api/chat/${agent}/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
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
              if (data === '[DONE]') {
                // Update final message
                addMessage(agent, {
                  role: 'assistant',
                  content: accumulatedContent,
                  timestamp: new Date().toISOString(),
                  agent,
                  isStreaming: false,
                });
                return;
              }
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  accumulatedContent += parsed.content;
                  // Update streaming message
                  addMessage(agent, {
                    role: 'assistant',
                    content: accumulatedContent,
                    timestamp: new Date().toISOString(),
                    agent,
                    isStreaming: true,
                  });
                }
              } catch (e) {
                // Ignore parsing errors for streaming data
              }
            }
          }
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
