# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Markeet is an online marketplace for University of Ibadan (UI) students. It enables verified students to list, discover, and transact items/services with an escrow-based payment system.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 16 with App Router (React 19)
- **Database/Auth**: Supabase (authentication, PostgreSQL database, RPC functions)
- **Styling**: Tailwind CSS v4 with shadcn/ui components
- **Notifications**: Web Push (VAPID) via web-push library
- **CMS**: Hygraph (GraphQL) for content management

## Architecture

### Directory Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - React components (UI primitives in `ui/`)
- `src/provider/` - React context providers (Shell, PushNotification)
- `src/lib/` - Core utilities (Supabase clients, types, Hygraph)
- `src/utils/` - Helper functions and server actions
- `src/schema/` - SQL schema files for Supabase tables and RPC functions

### Key Patterns

**Shell Provider** (`src/provider/shell.tsx`): Root context providing user state and Supabase client. Access via `useShell()` hook. User object contains `id`, `profile`, `about`, and Supabase `user`.

**Data Fetching**: Most data comes from Supabase RPC functions (defined in `src/schema/rpc_functions/`). Fetcher functions in `src/utils/fetchers.tsx` wrap these calls.

**Server Actions**: Push notifications and mutations use Next.js server actions in `src/utils/actions.ts`.

**Supabase Clients**:
- `src/lib/supabase/client.ts` - Browser client
- `src/lib/supabase/server.ts` - Server-side client
- `src/lib/supabase/middleware.ts` - Edge middleware client

### Core Domain Types

Located in `src/lib/types.ts`:
- `User`, `ProfileType`, `About` - User data
- `Offer`, `Wish`, `Order` - Marketplace entities
- `OrderStatus`: pending → active → completed/dispute/cancelled
- `PaymentStatus`: pending → awaiting_verification → held → released/refunded

### Escrow Payment Flow

1. Buyer creates order (pending)
2. Buyer submits payment proof (awaiting_verification)
3. Admin verifies payment (held) - order becomes active
4. Seller delivers, buyer confirms with PIN
5. Payment released to seller wallet

### Theme Guidelines

Component library: shadcn/ui with Radix primitives. Use `dark:` prefix for dark mode variants.

#### Dark Mode — Warm Slate Theme (stone-* palette)

**Backgrounds:**
- Page backgrounds: `bg-white dark:bg-stone-950` or `bg-stone-50 dark:bg-stone-950`
- Cards/containers: `bg-white dark:bg-stone-950` (or `dark:bg-stone-900` for headers/fixed bars)
- Secondary/hover: `bg-stone-100 dark:bg-stone-900`, `hover:bg-stone-100 dark:hover:bg-stone-900`
- Input fields: `bg-white dark:bg-stone-900`

**Text:**
- `text-stone-900 dark:text-white` (headings, primary)
- `text-stone-700 dark:text-stone-200` (labels, secondary headings)
- `text-stone-600 dark:text-stone-400` (body, descriptions)
- `text-stone-500 dark:text-stone-400` (muted, hints)
- `placeholder-stone-400 dark:placeholder-stone-500`

**Borders:**
- `border-stone-200 dark:border-stone-900` (primary borders)
- `border-stone-200 dark:border-stone-800` (lighter/secondary)

**Colored sections** (info boxes, status badges, alerts) use `color-900/20` opacity in dark:
- `bg-orange-50 dark:bg-orange-900/20`, `text-orange-700 dark:text-orange-400`, `border-orange-200 dark:border-orange-800/40`
- `bg-blue-50 dark:bg-blue-900/20`, `text-blue-700 dark:text-blue-400`, `border-blue-200 dark:border-blue-800`
- `bg-green-50 dark:bg-green-900/20`, `text-green-700 dark:text-green-400`, `border-green-200 dark:border-green-800`
- `bg-red-50 dark:bg-red-900/20`, `text-red-700 dark:text-red-400`, `border-red-200 dark:border-red-800`

**Gradients:**
- Subtle: `from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20`
- Bold: `from-orange-500 via-orange-600 to-orange-700 dark:from-orange-600 dark:via-orange-700 dark:to-orange-800`

**Icon containers:** `bg-{color}-50 dark:bg-{color}-900/20`, `text-{color}-600 dark:text-{color}-400`

**Dialogs:** `dark:bg-stone-900 dark:border-stone-800`, title `dark:text-white`, description `dark:text-stone-400`

### Environment Variables

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_KEY` (server-side only)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`
