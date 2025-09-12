'use client';

import { useChatStore } from '@/store/chat-store';
import { MitraDashboard } from './agent-dashboards/mitra-dashboard';
import { GuruDashboard } from './agent-dashboards/guru-dashboard';
import { ParikshakDashboard } from './agent-dashboards/parikshak-dashboard';
import { WelcomeDashboard } from './welcome-dashboard';

export function MainContent() {
  const { currentAgent } = useChatStore();

  if (!currentAgent) {
    return <WelcomeDashboard />;
  }

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
}
