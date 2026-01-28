# Math7 - Offline-First Educational Platform

## Overview

Math7 is an offline-first educational platform consisting of two applications:

1. **Student App** - A Flutter tablet application for K-12 students to practice curriculum content offline
2. **Admin Panel** - A React web dashboard for educators to manage curriculum and content

The platform enables students to learn without network connectivity while administrators can remotely manage and publish educational content. Data synchronizes when connectivity is restored.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Student App (Flutter)**
- Framework: Flutter (tablet-first, targets iOS/Android tablets)
- State Management: Riverpod only (no mixing with Provider/BLoC)
- Local Database: Drift (SQLite) for offline-first data storage
- Sync Pattern: Outbox pattern for queuing offline changes
- Auth: Anonymous device-bound authentication (no login UI for students)

**Admin Panel (React)**
- Framework: React 18 with TypeScript
- Build Tool: Vite 5
- State Management: React Query v5 for server state, React Context for UI state only
- UI Components: shadcn/ui (Radix-based) with Tailwind CSS
- Forms: react-hook-form with Zod validation
- Auth: Supabase Auth with email/password login

### Backend Architecture

- Platform: Supabase (PostgreSQL 15+)
- Authentication: Supabase Auth handling both admin and student users
- Security: Row Level Security (RLS) enforced at database level, not UI
- API: Auto-generated REST endpoints plus custom RPC functions
- Data Integrity: All tables have `updated_at` and `deleted_at` columns for differential sync and soft deletes

### Data Model

Core entities follow a curriculum hierarchy:
- **Profiles** - User identity extending Supabase auth.users with role (admin/student)
- **Domains** - Top-level subjects (Mathematics, Physics, etc.)
- **Skills** - Specific topics within domains
- **Questions** - Quiz content with JSONB for flexible answer structures
- **Attempts** - Student answer submissions
- **Sessions** - Practice session tracking
- **Skill Progress** - Aggregated mastery levels

Sync infrastructure:
- **Outbox** - Client-side pending operations queue
- **Sync Meta** - Sync watermarks and conflict resolution
- **Curriculum Meta** - Version tracking for content updates

### Development Phases

The project follows a phased development approach tracked in `PHASE_STATE.json`:
- Phase -1: Environment validation
- Phase 0: Project bootstrap
- Phase 1: Data model and contracts (migrations)
- Phase 2: Student app core loop
- Phase 3: Admin panel MVP
- Phase 4: Hardening

## External Dependencies

### Supabase Backend
- PostgreSQL database with RLS policies
- Supabase Auth for authentication
- Edge Functions for serverless logic
- Realtime subscriptions for live updates

### Student App Dependencies
- `supabase_flutter` - Backend client
- `drift` + `sqlite3_flutter_libs` - Local SQLite database
- `flutter_riverpod` - State management
- `flutter_secure_storage` - Session persistence
- `connectivity_plus` - Network status detection
- `sentry_flutter` - Error tracking

### Admin Panel Dependencies
- `@supabase/supabase-js` - Backend client
- `@tanstack/react-query` - Server state management
- `react-router-dom` - Routing
- `@sentry/react` - Error tracking
- Radix UI primitives - Accessible UI components

### Environment Configuration
Environment variables required (see `.env.example` files):
- `SUPABASE_URL` / `VITE_SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SENTRY_DSN` / `VITE_SENTRY_DSN` - Error tracking (optional)