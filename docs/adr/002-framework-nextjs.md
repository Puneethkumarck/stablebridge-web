# ADR-002: Next.js 15 with App Router

## Status
Accepted

## Date
2026-03-06

## Context
We need a React framework that supports:
- Server-side rendering for SEO and initial load performance
- Middleware for JWT validation and route protection
- API routes for BFF (Backend-for-Frontend) patterns like token refresh
- File-based routing for developer productivity
- Production-grade deployment with edge support

## Decision
Use **Next.js 15** with the **App Router** (React Server Components by default).

### Key Patterns
- **Server Components** by default for data-heavy pages (transaction tables, merchant lists)
- **Client Components** only for interactive UI (forms, modals, real-time updates)
- **Middleware** for JWT cookie validation and RBAC on every route
- **API Routes** for BFF: silent token refresh, OpenAPI proxy
- **Route Groups** for layout separation: `(auth)` for public, `(dashboard)` for protected

## Consequences

### Positive
- RSC reduces JavaScript bundle shipped to client (critical for large data tables)
- Middleware runs at the edge — auth checks before page renders
- Built-in streaming and suspense for progressive loading
- Vercel-optimized deployment with zero-config edge functions
- Strong TypeScript support with `next/navigation` typed hooks

### Negative
- RSC mental model adds complexity (server vs client component boundaries)
- Some libraries require `'use client'` directive
- App Router is newer — some community packages lag behind Pages Router support

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Vite + React Router** | No SSR, no middleware, no API routes — would need separate BFF service |
| **Remix** | Strong contender but smaller ecosystem, fewer enterprise deployments |
| **Astro** | Content-focused, not ideal for highly interactive SPA-like dashboard |
| **Next.js Pages Router** | Legacy, no RSC support, being superseded by App Router |
