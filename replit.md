# Chick-Fil-A Flag Football Score Tracker

## Overview

A real-time flag football score tracking application for the Chick-Fil-A team in the 2026 Winter Season of City of Charleston Recreation. The app allows tracking of game scores, individual player statistics (touchdowns, catches, flag pulls, etc.), and provides season-wide statistics aggregation. Features both admin and spectator view modes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS v4 with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` for route-level components
- Reusable UI components in `client/src/components/ui/` (shadcn/ui)
- Custom hooks in `client/src/hooks/`
- API utilities in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Pattern**: RESTful API with JSON responses
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration

API endpoints follow REST conventions:
- `GET /api/games` - List all games
- `GET /api/games/:id` - Get single game
- `POST /api/games` - Create game
- `PATCH /api/games/:id` - Update game
- `DELETE /api/games/:id` - Delete game

### Data Storage
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - shared between frontend and backend
- **Migrations**: Drizzle Kit with `drizzle-kit push` command

Key data models:
- `users` - Basic user table with id, username, password
- `games` - Game records with scores, opponent, playerStats as JSONB, coachCommentary as JSONB array, and aiHighlights text

### AI Features
- **Voice-Controlled Play Tracking**: Speak plays naturally ("Davis to Olson touchdown") and AI automatically updates stats
- **Speech-to-Text**: OpenAI integration transcribes voice recordings (gpt-4o-mini-transcribe)
- **AI Play Parser**: Parses transcribed speech into structured play data (QB, receiver, runner, defender, result)
- **Player Alias Matching**: Matches first names, last names, nicknames, jersey numbers to roster names
- **Supported Play Types**: Pass (catch, first down, TD, incomplete, interception, drop), Run (run, first down), Defense (flag pull, interception, sack), Conversions (XP, 2PT)
- **Descriptive Notes**: AI extracts colorful details (one-handed, diving) and saves as player notes
- **AI Highlights**: When games are marked FINAL, AI generates player highlight summaries
- **Integration**: Uses Replit AI Integrations (gpt-4o-mini-transcribe for STT, gpt-4o-mini for play parsing and highlights)
- **iOS Safari Compatibility**: When separate audio recording fails (common on iOS Safari), the system falls back to extracting audio from the video file server-side using ffmpeg

### Code Organization
- `client/` - Frontend React application
- `server/` - Express backend
- `shared/` - Shared types and schemas (Drizzle schema, Zod validators)
- `db/` - Database connection setup

## External Dependencies

### Database
- PostgreSQL database required (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for database operations
- `connect-pg-simple` for session storage capability

### UI Framework
- shadcn/ui components (Radix UI primitives)
- Tailwind CSS for styling
- Lucide React for icons

### Development Tools
- Vite for frontend build and dev server
- TSX for running TypeScript server directly
- esbuild for production server bundling

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal` for error display
- `@replit/vite-plugin-cartographer` for dev tooling
- `@replit/vite-plugin-dev-banner` for development mode indicator
- Custom `vite-plugin-meta-images` for OpenGraph image handling