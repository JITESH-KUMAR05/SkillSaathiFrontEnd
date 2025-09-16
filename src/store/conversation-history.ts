import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { AgentType, Message } from '@/types/modern';

export interface Conversation {
  id: string;
  title: string;
  agent: AgentType;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

interface ConversationHistoryStore {
  conversations: Conversation[];
  currentConversationId: string | null;
  
  // Actions
  createConversation: (agent: AgentType, title?: string) => string;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessageToConversation: (id: string, message: Message) => void;
  updateConversationTitle: (id: string, title: string) => void;
  setCurrentConversation: (id: string | null) => void;
  searchConversations: (query: string) => Conversation[];
  getConversationsByAgent: (agent: AgentType) => Conversation[];
  generateConversationTitle: (messages: Message[]) => string;
  autoSaveCurrentConversation: (agent: AgentType, messages: Message[]) => void;
}

const generateTitleFromMessages = (messages: Message[]): string => {
  // Find the first user message
  const firstUserMessage = messages.find(m => m.role === 'user');
  if (!firstUserMessage) return 'New Conversation';
  
  // Extract meaningful words from the first message
  const content = firstUserMessage.content.trim();
  if (content.length <= 50) return content;
  
  // Truncate to first sentence or 50 characters
  const firstSentence = content.split(/[.!?]/)[0];
  return firstSentence.length <= 50 ? firstSentence : content.substring(0, 47) + '...';
};

export const useConversationHistory = create<ConversationHistoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        conversations: [],
        currentConversationId: null,
        
        createConversation: (agent, title) => {
          const id = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const conversation: Conversation = {
            id,
            title: title || 'New Conversation',
            agent,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          set(state => ({
            conversations: [conversation, ...state.conversations],
            currentConversationId: id
          }));
          
          return id;
        },
        
        updateConversation: (id, updates) => {
          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === id
                ? { ...conv, ...updates, updatedAt: new Date() }
                : conv
            )
          }));
        },
        
        deleteConversation: (id) => {
          set(state => ({
            conversations: state.conversations.filter(conv => conv.id !== id),
            currentConversationId: state.currentConversationId === id ? null : state.currentConversationId
          }));
        },
        
        addMessageToConversation: (id, message) => {
          set(state => ({
            conversations: state.conversations.map(conv =>
              conv.id === id
                ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date()
                }
                : conv
            )
          }));
        },
        
        updateConversationTitle: (id, title) => {
          get().updateConversation(id, { title });
        },
        
        setCurrentConversation: (id) => {
          set({ currentConversationId: id });
        },
        
        searchConversations: (query) => {
          const lowercaseQuery = query.toLowerCase();
          return get().conversations.filter(conv =>
            conv.title.toLowerCase().includes(lowercaseQuery) ||
            conv.messages.some(msg => 
              msg.content.toLowerCase().includes(lowercaseQuery)
            ) ||
            conv.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
          );
        },
        
        getConversationsByAgent: (agent) => {
          return get().conversations.filter(conv => conv.agent === agent);
        },
        
        generateConversationTitle: (messages) => {
          return generateTitleFromMessages(messages);
        },
        
        autoSaveCurrentConversation: (agent, messages) => {
          const state = get();
          const currentId = state.currentConversationId;
          
          if (messages.length === 0) return;
          
          if (currentId) {
            // Update existing conversation
            const conversation = state.conversations.find(c => c.id === currentId);
            if (conversation) {
              // Auto-update title if it's still "New Conversation" and we have enough messages
              const shouldUpdateTitle = conversation.title === 'New Conversation' && messages.length >= 2;
              const updates: Partial<Conversation> = {
                messages,
                updatedAt: new Date()
              };
              
              if (shouldUpdateTitle) {
                updates.title = generateTitleFromMessages(messages);
              }
              
              state.updateConversation(currentId, updates);
            }
          } else if (messages.length > 0) {
            // Create new conversation
            const title = generateTitleFromMessages(messages);
            const id = state.createConversation(agent, title);
            state.updateConversation(id, { messages });
          }
        }
      }),
      {
        name: 'conversation-history',
        version: 1,
      }
    ),
    { name: 'ConversationHistory' }
  )
);