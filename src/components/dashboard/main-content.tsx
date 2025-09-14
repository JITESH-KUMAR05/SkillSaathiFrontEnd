'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/store/chat-store';
import { MitraDashboard } from './agent-dashboards/mitra-dashboard';
import { GuruDashboard } from './agent-dashboards/guru-dashboard';
import { ParikshakDashboard } from './agent-dashboards/parikshak-dashboard';
import { WelcomeDashboard } from './welcome-dashboard';

const pageVariants = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -20, scale: 0.98 }
};

const pageTransition = {
  duration: 0.3
};

export function MainContent() {
  const { currentAgent } = useChatStore();

  const renderAgentDashboard = () => {
    switch (currentAgent) {
      case 'mitra':
        return <MitraDashboard />;
      case 'guru':
        return <GuruDashboard />;
      case 'parikshak':
        return <ParikshakDashboard />;
      default:
        return <WelcomeDashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentAgent || 'welcome'}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
        className="h-full"
      >
        {renderAgentDashboard()}
      </motion.div>
    </AnimatePresence>
  );
}
