# StableBridge — Frontend Implementation Plan

> Last updated: 2026-03-06

## Overview

The frontend is delivered in **4 phases**, each aligned with backend service availability. FE Phase 1 covers the screens supported by the 3 Phase 1 backend services (S10, S11, S13).

## Phase Summary

| Phase | Scope | Duration | Backend Dependency | Linear Issues |
|-------|-------|----------|-------------------|---------------|
| **FE Phase 1** | Auth, Team, Settings, Admin Merchant Review | 10 weeks | BE Phase 1 (S10, S11, S13) — Done | STA-60 → STA-66 |
| **FE Phase 2** | Dashboard, Payments, FX Quotes | 10 weeks | BE Phase 2-3 (S1, S2, S3, S6) | TBD |
| **FE Phase 3** | Transaction History, Exports, Compliance | 8 weeks | BE Phase 3-4 (S7, S12) | TBD |
| **FE Phase 4** | Ops Monitor, Ledger, Partners, AI Gateway | 8 weeks | BE Phase 4-6 (S8, S9, S14) | TBD |

---

## FE Phase 1 — Auth & Team Management (10 weeks)

### Dependency Graph

```
STA-60  Monorepo scaffolding & design system
  │
  ├──→ STA-61  OpenAPI client & API layer
  │      │
  │      ├──→ STA-62  Auth flow (login, MFA, invitation)  ← CRITICAL PATH
  │      │      │
  │      │      ├──→ STA-63  Team management pages
  │      │      │
  │      │      └──→ STA-64  Settings pages (API keys, OAuth)
  │      │
  │      └──→ STA-65  Admin portal — merchant review
  │
  └──────────→ STA-66  E2E test suite (Playwright)  ← blocked by 62, 63, 64
```

### Week-by-Week Plan

#### Weeks 1-2: Foundation (STA-60)

