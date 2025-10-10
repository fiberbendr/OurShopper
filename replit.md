# OurShopper - Shared Purchase Tracker

## Overview

OurShopper is a mobile-first web application designed for couples and households to track and share purchases in real-time. The app focuses on fast, frictionless entry of purchase data with instant synchronization across devices. Built with a utility-focused design approach prioritizing data clarity and scannability, it enables users to quickly log purchases, view spending patterns, and maintain household financial awareness.

## Recent Changes

### October 10, 2025 - Place Dropdown & HSA Payment Type
- **Place Field Enhancement**: Changed from free-form text input to dropdown with predefined locations:
  - Acme, Arbys, Chik Fil A, Chiropractor, Cornerstone Presbyterian Church, Dollar Tree, Farmers Market, Harvest Market, Once Upon A Child, Zingos
  - Added "Other" option with conditional text input for custom locations
  - Maintains form validation requiring place to be filled when "Other" is selected
- **Payment Type Addition**: Added "HSA" to payment type options (joining Citi x8215, Chase x4694, WSFS debit, Other debit, Check, Cash)
- **Implementation Details**:
  - Updated `shared/schema.ts` to validate place as non-empty string
  - Modified `AddPurchaseSheet.tsx` to use Select component for place dropdown
  - Conditional rendering shows text input when "Other" place is selected
  - React Hook Form properly validates custom place values

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript using Vite as the build tool
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** TanStack Query (React Query) for server state
- **UI Components:** Shadcn/ui with Radix UI primitives
- **Styling:** Tailwind CSS with custom design system

**Design System:**
The application implements a utility-focused design system inspired by Linear and modern fintech apps. Key decisions:
- Mobile-first approach with thumb-friendly interactions
- Dark mode as primary with comprehensive light mode support
- Custom color palette optimized for purchase tracking (category badges, payment types)
- System font stack for optimal mobile performance
- Information density prioritized over visual flair

**Component Architecture:**
- Feature-based components (`PurchaseCard`, `AddPurchaseSheet`, `CategoryBadge`)
- Shared UI primitives from Shadcn/ui in `components/ui/`
- Custom hooks for theme management and WebSocket connectivity
- Form handling via React Hook Form with Zod validation

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript (ESM modules)
- **Framework:** Express.js for HTTP server
- **Database:** PostgreSQL via Neon serverless with WebSocket support
- **ORM:** Drizzle ORM with Zod schema validation
- **Real-time:** WebSocket server for live purchase synchronization

**API Design:**
RESTful endpoints with WebSocket augmentation:
- `GET /api/purchases` - Fetch all purchases
- `POST /api/purchases` - Create new purchase
- `DELETE /api/purchases/:id` - Remove purchase
- WebSocket at `/ws` for real-time broadcasts

**Data Model:**
Simplified schema focusing on essential purchase tracking:
- `purchases` table: date, place, category, payment type, optional check number, price
- `users` table: basic authentication structure (username/password)
- UUID primary keys with timestamp tracking

**Storage Pattern:**
Interface-based storage layer (`IStorage`) with `DatabaseStorage` implementation, enabling easy testing and future storage backends.

### Real-time Synchronization

**WebSocket Implementation:**
- Persistent WebSocket connections for each client
- Broadcast pattern: mutations trigger server-side broadcasts to all connected clients
- Client-side status tracking (synced/syncing/offline)
- Auto-reconnect logic with 3-second delay on disconnection
- Optimistic UI updates with query invalidation on success

**Data Flow:**
1. User submits purchase form
2. Client sends POST request to API
3. Server stores in database and broadcasts to all WebSocket clients
4. All connected clients invalidate cache and refetch
5. UI updates with sync status indication

### Development & Build Configuration

**Build Process:**
- Vite for frontend bundling with React plugin
- esbuild for backend bundling (ESM format)
- TypeScript compilation with strict mode
- Path aliases: `@/` for client, `@shared/` for shared schemas

**Development Tools:**
- Replit-specific plugins (cartographer, dev banner, runtime error overlay)
- Drizzle Kit for database migrations
- Hot module replacement in development

## External Dependencies

### Third-Party Services

**Database:**
- **Neon Serverless PostgreSQL** - Primary data store with WebSocket support for connection pooling
- Connection managed via `@neondatabase/serverless` with WebSocket constructor override

### Core Libraries

**Frontend:**
- **@tanstack/react-query** - Server state management and caching
- **@radix-ui/** (multiple packages) - Accessible UI primitives
- **react-hook-form** with **@hookform/resolvers** - Form state and validation
- **wouter** - Lightweight routing
- **date-fns** - Date formatting utilities
- **embla-carousel-react** - Carousel functionality (if needed)
- **vaul** - Drawer component primitives

**Backend:**
- **drizzle-orm** - Type-safe database queries
- **drizzle-zod** - Schema validation integration
- **ws** - WebSocket server implementation
- **connect-pg-simple** - PostgreSQL session store

**Validation & Schemas:**
- **zod** - Runtime type validation
- Shared schema definitions in `/shared/schema.ts` used by both client and server

**Styling:**
- **tailwindcss** - Utility-first CSS
- **class-variance-authority** - Component variant management
- **tailwind-merge** & **clsx** - Conditional class merging

### Environment Requirements

- `DATABASE_URL` - PostgreSQL connection string (required)
- Node.js ESM module support
- WebSocket-compatible deployment environment