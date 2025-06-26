# replit.md

## Overview

This is a Spanish-language dating/quiz application built with a React frontend and Express.js backend. The app presents users with a 3-question quiz that, upon completion, unlocks access to a detailed dating profile. It features a modern design system using shadcn/ui components and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **API Pattern**: RESTful endpoints under `/api` prefix
- **Development**: Hot reload with tsx runtime

### Key Components

#### Database Schema
- **Users**: Basic user authentication table
- **Quiz Attempts**: Tracks quiz sessions and progress
- **Analytics**: Comprehensive event tracking for user interactions

#### Frontend Components
- **Quiz Container**: Multi-step quiz interface with progress tracking
- **Profile Container**: Detailed profile display post-quiz completion
- **UI Components**: Comprehensive shadcn/ui component library

#### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Quiz API**: Endpoints for starting quiz, submitting answers, and tracking progress
- **Analytics API**: Event tracking for user behavior analysis

## Data Flow

1. **Quiz Initiation**: User starts quiz, generates unique session ID
2. **Question Progression**: Each answer is validated and tracked
3. **Analytics Capture**: All user interactions logged for insights
4. **Profile Unlock**: Successful quiz completion grants profile access
5. **Profile View Tracking**: Profile views are monitored and recorded

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database ORM with PostgreSQL support
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Frontend tooling with HMR support

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with tsx for TypeScript execution
- **Database**: PostgreSQL 16 module in Replit
- **Port Configuration**: Application runs on port 5000, exposed on port 80
- **Hot Reload**: Vite dev server with backend proxy

### Production Build
- **Frontend**: Vite build targeting modern browsers
- **Backend**: esbuild bundle for Node.js ESM
- **Database**: PostgreSQL with connection pooling
- **Deployment**: Replit autoscale with automatic builds

### Environment Configuration
- **DATABASE_URL**: Required PostgreSQL connection string
- **NODE_ENV**: Environment detection for development/production modes
- **Session Configuration**: Secure session handling with PostgreSQL store

## Changelog

```
Changelog:
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```