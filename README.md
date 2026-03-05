# StableBridge Web

> Cross-border B2B payments, bridged by stablecoins.

Frontend monorepo for the StableBridge payments platform — a Fiat → Stablecoin → Fiat cross-border settlement system.

## Architecture

| Portal | Audience | Description |
|--------|----------|-------------|
| **Merchant Portal** | External merchants | Apply, manage team, initiate payments, view transactions |
| **Admin Portal** | Internal ops/compliance | Review merchants, monitor payments, manage risk |

Both portals communicate through the **S10 API Gateway** (`api.stablebridge.io`).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.7+ (strict) |
| State | TanStack Query v5 + Zustand |
| UI | shadcn/ui + Tailwind CSS 4 + Radix UI |
| API Client | OpenAPI Generator (typescript-fetch) |
| Testing | Vitest + Testing Library + Playwright + MSW |
| Build | Turborepo + pnpm 9 |
| Runtime | Node.js 22 LTS |

## Repository Structure

```
stablebridge-web/
├── apps/
│   ├── merchant-portal/          # Next.js 15 — merchant-facing
│   └── admin-portal/             # Next.js 15 — internal ops
├── packages/
│   ├── @stablebridge/api-client/ # OpenAPI-generated typed API client
│   ├── @stablebridge/auth/       # JWT, RBAC hooks, middleware
│   ├── @stablebridge/ui/         # Design system (shadcn/ui + Tailwind)
│   ├── @stablebridge/types/      # Shared TypeScript models
│   ├── @stablebridge/utils/      # Currency, date, idempotency helpers
│   └── @stablebridge/testing/    # MSW handlers, test fixtures
├── docs/
│   ├── ARCHITECTURE.md           # Frontend architecture overview
│   ├── IMPLEMENTATION_PLAN.md    # Phased implementation roadmap
│   └── adr/                      # Architecture Decision Records
├── turbo.json
└── pnpm-workspace.yaml
```

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, tech choices, auth flow, API strategy |
| [Implementation Plan](docs/IMPLEMENTATION_PLAN.md) | Phased roadmap with deliverables per week |
| [ADR Index](docs/adr/README.md) | Architecture Decision Records |

## Backend Services (separate repo)

| Service | Port | Purpose |
|---------|------|---------|
| S10 API Gateway | 8080 | Auth, routing, rate limiting |
| S11 Merchant Onboarding | 8081 | KYB, merchant lifecycle |
| S13 Merchant IAM | 8083 | Users, roles, JWT, MFA |

Backend repo: [stablecoin-payments](https://github.com/Puneethkumarck/stablecoin-payments)

## Getting Started

```bash
# Prerequisites: Node.js 22, pnpm 9
pnpm install
pnpm turbo dev
```

- Merchant Portal: http://localhost:3000
- Admin Portal: http://localhost:3001

## License

Proprietary — All rights reserved.
