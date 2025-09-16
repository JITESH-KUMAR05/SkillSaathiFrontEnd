# Copilot Instructions for SkillSaathiFrontEnd

## Project Overview
- **Framework**: Next.js (App Router, TypeScript)
- **UI**: Tailwind CSS, Radix UI, Headless UI
- **State**: React Context, React Query
- **Purpose**: Multi-agent AI companion platform for personal development, interviews, and conversations.

## Key Architecture & Patterns
- **App Directory**: All routing and page logic is under `src/app/` (Next.js 13+ App Router). Use nested folders for route segments and layouts.
- **Agents**: Each agent has its own route under `src/app/agents/[agentId]/page.tsx`.
- **Interview Features**: Video and chat interview logic is in `src/app/interview/` and `src/components/interview/`.
- **Reusable UI**: Place new UI elements in `src/components/ui/` and feature-specific UI in `src/components/features/`.
- **API Services**: All API calls and business logic are in `src/services/` and `src/lib/api.ts`.
- **State/Context**: Use `src/contexts/` for React Contexts. Use `src/store/` for stateful logic (e.g., chat store).
- **Types**: Centralize types in `src/types/`.

## Developer Workflows
- **Start Dev Server**: `npm run dev` (http://localhost:3000)
- **Build for Production**: `npm run build` then `npm start`
- **Lint/Type Check**: `npm run lint`, `npm run type-check`
- **Start Script**: `./start_frontend.sh` (Linux/macOS)
- **Environment**: Set variables in `.env.local` (see README for required keys)

## Project Conventions
- **Component Naming**: Use PascalCase for components. Place feature-specific components in their respective folders.
- **API Calls**: Use `src/services/` for all backend communication. Never call APIs directly from components.
- **Styling**: Use Tailwind utility classes. Add global styles to `src/app/globals.css`.
- **Type Safety**: All code must be TypeScript. Define shared types in `src/types/`.
- **Protected Routes**: Place protected pages in `src/app/(app)/`.
- **Agent Config**: Agent metadata/config is in `src/config/agents.ts`.

## Integration & Communication
- **Backend**: Expects API at `NEXT_PUBLIC_API_BASE_URL` (default: http://localhost:8000)
- **WebSocket**: For real-time features, use the WebSocket URL from env vars.
- **Cross-Component State**: Use React Context or stores in `src/store/`.

## Examples
- **Add a new agent**: Update `src/config/agents.ts` and add a new page under `src/app/agents/[agentId]/page.tsx`.
- **Add a new feature**: Create a component in `src/components/features/` and expose it via a route in `src/app/`.
- **API call pattern**: Use `src/services/api.ts` or create a new service in `src/services/`.

## References
- See `README.MD` for setup, scripts, and troubleshooting.
- See `src/app/`, `src/components/`, and `src/services/` for main code structure.

---

**For AI agents:**
- Follow the above conventions for all code generation and refactoring.
- Prefer existing patterns and file locations over inventing new ones.
- If unsure about a pattern, check for similar examples in the referenced folders.
