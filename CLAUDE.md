# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Next.js with Turbopack)
- **Build**: `npm run build` (production build with Turbopack)  
- **Start**: `npm start` (runs production server)
- **Lint**: `npm run lint` (ESLint)
- **Database seed**: `npx prisma db seed` or `npm run prisma:seed` (uses tsx to run prisma/seed.ts)

## Architecture Overview

This is a collaborative task management application (TaskFlow) built with the T3 stack pattern:

### Core Stack
- **Next.js 15**: App Router with Server Components, uses Turbopack for development
- **tRPC**: Type-safe API layer with full-stack type safety
- **Prisma**: ORM with SQLite database (dev.db)
- **React Query/TanStack Query**: Client-side state management and caching
- **Zod**: Schema validation for API endpoints and forms
- **Tailwind CSS 4**: Styling (with PostCSS)

### Database Schema
- **Users**: Basic user model (id, email, name)
- **Tasks**: Core task entity with status (TODO/IN_PROGRESS/DONE), priority (LOW/MEDIUM/HIGH/URGENT), assignee relationship
- **Comments**: Task comments with author relationship

### Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/
│   └── providers/         # React Query & tRPC providers
├── lib/
│   ├── db.ts             # Prisma client singleton
│   ├── trpc.ts           # tRPC React client setup
│   └── validations.ts    # Zod schemas for API validation
└── server/
    └── api/
        ├── root.ts       # Main tRPC router
        ├── trpc.ts       # tRPC configuration & context
        └── routers/      # Feature-specific API routes
            ├── tasks.ts
            └── users.ts
```

### tRPC API Structure
- All procedures use `publicProcedure` (no authentication implemented)
- Input validation through Zod schemas
- Full type safety from server to client
- API endpoint: `/api/trpc`

### Key Configuration
- TypeScript path mapping: `@/*` points to `src/*`
- SuperJSON transformer for serialization
- React Query devtools enabled in development
- Database URL configured via environment variable