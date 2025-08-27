import { useState, useEffect, useRef, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agent?: string;
  createdAt: number;
}

interface UseAgentChatOptions {
  agentId: string;
  voice: string;
  wsUrl?: string;
  autoReconnect?: boolean;
}

export function useAgentChat({ agentId, voice, wsUrl = 'ws://localhost:8000/ws', autoReconnect = true }: UseAgentChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number | null>(null);

  const append = useCallback((m: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    setMessages(prev => [...prev, { ...m, id: crypto.randomUUID(), createdAt: Date.now() }]);
  }, []);

  const connect = useCallback(() => {
    try {
      // Close existing connection if any
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close();
      }
      
      setLoading(true);
      setError(null);
      
      console.log('Attempting to connect to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn('WebSocket connection timeout');
          ws.close();
          setError('Connection timeout. Please check if the server is running.');
          setLoading(false);
        }
      }, 10000); // 10 second timeout
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully to:', wsUrl);
        clearTimeout(connectionTimeout); // Clear the timeout
        setConnected(true);
        setLoading(false);
        setError(null);
        append({ role: 'system', content: `Connected to ${agentId} agent session.`, agent: agentId });
        
        // Send a ping to test the connection
        ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now()
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          if (data.type === 'agent_response') {
            append({ role: 'agent', content: data.message, agent: data.agent });
          } else if (data.type === 'audio_url') {
            const audio = new Audio(data.url);
            audio.play().catch(() => {
              console.warn('Could not play audio');
            });
          } else if (data.type === 'pong') {
            console.log('Received pong from server at:', data.timestamp);
          } else if (data.type === 'status') {
            console.log('Server status:', data.content);
            append({ role: 'system', content: data.content, agent: agentId });
          } else if (data.type === 'error') {
            console.error('Server error:', data.content);
            setError(data.content);
          }
        } catch (e) {
          console.warn('Non-JSON message received:', event.data);
        }
      };
      
      ws.onerror = (error: Event) => {
        clearTimeout(connectionTimeout); // Clear the timeout
        const errorDetails = {
          type: 'WebSocket Error',
          error: error,
          readyState: ws.readyState,
          url: wsUrl,
          timestamp: new Date().toISOString(),
          readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][ws.readyState]
        };
        console.error('WebSocket error details:', errorDetails);
        setError(`WebSocket connection error to ${wsUrl}. ReadyState: ${errorDetails.readyStateText}`);
        setLoading(false);
      };
      
      ws.onclose = (event) => {
        clearTimeout(connectionTimeout); // Clear the timeout
        const closeInfo = {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        };
        console.log('WebSocket closed:', closeInfo);
        setConnected(false);
        setLoading(false);
        
        // Common close codes
        const closeReasons: Record<number, string> = {
          1000: 'Normal closure',
          1001: 'Going away',
          1002: 'Protocol error',
          1003: 'Unsupported data',
          1006: 'Abnormal closure',
          1011: 'Server error',
          1012: 'Service restart',
          1013: 'Try again later',
          1014: 'Bad gateway',
          1015: 'TLS handshake'
        };
        
        const closeReason = closeReasons[event.code] || `Unknown (${event.code})`;
        
                // Only attempt reconnection if it wasn't a clean close and autoReconnect is enabled
        if (autoReconnect && event.code !== 1000 && event.code !== 1001) {
          setError(`Connection lost: ${closeReason}. Attempting to reconnect...`);
          // Add a small delay before reconnecting to avoid rapid reconnection attempts
          if (reconnectRef.current) {
            clearTimeout(reconnectRef.current);
          }
          reconnectRef.current = window.setTimeout(() => {
            connect();
          }, 2000); // Wait 2 seconds before reconnecting
        } else {
          setError(`Connection closed: ${closeReason}`);
        }
      };
    } catch (e: any) {
      console.error('Failed to create WebSocket:', e);
      setError(e.message || 'Failed to connect');
      setLoading(false);
    }
  }, [agentId, wsUrl, autoReconnect, append]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) {
        window.clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
        wsRef.current.close(1000, 'Component unmounting');
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: string) => {
    console.log('Attempting to send message:', message);
    if (!message.trim()) {
      console.error('Cannot send an empty message.');
      return;
    }
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'user_message',
        message,
        agent: agentId,
        voice,
        timestamp: Date.now()
      };
      console.log('Sending payload:', payload);
      wsRef.current.send(JSON.stringify(payload));
      append({ role: 'user', content: message, agent: agentId });
    } else {
      console.error('WebSocket is not connected.');
    }
  }, [agentId, voice, append]);

  return { messages, connected, error, loading, send: sendMessage, connect };
}
