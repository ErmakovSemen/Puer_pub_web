# Tea Quest Adventures - Game Development Guide

## Overview

Tea Quest Adventures is a full-stack web application built as a collectible card game centered around tea culture. Players collect tea cards, complete quests, participate in weekly events, and track achievements in a gamified tea exploration experience.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom adventure game theme
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Middleware**: Express middleware for JSON parsing, logging, and error handling
- **Development**: Hot reload with Vite integration in development mode

### Data Storage Solutions
- **Database**: PostgreSQL with persistent data storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema changes
- **Connection**: Neon Database serverless PostgreSQL connection
- **Storage Implementation**: DatabaseStorage class replacing in-memory storage

## Key Components

### Database Schema
The application uses a comprehensive schema designed for a card collection game:

- **Users Table**: Player profiles with level, experience, and coins
- **Tea Cards Table**: Card definitions with rarity, power stats, and metadata
- **User Cards Table**: Player's card collection with quantities
- **Quests Table**: Dynamic quest system with progress tracking
- **Weekly Events Table**: Time-based events and challenges
- **Achievements Table**: Player accomplishment tracking

### Authentication & Authorization
Currently implemented with a simplified user system (single default user). The architecture supports expansion to full authentication with:
- Session-based authentication ready (connect-pg-simple configured)
- User management endpoints structured for expansion
- Role-based access patterns prepared in the schema

### Game Mechanics
- **Card Collection System**: Rarity-based card collection with visual styling
- **Quest System**: Daily, weekly, and special quest types with rewards
- **Experience & Leveling**: Player progression through XP and level systems
- **Currency System**: In-game coins for transactions and rewards
- **Achievement Tracking**: Goal-based achievement system

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Layer**: Express routes handle business logic and data validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Pipeline**: JSON responses with proper error handling
5. **State Updates**: Client-side cache invalidation and optimistic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for Neon Database
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16
- **Development Server**: Vite dev server with hot reload
- **Port Configuration**: Local port 5000, external port 80

### Production Build
- **Client Build**: Vite builds React app to `dist/public`
- **Server Build**: esbuild bundles Express server to `dist/index.js`
- **Database**: Neon Database serverless PostgreSQL
- **Deployment Target**: Replit Autoscale deployment

### Build Commands
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both client and server
- `npm run start`: Production server startup
- `npm run db:push`: Database schema deployment

## Recent Changes

### Enhanced Button Styling for Better Readability (June 26, 2025)
- Improved grey button contrast by replacing with amber/yellow theme colors
- Enhanced category button styling with amber background and yellow text
- Updated progress badges to use amber-yellow color scheme for better visibility
- Added transition effects and proper border styling for consistent UI experience

### Streamlined Home Page Layout (June 26, 2025)
- Removed player header and hero section from main page for cleaner interface
- Simplified home page layout to focus on core content sections
- Maintained essential functionality while reducing visual clutter

### Achievements Base Grid with Navigation (June 26, 2025)
- Created AchievementsBase component displaying achievement icons in 4x3 grid layout
- Added circular achievement icons with completion indicators and progress badges
- Implemented click-through navigation from achievement grid to full achievements page
- Enhanced visual feedback with hover effects and completion status indicators
- Integrated achievements overview section on Home page for quick access

### Bubble-Style Task Cards with Tea Tasting Progress (June 26, 2025)
- Created TaskBubble component with visual progress points for tea feelings/tasting tracking
- Implemented bubble visualization showing yellow, green, and red tea tasting progress
- Added visual completion indicators with colored circles for each tea type
- Enhanced Tea Explorer achievement with 3-point progress system matching user's screenshot reference
- Integrated bubble-style cards in both Home page and Achievements page
- Added animated progress indicators and reward claiming functionality for bubble tasks

### Personal Achievements Screen with Collection System (June 26, 2025)
- Created dedicated `/achievements` route for personal player profile and achievement tracking
- Moved level information from header to personal achievements screen
- Implemented collection-style achievement system with categories: Collection, Quests, Events, Levels
- Added tea variety collection achievements: "Try 1 yellow, 1 green, and 1 red tea"
- Created event participation achievements: "Take part in Go Tournament event"
- Enhanced achievement tracking with progress bars, rewards display, and completion functionality
- Updated navigation to include "Profile" link to achievements page
- Achievement completion awards experience and coins with level progression tracking

### Combined Level/Experience System with Coin Rewards (June 26, 2025)
- Redesigned player progression system combining experience with levels
- Implemented coin earning through quest and task completion (not purchasing)
- Created PlayerHeader component matching user's screenshot reference
- Added quest completion system with experience and coin rewards
- Level progression: 1000 XP = 1 level with visual progress tracking
- Enhanced quest cards with reward display and completion functionality
- Populated database with sample quests demonstrating coin earning mechanics

### Tea Card Enhancement (June 26, 2025)
- Added new tea card characteristics: strength (1-10), freshness (1-10), aroma (1-10)
- Added ability system with effects: concentrates, soothes, invigorates, calms, refreshes, energizes
- Added brewing specifications: brewing time and temperature for each tea
- Enhanced card display with characteristic stats and ability badges
- Updated database schema to support new tea properties

### Separate Collection Page (June 26, 2025)
- Created dedicated `/collection` route for full tea card management
- Implemented detailed card modal with brewing instructions and characteristics
- Added progress bars for tea characteristics (strength, freshness, aroma)
- Enhanced card filtering and search functionality
- Updated navigation to include direct collection access

### Weekly Events Calendar Redesign (June 26, 2025)
- Redesigned weekly events calendar to match vintage pub schedule aesthetic
- Added Cyrillic text styling to match traditional tea house theme
- Implemented decorative borders and vintage layout structure
- Enhanced visual hierarchy with proper day-by-day event organization

### Navigation Improvements (June 26, 2025)
- Added routing support for collection page in navigation
- Enhanced user experience with direct links to major features
- Maintained adventure game theming throughout navigation

### Database Integration (June 26, 2025)
- Migrated from in-memory storage to PostgreSQL database
- Implemented DatabaseStorage class with full CRUD operations
- Successfully pushed database schema with all tables and relations
- Populated database with sample tea cards, user data, quests, and weekly events
- Maintained data integrity with proper foreign key relationships

### Clash Royale-Style Collection System (June 26, 2025)
- Implemented complete card catalog display showing all available tea cards
- Added ownership status tracking for each card in the collection
- Unowned cards display in grayscale with lock icons (Clash Royale style)
- Owned cards display in full color with quantity badges
- Added collection progress tracking (owned/total cards)
- Removed star rating system for cleaner, more compact card design
- Optimized card grid layout (2-6 columns responsive) with smaller card sizes

## Changelog

```
Changelog:
- June 26, 2025. Initial setup with basic tea collection game
- June 26, 2025. Enhanced tea cards with characteristics and abilities
- June 26, 2025. Added separate collection page with detailed card views
- June 26, 2025. Redesigned weekly events calendar with vintage styling
- June 26, 2025. Migrated to PostgreSQL database with persistent storage
- June 26, 2025. Implemented Clash Royale-style collection system with all cards visible
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```