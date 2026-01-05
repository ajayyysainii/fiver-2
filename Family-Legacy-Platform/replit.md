# FamilyLegacy Platform

## Overview

FamilyLegacy Platform is a software distribution system that follows a strict "no hosting, no data storage" principle. The platform distributes self-hosted software packages to users who must set up their own infrastructure (hosting, domain, database). It operates a marketplace for posting and messaging only—no transactions, payments processing, or shopping cart functionality within the distributed software.

The platform has two user types:
- **Family users**: Pay a one-time platform fee + monthly license for full software package access
- **Professional (Pro) users**: Pay a higher onboarding fee + tiered monthly plans (Gold/Platinum/Uranium) for marketplace module access only

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme configuration (corporate blue color scheme)
- **Fonts**: Inter (body) and Outfit (display) via Google Fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Build Process**: Custom build script using esbuild for server bundling and Vite for client

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` with models in `shared/models/`
- **Migrations**: Drizzle Kit with output to `./migrations`
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

### Authentication
- **Provider**: Replit Auth using OpenID Connect
- **Session Management**: Express-session with PostgreSQL store
- **User Storage**: Mandatory `users` and `sessions` tables for Replit Auth integration
- **Protected Routes**: `isAuthenticated` middleware for API route protection

### Key Design Patterns
- **Shared Types**: Common types and schemas in `shared/` directory accessible by both client and server
- **Path Aliases**: `@/` for client source, `@shared/` for shared modules
- **Storage Abstraction**: `IStorage` interface pattern for database operations
- **Mock Fallbacks**: Client-side mock data support for development when backend endpoints aren't ready

## External Dependencies

### Database
- PostgreSQL (required, connection via `DATABASE_URL` environment variable)
- Drizzle ORM for type-safe database operations
- connect-pg-simple for session persistence

### Authentication
- Replit Auth (OpenID Connect) - requires `ISSUER_URL`, `REPL_ID`, and `SESSION_SECRET` environment variables
- Passport.js with OpenID Client strategy

### UI/Component Libraries
- Radix UI primitives (extensive component set)
- shadcn/ui configuration in `components.json`
- Lucide React for icons
- class-variance-authority for component variants

### Development Tools
- Vite dev server with HMR
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)
- TypeScript with strict mode enabled