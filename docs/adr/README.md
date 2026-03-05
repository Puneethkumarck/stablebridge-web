# Architecture Decision Records

This directory contains the Architecture Decision Records (ADRs) for the StableBridge frontend.

ADRs document significant architectural decisions with context, alternatives considered, and rationale.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [001](001-monorepo-strategy.md) | pnpm monorepo with Turborepo | Accepted | 2026-03-06 |
| [002](002-framework-nextjs.md) | Next.js 15 with App Router | Accepted | 2026-03-06 |
| [003](003-state-management.md) | TanStack Query + Zustand | Accepted | 2026-03-06 |
| [004](004-ui-component-library.md) | shadcn/ui + Tailwind CSS 4 | Accepted | 2026-03-06 |
| [005](005-api-client-strategy.md) | OpenAPI code generation | Accepted | 2026-03-06 |
| [006](006-auth-architecture.md) | httpOnly cookie JWT with RBAC | Accepted | 2026-03-06 |
| [007](007-testing-strategy.md) | Vitest + Playwright + MSW | Accepted | 2026-03-06 |
| [008](008-two-portal-separation.md) | Separate merchant and admin portals | Accepted | 2026-03-06 |
| [009](009-separate-fe-be-repos.md) | Separate frontend and backend repositories | Accepted | 2026-03-06 |
| [010](010-branding.md) | StableBridge brand identity | Accepted | 2026-03-06 |

## Template

Use this template for new ADRs:

```markdown
# ADR-NNN: Title

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

## Context
What is the issue that we're seeing that motivates this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or harder as a result of this decision?

## Alternatives Considered
What other options were evaluated?
```
