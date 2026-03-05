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

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript (strict) | 5.9+ |
| React | React | 19.x |
| State | TanStack Query + Zustand | TQ 5.90+ / Zustand 5.x |
| UI | shadcn/ui + Tailwind CSS + Radix UI | TW 4.2+ |
| Forms | React Hook Form + Zod | RHF 7.71+ / Zod 4.x |
| API Client | Orval (OpenAPI codegen) | 8.5+ |
| Testing | Vitest + Testing Library + Playwright + MSW | Vitest 4.0+ / PW 1.58+ / MSW 2.12+ |
| Build | Turborepo + pnpm | Turbo 2.8+ / pnpm 10.x |
| Runtime | Node.js LTS | 24.x (Krypton) |
| Linting | ESLint + Prettier | ESLint 10.x / Prettier 3.8+ |

## Repository Structure

```
stablebridge-web/
├── apps/
│   ├── merchant-portal/          # Next.js 16 — merchant-facing
│   └── admin-portal/             # Next.js 16 — internal ops
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
# Prerequisites: Node.js 24 LTS, pnpm 10
pnpm install
pnpm turbo dev
```

- Merchant Portal: http://localhost:3000
- Admin Portal: http://localhost:3001

## License

Proprietary — All rights reserved.
