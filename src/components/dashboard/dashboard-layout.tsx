'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './sidebar';
import { MainContent } from './main-content';
import { useChatStore } from '@/store/chat-store';
import { cn } from '@/lib/utils';

export function DashboardLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { currentAgent } = useChatStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <motion.div
        initial={{ width: 280 }}
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex-shrink-0 border-r border-gray-200 bg-white shadow-sm"
      >
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentAgent ? (
                  <span className="flex items-center space-x-2">
                    <span className="capitalize">{currentAgent}</span>
                    <span className="text-sm text-gray-500">Dashboard</span>
                  </span>
                ) : (
                  'BuddyAgents Dashboard'
                )}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Azure OpenAI Ready</span>
              </div>
              
              {/* Voice Status */}
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700">Murf AI Voice</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-hidden">
          <MainContent />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {!isSidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