| Deliverable | Details |
|-------------|---------|
| pnpm monorepo | `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json` |
| Next.js apps | `apps/merchant-portal`, `apps/admin-portal` (App Router, TypeScript strict) |
| `@stablebridge/ui` | shadcn/ui init, Tailwind CSS 4, brand tokens (StableBridge Blue #3b82f6), Inter font |
| `@stablebridge/types` | Merchant, User, Role, Permission, ApiError, DataResponse models |
| `@stablebridge/utils` | `formatCurrency`, `formatDate`, `generateIdempotencyKey`, Zod schemas |
| `@stablebridge/testing` | MSW setup, custom render with providers, test fixture factories |
| CI pipeline | GitHub Actions: lint → type-check → test → build |
| Core layouts | AppShell, Sidebar, TopNav, PageHeader for both portals |

**Exit criteria**: `pnpm install && pnpm turbo build` succeeds, both apps render placeholder pages.

#### Weeks 3-4: API Client (STA-61)

| Deliverable | Details |
|-------------|---------|
| OpenAPI specs | Export from S10, S11, S13 via springdoc-openapi |
| `@stablebridge/api-client` | OpenAPI Generator (typescript-fetch) codegen |
| TanStack Query hooks | `useMerchantUsers`, `useInviteUser`, `useLogin`, `useRoles`, etc. |
| Query key factories | `merchantKeys.users(id)`, `merchantKeys.roles(id)`, etc. |
| Auth interceptor | Inject `Authorization: Bearer` from httpOnly cookie |
| Idempotency interceptor | Auto-add `Idempotency-Key` header on POST/PATCH/DELETE |
| Error interceptor | Map backend error codes (MO-0003, IAM-0010, GW-2001) to user messages |

**Exit criteria**: `pnpm generate-api` regenerates client, hooks work with MSW mocks.

#### Weeks 5-6: Authentication (STA-62) — CRITICAL PATH

| Deliverable | Details |
|-------------|---------|
| `@stablebridge/auth` | AuthProvider, `useAuth()`, `usePermission()`, `useMFA()` |
| Login page | Email + password form, merchant ID selection, error handling |
| MFA page | TOTP 6-digit input, backup codes, setup flow |
| Invitation page | `/invitations/:token` — set password, terms acceptance |
| JWT cookie | httpOnly, Secure, SameSite=Strict, 1hr expiry |
| Silent refresh | API route `/api/auth/refresh` for token rotation |
| Next.js middleware | Route protection, RBAC guard, idle timeout (30 min) |
| Forgot password | Email-based password reset flow |

**Exit criteria**: Full login → MFA → dashboard flow works against running S13.

#### Weeks 7-8: Team & Settings (STA-63, STA-64)

| Deliverable | Details |
|-------------|---------|
| `/team` | User DataTable (name, email, role, status, last login, actions) |
| Invite modal | Email, full name, role dropdown → sends invitation email |
| User actions | Change role, suspend, reactivate, deactivate with confirm dialogs |
| `/team/roles` | Role list with expandable permission matrix |
| Create role | Custom role form with permission checkboxes |
| `/settings` | TabNav: Profile, API Keys, OAuth Clients |
| API Keys | Create (show raw key once), list, revoke |
| OAuth Clients | Create (show secret once), list, view details |

**Exit criteria**: Team CRUD works end-to-end, API key creation shows raw key with copy button.

#### Weeks 7-8 (parallel): Admin Portal (STA-65)

| Deliverable | Details |
|-------------|---------|
| `/merchants` | Merchant list DataTable with status filter, search |
| `/merchants/:id` | Merchant detail — info card, KYB status timeline |
| Review actions | Activate, suspend, reactivate, close with confirmation |
| Separate auth | Admin-specific login (internal SSO or separate credentials) |

**Exit criteria**: Admin can list merchants, view details, activate/suspend.

#### Weeks 9-10: E2E Tests & Polish (STA-66)

| Deliverable | Details |
|-------------|---------|
| Playwright setup | Config, MSW integration, CI workflow |
| Critical paths | 5 E2E test scenarios (login, invitation, team, settings, MFA) |
| Accessibility | axe-core checks on every page, WCAG 2.1 AA compliance |
| Performance | Lighthouse CI, bundle analysis, lazy loading audit |
| Polish | Error states, empty states, loading skeletons, responsive fixes |
| Deploy | Vercel preview environments, production deploy pipeline |

**Exit criteria**: All E2E tests green, Lighthouse score > 90, accessibility audit clean.

---

## FE Phase 2 — Payments & FX (10 weeks)

> Blocked by BE Phase 2-3 (S1 Orchestrator, S2 Compliance, S3 On-Ramp, S6 FX Engine)

| Week | Deliverable |
|------|-------------|
| 1-2 | Dashboard page — stat cards (volume, count, success rate), recent transactions widget |
| 3-4 | Create payment form — beneficiary, amount, currency, corridor selection |
| 5-6 | FX quote integration — live rate display, quote lock, rate expiry timer |
| 7-8 | Payment status tracker — real-time WebSocket updates, status timeline |
| 9-10 | Beneficiary management — CRUD, favorites, payment templates |

### Key Components
- `FxQuoteCard` — live rate, inverse rate, expiry countdown
- `PaymentStatusTimeline` — 5-step: Initiated → Compliance → Funded → Settling → Complete
- `BeneficiaryForm` — bank details, IBAN validation, country-specific fields
- `PaymentForm` — multi-step wizard with FX preview

---

## FE Phase 3 — Transactions & Compliance (8 weeks)

> Blocked by BE Phase 3-4 (S7 Ledger, S12 Transaction History)

| Week | Deliverable |
|------|-------------|
| 1-2 | Transaction history — server-side paginated DataTable, search, filters |
| 3-4 | Export — CSV/PDF generation, date range selector, async download |
| 5-6 | Transaction detail — 4-leg view (fiat-in, mint, burn, fiat-out), ledger entries |
| 7-8 | Compliance — document viewer, risk status badges, AML queue (admin) |

### Key Components
- `TransactionTable` — sortable columns, status filter, date range, currency filter
- `LedgerView` — double-entry journal with debit/credit columns
- `FourLegDiagram` — visual representation of sandwich payment legs
- `ExportDialog` — format selection, date range, async progress

---

## FE Phase 4 — Operations & Intelligence (8 weeks)

> Blocked by BE Phase 4-6 (S8 Partners, S9 Notifications, S14 AI Gateway)

| Week | Deliverable |
|------|-------------|
| 1-2 | Operations monitor — payment flow dashboard, error heatmap |
| 3-4 | Ledger & reconciliation — journal browser, recon status, 4-leg validator |
| 5-6 | Partner management — partner grid, circuit breaker status, health metrics |
| 7-8 | AI agent gateway — chat interface, tool call viewer, context panel |

### Key Components
- `PaymentFlowDiagram` — Sankey/flow chart of payment routing
- `CircuitBreakerWidget` — partner health with OPEN/HALF_OPEN/CLOSED indicators
- `AIChatInterface` — streaming response, tool use visualization, context awareness
- `ReconciliationDashboard` — matched/unmatched/pending counts, drill-down

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Backend API not ready when FE starts | Medium | High | MSW mocks from OpenAPI spec; FE can develop ahead |
| OpenAPI spec drift | Medium | Medium | CI job validates generated client compiles |
| Performance with large datasets | Low | High | Server-side pagination, virtual scrolling, RSC |
| Browser compatibility | Low | Medium | Browserslist config, Playwright cross-browser matrix |
| Auth token security | Low | Critical | httpOnly cookies, CSP, regular pen testing |
| Team velocity | Medium | Medium | Turborepo caching, shared packages reduce duplication |

---

## Success Metrics

| Metric | Target | Measured By |
|--------|--------|-------------|
| Lighthouse Performance | > 90 | Lighthouse CI in GitHub Actions |
| Lighthouse Accessibility | > 95 | Lighthouse CI |
| Bundle size (initial JS) | < 200KB | `next build` output |
| E2E test pass rate | 100% | Playwright CI |
| API type coverage | 100% | OpenAPI codegen (no `any`) |
| Unit test coverage | > 80% | Vitest coverage report |
| Time to Interactive | < 2s | Web Vitals monitoring |
| Error rate (production) | < 0.1% | Sentry |
