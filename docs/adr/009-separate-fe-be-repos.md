# ADR-009: Separate Frontend and Backend Repositories

## Status
Accepted

## Date
2026-03-06

## Context
The backend (stablecoin-payments) is a Java 25 / Gradle monorepo with 14 microservices. The frontend is a TypeScript / pnpm monorepo with 2 Next.js apps. We need to decide whether they share a repository.

## Decision
Keep **separate repositories**:
- `stablecoin-payments` — Java backend (Gradle, 14 services)
- `stablebridge-web` — TypeScript frontend (pnpm, 2 apps)

### Integration Point
OpenAPI specs exported from backend → committed to `@stablebridge/api-client/openapi/` in the frontend repo. This is the contract boundary.

### Cross-Repo Linking
- Backend repo linked in frontend README
- Linear issues track cross-cutting work (e.g., "Add new API endpoint" + "Consume in FE")
- CI can trigger frontend codegen when backend OpenAPI spec changes (GitHub Actions workflow_dispatch)

## Consequences

### Positive
- **Independent release cadence** — FE can ship UI fixes without backend deployment
- **Tool isolation** — Gradle and pnpm don't interfere with each other
- **Team scalability** — FE and BE teams work independently
- **CI speed** — FE CI doesn't run Java tests, BE CI doesn't run Playwright
- **Focused code review** — PRs scoped to one stack

### Negative
- API contract changes require coordinated PRs across repos
- OpenAPI spec must be manually synced (mitigated by CI automation)
- Local development needs both repos running

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Single monorepo (Gradle + pnpm)** | Build tool conflicts, CI complexity, unrelated change noise |
| **Git submodules** | Fragile, poor DX, version pinning issues |
| **API-first with shared spec repo** | Third repo to manage; premature for current team size |
