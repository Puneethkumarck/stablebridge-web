# ADR-003: TanStack Query + Zustand for State Management

## Status
Accepted

## Date
2026-03-06

## Context
A financial payments platform has two distinct state categories:
1. **Server state** — merchant data, users, transactions, payment status (fetched from APIs)
2. **Client state** — UI state, sidebar open/closed, selected filters, form drafts

These have fundamentally different characteristics. Server state is shared, async, cacheable, and must stay in sync with the backend. Client state is local, synchronous, and ephemeral.

## Decision
Use **TanStack Query v5** for server state and **Zustand** for client state.

### TanStack Query (server state)
- Automatic caching with configurable stale times
- Background refetch on window focus
- Optimistic updates for mutations (e.g., role changes)
- Infinite queries for paginated data
- Query invalidation on mutations
- Devtools for debugging cache state

### Zustand (client state)
- Minimal API — no providers, no reducers, no action creators
- Works seamlessly with React Server Components
- Middleware for persistence (localStorage for filter preferences)
- TypeScript-first with inferred types

## Consequences

### Positive
- Clear separation of concerns (server vs client state)
- TanStack Query eliminates manual loading/error states
- Zustand has zero boilerplate — store is a simple function
- Both work with React 19 and RSC
- Combined bundle: ~15KB (vs Redux Toolkit: ~35KB)

### Negative
- Two libraries to learn instead of one unified solution
- Query key management requires discipline (solved by key factories)

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Redux Toolkit + RTK Query** | Heavier boilerplate, unnecessary for our scale, larger bundle |
| **Jotai** | Atomic model less intuitive for team, weaker devtools |
| **Recoil** | Meta-maintained but stalled development |
| **React Context** | Re-renders entire tree, no caching, not suitable for server state |
