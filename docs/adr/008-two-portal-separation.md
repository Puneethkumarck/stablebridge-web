# ADR-008: Separate Merchant and Admin Portals

## Status
Accepted

## Date
2026-03-06

## Context
StableBridge serves two distinct user groups:
1. **Merchants** — external businesses managing payments, team, and settings
2. **Admins/Ops** — internal staff reviewing merchants, monitoring compliance, managing risk

These audiences have different security requirements, access patterns, and deployment needs.

## Decision
Build **two separate Next.js applications** within the same monorepo, sharing code via workspace packages.

| Portal | App | URL | Auth |
|--------|-----|-----|------|
| Merchant Portal | `apps/merchant-portal` | `app.stablebridge.io` | S13 merchant JWT |
| Admin Portal | `apps/admin-portal` | `admin.stablebridge.io` | Internal SSO / admin JWT |

### Shared via packages
- `@stablebridge/ui` — design system, data tables, form components
- `@stablebridge/api-client` — generated API client, TanStack Query hooks
- `@stablebridge/auth` — JWT handling, permission hooks
- `@stablebridge/types` — shared TypeScript models

### Separate per app
- Route structure and page layouts
- Auth flow (merchant login vs admin SSO)
- Deployment pipeline and domain
- Access control policies

## Consequences

### Positive
- **Security isolation** — admin portal on separate domain, not accessible to merchants
- **Independent deployment** — can deploy admin fixes without touching merchant portal
- **Tailored UX** — admin UI optimized for ops workflows, merchant UI for self-service
- **Shared code** — 60-70% of components, hooks, and utilities shared via packages
- **Different scaling** — admin portal has fewer users but heavier queries

### Negative
- Two apps to maintain (build, deploy, monitor)
- Some pages exist in both portals (merchant details) with slightly different views
- Must keep shared packages backward-compatible for both consumers

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Single app with role-based routing** | Security risk — admin routes accessible if auth bypassed; bloated bundle |
| **Micro-frontends** | Over-engineered for 2 apps; composition overhead |
| **Completely separate repos** | Code duplication, divergent patterns, painful shared updates |
