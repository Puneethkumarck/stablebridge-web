# ADR-001: pnpm Monorepo with Turborepo

## Status
Accepted

## Date
2026-03-06

## Context
StableBridge has two frontend applications (Merchant Portal, Admin Portal) that share significant code: API client, auth logic, UI components, TypeScript types, and utilities. We need a strategy that maximizes code reuse while keeping applications independently deployable.

## Decision
Use a **pnpm workspace monorepo** with **Turborepo** for build orchestration.

```
stablebridge-web/
├── apps/
│   ├── merchant-portal/
│   └── admin-portal/
├── packages/
│   ├── @stablebridge/api-client/
│   ├── @stablebridge/auth/
│   ├── @stablebridge/ui/
│   ├── @stablebridge/types/
│   ├── @stablebridge/utils/
│   └── @stablebridge/testing/
├── turbo.json
└── pnpm-workspace.yaml
```

## Consequences

### Positive
- Single PR can update shared code and both apps simultaneously
- No npm publishing overhead — packages consumed directly via workspace protocol
- Turborepo provides parallel builds with remote caching (10x faster CI)
- Consistent tooling (ESLint, Prettier, TypeScript) across all packages
- Atomic refactors across packages and apps

### Negative
- Slightly more complex initial setup than single-app repos
- CI must be monorepo-aware (only rebuild changed packages)
- All developers need the full repo even if working on one app

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Separate repos per app** | Code duplication, divergent patterns, painful shared updates |
| **npm-published packages** | Publishing overhead, version management, slower iteration |
| **Nx** | Heavier, more opinionated, enterprise-focused — Turborepo is simpler for our scale |
| **Lerna** | Largely deprecated in favor of pnpm workspaces + Turborepo |
