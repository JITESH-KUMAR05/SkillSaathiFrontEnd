'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useConversationHistory, Conversation } from '@/store/conversation-history';
import { AgentType } from '@/types/modern';
import { cn } from '@/lib/utils';

interface ConversationHistorySidebarProps {
  currentAgent: AgentType;
  onConversationSelect: (conversation: Conversation) => void;
  onNewConversation: () => void;
  className?: string;
}

export function ConversationHistorySidebar({
  currentAgent,
  onConversationSelect,
  onNewConversation,
  className
}: ConversationHistorySidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const {
    conversations,
    currentConversationId,
    deleteConversation,
    updateConversationTitle,
    searchConversations,
    getConversationsByAgent,
    createConversation
  } = useConversationHistory();

  // Get conversations for current agent
  const agentConversations = searchQuery
    ? searchConversations(searchQuery).filter(conv => conv.agent === currentAgent)
    : getConversationsByAgent(currentAgent);

  // Sort by most recent
  const sortedConversations = agentConversations.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const handleStartEdit = (conversation: Conversation) => {
    setEditingId(conversation.id);
    setEditTitle(conversation.title);
  };

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateConversationTitle(editingId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this conversation?')) {
      deleteConversation(id);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ width: isExpanded ? 320 : 60 }}
      animate={{ width: isExpanded ? 320 : 60 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        "h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Chat History
              </h2>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isExpanded ? (
              <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-3 space-y-3"
          >
            {/* New Conversation Button */}
            <button
              onClick={onNewConversation}
              className="w-full flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>New Conversation</span>
            </button>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Conversations List */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex-1 overflow-y-auto p-2"
        >
          <AnimatePresence>
            {sortedConversations.length > 0 ? (
              sortedConversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={cn(
                    "mb-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 group",
                    currentConversationId === conversation.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  )}
                  onClick={() => onConversationSelect(conversation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {editingId === conversation.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit();
                              }}
                              className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelEdit();
                              }}
                              className="text-xs px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                            {conversation.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <ClockIcon className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(conversation.updatedAt)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              • {conversation.messages.length} messages
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {editingId !== conversation.id && (
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(conversation);
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title="Rename conversation"
                        >
                          <PencilIcon className="w-3 h-3 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conversation.id);
                          }}
                          className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                          title="Delete conversation"
                        >
                          <TrashIcon className="w-3 h-3 text-red-400" />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'No conversations found' : 'No conversations yet'}
                </p>
                <p className="text-xs mt-1">
                  {searchQuery ? 'Try a different search term' : 'Start chatting to see your history here'}
                </p>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Collapsed state - just the toggle */}
      {!isExpanded && (
        <div className="flex-1 flex flex-col items-center py-4 space-y-4">
          <button
            onClick={onNewConversation}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="New Conversation"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="w-6 h-6 mx-auto text-gray-400" />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 writing-mode-vertical text-orientation-mixed">
              History
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}