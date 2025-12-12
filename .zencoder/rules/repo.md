---
description: Repository Information Overview
alwaysApply: true
---

# Markeet - Repository Information

## Summary

Markeet is a Next.js-based web application that serves as an online marketplace for University of Ibadan students. The platform enables students to buy and sell items (textbooks, electronics, hostel essentials, and phones) within the campus community. It's built with modern React/TypeScript technologies and integrates Supabase for backend services and authentication.

## Structure

The project is organized with a clear separation between application logic, UI components, and utilities:

- **`src/app/`**: Next.js App Router structure with pages for home, authentication (login/sign-up), browsing listings, creating listings, inbox, and user profiles
- **`src/components/`**: Reusable React components including header, footer, UI component library (buttons, dialogs, forms, etc.)
- **`src/lib/`**: Utility functions and shared logic
- **`src/shell/`**: Supabase integration functions and local database operations
- **`src/utils/`**: Supabase client configuration (server and client-side)
- **`public/`**: Static assets (SVGs and images)

## Language & Runtime

**Language**: TypeScript (with JavaScript files)  
**Node.js Version**: Not explicitly specified (uses modern ES2017+ features)  
**Framework**: Next.js 16.0.7 with React 19.2.0  
**Build System**: Next.js build system  
**Package Manager**: npm  

**TypeScript Configuration**:
- Target: ES2017
- Module resolution: bundler
- Path aliases: `@/*` maps to `src/*`

## Dependencies

**Main Dependencies**:
- **React Framework**: Next.js 16.0.7, React 19.2.0, React DOM 19.2.0
- **UI Components**: Radix UI components (dialog, dropdown-menu, select, alert-dialog, popover, label, separator, slot)
- **Styling**: Tailwind CSS 4, Tailwind Merge, class-variance-authority
- **Database & Backend**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **Local Storage**: Dexie (IndexedDB wrapper)
- **State Management**: use-immer
- **Icons**: lucide-react
- **Theme**: next-themes
- **Notifications**: sonner
- **Utilities**: uuid, clsx, nigerian-institutions (for Nigerian data)
- **Form Input**: @omergulcicek/password-input

**Development Dependencies**:
- **TypeScript**: ^5
- **Styling**: @tailwindcss/postcss 4, Tailwind CSS 4, tw-animate-css
- **Linting**: ESLint 9, eslint-config-next 16.0.7
- **Type Definitions**: @types/node, @types/react, @types/react-dom

## Build & Installation

**Installation**:
```bash
npm install
```

**Development Server**:
```bash
npm run dev
```

**Production Build**:
```bash
npm run build
npm start
```

**Linting**:
```bash
npm run lint
```

## Main Files & Resources

**Entry Points**:
- **Home Page**: `src/app/page.tsx` - Landing page with features, testimonials, and marketing content
- **App Layout**: `src/app/layout.tsx` - Root layout wrapper
- **Configuration Files**:
  - `next.config.ts` - Next.js configuration with component caching enabled
  - `tsconfig.json` - TypeScript compiler options
  - `components.json` - Likely configuration for UI component generation
  - `postcss.config.mjs` - PostCSS configuration for Tailwind
  - `eslint.config.mjs` - ESLint configuration

**Key Application Pages**:
- **Browse**: `src/app/browse/` - Browse and search listings
- **Create**: `src/app/create/page.tsx` - Create new listings with form
- **Auth**: `src/app/login/` and `src/app/sign-up/` - Authentication pages
- **Inbox**: `src/app/inbox/` - User messages
- **Profile**: `src/app/profile/` - User profile management

**Middleware**: `src/middleware.ts` - Next.js middleware for request handling

## Testing & Validation

**Status**: No testing framework configured in the project. No test files (*.test.ts, *.spec.ts) found in the repository.

**Linting**: ESLint is configured for code quality checks. Run `npm run lint` to validate code.

## Project Characteristics

- **No Docker**: No Dockerfile or Docker Compose configuration found
- **No Test Suite**: Project does not have automated tests configured
- **Single Application**: Single monolithic Next.js application
- **SSR + Client Components**: Mix of server-side and client-side rendered components
- **Database**: Supabase PostgreSQL backend with Dexie for local caching
- **Authentication**: Campus-verified (UI student email only)
- **Styling**: Tailwind CSS with custom components using Radix UI primitives
