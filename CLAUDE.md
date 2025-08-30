# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Logistics CRM MVP** - a simplified customer relationship management system designed specifically for logistics companies. The focus is on simplicity and ease-of-use for operational staff, avoiding the complexity of traditional enterprise CRM systems.

**Key Goals:**
- Reduce redundant work for employees  
- Minimize errors from complex software
- Enable new employees to learn the system independently
- Deliver a working MVP quickly for feedback collection

## Architecture & Tech Stack

**Architecture Pattern:** Serverless Full-Stack (JAMstack + BaaS)
- **Frontend:** React 18.x + TypeScript 5.x + Vite 5.x
- **UI Components:** shadcn/ui + Tailwind CSS 3.x  
- **Backend:** Supabase (PostgreSQL 15.x + Auth + Edge Functions)
- **State Management:** React Context API
- **Testing:** Vitest + React Testing Library
- **Deployment:** Vercel (Frontend) + Supabase (Backend)
- **Repository:** Monorepo with npm workspaces

## Project Structure

This is a **monorepo** using npm workspaces with the following structure:

```
/logistics-crm-mvp
├── apps/
│   └── web/                 # React application
│       ├── src/
│       │   ├── components/  # React components
│       │   ├── pages/       # Page components  
│       │   └── services/    # API/business logic
│       ├── public/
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   └── shared/              # Shared types and logic
│       ├── types.ts
│       └── package.json
└── supabase/               # Database migrations & functions
```

## Core Data Models

The system manages two primary entities:

**Customer:**
```typescript
interface Customer {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
}
```

**Job:**
```typescript
interface Job {
  id: string;
  created_at: string;
  customer_id: string;
  description: string;
  status: 'New' | 'In Progress' | 'Done';
  customers?: Customer;
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev --workspace=web

# Environment setup
# Create .env file with Supabase URL + Anon Key

# Database migrations (when implemented)
supabase db push

# Testing (when implemented)
npm run test --workspace=web
```

## Coding Standards

- **Data Access:** Must use Supabase Client Library only
- **Type Sharing:** All shared types go in `packages/shared/`
- **Environment Variables:** Access via `import.meta.env.VITE_*` prefix
- **Component Library:** Use shadcn/ui components consistently
- **Styling:** Tailwind CSS classes only

## Development Workflow Integration

This project uses the **BMAD™ Core** development methodology:

### Key Configuration
- **Stories Location:** `docs/stories/` (user story files)
- **Architecture:** `docs/architecture/` (sharded technical documentation)
- **PRD:** `docs/prd/` (sharded product requirements)
- **Debug Logs:** `.ai/debug-log.md`

### Agent Commands
The project includes several agent personas accessible via `/BMad\agents:` commands:
- `po` (Product Owner) - Story refinement and backlog management
- `sm` (Scrum Master) - Story creation and process guidance  
- `dev` (Developer) - Full-stack development implementation
- `qa` (Quality Assurance) - Testing and validation
- `architect` - System design and technical decisions

### Current Development Status
**Next Story:** `docs/stories/1.1.story.md` - Project Scaffolding (Status: Draft)
- Set up React + Vite + TypeScript foundation
- Install shadcn/ui and Supabase client
- Create monorepo structure with npm workspaces
- Configure development environment

## MVP Functional Scope

The MVP includes basic CRM functionality:
1. **Authentication:** Email/password login with "forgot password"
2. **Dashboard:** Summary view of jobs and key metrics  
3. **Customer Management:** View, add customers (basic info only)
4. **Job Management:** View, create, update job status
5. **Navigation:** Left sidebar with Dashboard, Customers, Jobs

**UI/UX Focus:** Simple, clean interface optimized for non-technical users with consistent layout patterns.

## Data Strategy

- **MVP Phase:** Uses dummy data for rapid UI/UX development and testing
- **Production:** Full Supabase integration with PostgreSQL backend
- **Authentication:** Supabase Auth handles user management
- **API:** PostgREST auto-generated from database schema

## Deployment Architecture

- **Frontend:** Deployed via Vercel with GitHub integration
- **Backend:** Managed by Supabase platform  
- **Database:** PostgreSQL on Supabase with CLI-based schema deployment
- **Environment:** Staging and production environments managed separately
- Please speak with me only Thai language with emoji and easy to read.