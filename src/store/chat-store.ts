import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AgentType, Message, ChatState, UserPreferences } from '@/types/modern';

interface ChatStore extends ChatState {
  // Actions
  setCurrentAgent: (agent: AgentType) => void;
  addMessage: (agent: AgentType, message: Omit<Message, 'id'>) => void;
  updateMessage: (agent: AgentType, messageId: string, updates: Partial<Message>) => void;
  clearMessages: (agent: AgentType) => void;
  clearAllMessages: () => void;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  setConnected: (connected: boolean) => void;
  
  // User preferences
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
}

export const useChatStore = create<ChatStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        messages: {
          mitra: [],
          guru: [],
          parikshak: [],
        },
        currentAgent: 'mitra',
        isLoading: false,
        isConnected: false,
        
        preferences: {
          theme: 'light',
          voice_enabled: true,
          voice_speed: 1.0,
          language: 'en-IN',
          auto_play_voice: true,
        },
        
        // Actions
        setCurrentAgent: (agent) => set({ currentAgent: agent }),
        
        addMessage: (agent, messageData) => {
          const message: Message = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ...messageData,
          };
          
          set((state) => ({
            messages: {
              ...state.messages,
              [agent]: [...state.messages[agent], message],
            },
          }));
        },
        
        updateMessage: (agent, messageId, updates) => {
          set((state) => ({
            messages: {
              ...state.messages,
              [agent]: state.messages[agent].map((msg) =>
                msg.id === messageId ? { ...msg, ...updates } : msg
              ),
            },
          }));
        },
        
        clearMessages: (agent) => {
          set((state) => ({
            messages: {
              ...state.messages,
              [agent]: [],
            },
          }));
        },
        
        clearAllMessages: () => {
          set({
            messages: {
              mitra: [],
              guru: [],
              parikshak: [],
            },
          });
        },
        
        clearHistory: () => {
          set({
            messages: {
              mitra: [],
              guru: [],
              parikshak: [],
            },
          });
        },
        
        setLoading: (loading) => set({ isLoading: loading }),
        setConnected: (connected) => set({ isConnected: connected }),
        
        updatePreferences: (updates) => {
          set((state) => ({
            preferences: { ...state.preferences, ...updates },
          }));
        },
      }),
      {
        name: 'buddyagents-chat-store',
        partialize: (state) => ({
          messages: state.messages,
          preferences: state.preferences,
          currentAgent: state.currentAgent,
        }),
      }
    ),
    { name: 'ChatStore' }
  )
);
