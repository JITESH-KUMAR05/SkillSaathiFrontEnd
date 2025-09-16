
# Copilot Instructions for SkillSaathiFrontEnd

## Project Overview
- **Framework**: Next.js (App Router, TypeScript)
- **UI**: Tailwind CSS, Radix UI, Headless UI
- **State**: React Context, Zustand, React Query
- **Purpose**: Multi-agent AI companion platform for personal development, interviews, and chat.

## Architecture & Patterns
- **Routing**: All routes use the App Router (`src/app/`). Protected routes are under `src/app/(app)/`. Each agent has a dynamic route: `src/app/agents/[agentId]/page.tsx`.
- **Agents**: Agent metadata/config is in `src/config/agents.ts`. Add new agents by updating this file and creating a corresponding page.
- **Chat & Interview**: Chat logic is in `src/store/chat-store.ts` (Zustand) and `src/hooks/use-chat.ts`. Video interview and advanced chat UIs are in `src/components/interview/` and `src/app/interview/`.
- **API Layer**: All backend/API calls go through `src/services/` (e.g., `api.ts`, `chat.ts`, `auth.ts`). Never call APIs directly from components.
- **WebSocket**: Real-time chat uses WebSocket (see `src/lib/useAgentChat.ts`). WebSocket URL is set via env vars.
- **UI Components**: Place reusable UI in `src/components/ui/`. Feature-specific UI goes in `src/components/features/`.
- **Types**: Centralize all types in `src/types/` (see `modern.ts` for agent/chat types).
- **Auth**: Auth logic is in `src/contexts/AuthContext.tsx` and `src/services/auth.ts`.

## Developer Workflows
- **Start Dev Server**: `npm run dev` (http://localhost:3000)
- **Production Build**: `npm run build` then `npm start`
- **Lint/Type Check**: `npm run lint`, `npm run type-check`
- **Start Script**: `./start_frontend.sh` (Linux/macOS)
- **Env Vars**: Set required variables in `.env.local` (see README for details)

## Project Conventions
- **Component Naming**: Use PascalCase. Place feature-specific components in their folders.
- **API Calls**: Use services in `src/services/`. Never call APIs directly from UI.
- **Styling**: Use Tailwind utility classes. Add global styles to `src/app/globals.css`.
- **Type Safety**: All code must be TypeScript. Shared types in `src/types/`.
- **State**: Use React Context for auth/global state, Zustand for chat, React Query for async data.
- **Agent/Persona**: Use `src/config/agents.ts` for agent config and persona tips.

## Integration & Communication
- **Backend**: Expects API at `NEXT_PUBLIC_API_BASE_URL` (default: http://localhost:8000)
- **WebSocket**: For real-time chat, use the WebSocket URL from env vars.
- **Cross-Component State**: Use React Context or Zustand stores in `src/store/`.

## Examples
- **Add a new agent**: Update `src/config/agents.ts` and add a new page under `src/app/agents/[agentId]/page.tsx`.
- **Add a new feature**: Create a component in `src/components/features/` and expose it via a route in `src/app/`.
- **API call**: Use `src/services/api.ts` or create a new service in `src/services/`.
- **Chat logic**: Use `useChatStore` from `src/store/chat-store.ts` and hooks in `src/hooks/`.

## References
- See `README.MD` for setup, scripts, and troubleshooting.
- See `src/app/`, `src/components/`, and `src/services/` for main code structure.

---

**For AI agents:**
- Follow these conventions for all code generation and refactoring.
- Prefer existing patterns and file locations over inventing new ones.
- If unsure about a pattern, check for similar examples in the referenced folders.
