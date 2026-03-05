# StableBridge — Frontend Architecture Plan

> **Brand**: StableBridge
> **Tagline**: Cross-border payments, bridged by stablecoins
> **Domain**: stablebridge.io
> **Last updated**: 2026-03-06

---

## 1. Executive Summary

StableBridge is a cross-border B2B payments platform that moves value via the Fiat → Stablecoin → Fiat "sandwich" pattern. The frontend consists of **two separate web applications** served from a **pnpm monorepo**, sharing a common design system and API client layer.

| Portal | Audience | Purpose |
|--------|----------|---------|
| **Merchant Portal** | External merchants | Apply, manage team, initiate payments, view transactions |
| **Admin Portal** | Internal ops/compliance | Review merchants, monitor payments, manage risk, reconcile |

Both portals communicate exclusively through the **S10 API Gateway**, which handles JWT validation, OAuth2 token issuance, API key authentication, rate limiting, and request routing to backend microservices.

---

## 2. Repository Structure

```
stablebridge-web/
├── apps/
│   ├── merchant-portal/          # Next.js 15 — merchant-facing application
│   │   ├── app/                  # App Router pages & layouts
│   │   │   ├── (auth)/           # Public: login, register, accept-invitation
│   │   │   ├── (dashboard)/      # Protected: main merchant workspace
│   │   │   │   ├── dashboard/
│   │   │   │   ├── payments/
│   │   │   │   ├── transactions/
│   │   │   │   ├── team/
│   │   │   │   └── settings/
│   │   │   ├── layout.tsx
│   │   │   └── middleware.ts     # JWT validation, RBAC guard
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── admin-portal/             # Next.js 15 — internal ops application
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (workspace)/
│       │   │   ├── merchants/
│       │   │   ├── compliance/
│       │   │   ├── operations/
│       │   │   ├── ledger/
│       │   │   ├── partners/
│       │   │   └── ai-gateway/
│       │   ├── layout.tsx
│       │   └── middleware.ts
│       ├── next.config.ts
│       └── package.json
│
├── packages/
│   ├── @stablebridge/api-client/ # OpenAPI-generated typed API client
│   │   ├── src/
│   │   │   ├── generated/        # Auto-generated from OpenAPI specs
│   │   │   ├── hooks/            # TanStack Query wrappers
│   │   │   └── interceptors/     # Auth header, idempotency key, error mapping
│   │   ├── openapi/              # OpenAPI spec files (pulled from backend)
│   │   └── package.json
│   │
│   ├── @stablebridge/auth/       # Authentication & authorization
│   │   ├── src/
│   │   │   ├── providers/        # AuthProvider context
│   │   │   ├── hooks/            # useAuth, usePermission, useMFA
│   │   │   ├── middleware/       # Next.js middleware helpers
│   │   │   └── guards/           # RBAC route guards
│   │   └── package.json
│   │
│   ├── @stablebridge/ui/         # Design system (shadcn/ui + Tailwind)
│   │   ├── src/
│   │   │   ├── components/       # Button, Card, DataTable, Modal, etc.
│   │   │   ├── layouts/          # AppShell, Sidebar, TopNav
│   │   │   ├── theme/            # Brand tokens, colors, typography
│   │   │   └── charts/           # Recharts wrappers
│   │   ├── tailwind.config.ts    # Shared Tailwind preset
│   │   └── package.json
│   │
│   ├── @stablebridge/types/      # Shared TypeScript models
│   │   ├── src/
│   │   │   ├── merchant.ts
│   │   │   ├── payment.ts
│   │   │   ├── user.ts
│   │   │   ├── transaction.ts
│   │   │   └── api.ts            # Pagination, DataResponse, ApiError
│   │   └── package.json
│   │
│   ├── @stablebridge/utils/      # Shared utilities
│   │   ├── src/
│   │   │   ├── currency.ts       # formatCurrency, parseCurrencyAmount
│   │   │   ├── date.ts           # formatDate, relativeTime
│   │   │   ├── idempotency.ts    # generateIdempotencyKey
│   │   │   └── validation.ts     # Zod schemas matching backend constraints
│   │   └── package.json
│   │
│   └── @stablebridge/testing/    # Test utilities
│       ├── src/
│       │   ├── msw/              # MSW request handlers (mock S10 gateway)
│       │   ├── fixtures/         # Test data factories
│       │   └── render.tsx        # Custom render with providers
│       └── package.json
│
├── turbo.json                    # Turborepo pipeline configuration
├── pnpm-workspace.yaml
├── .github/
│   └── workflows/
│       ├── ci.yml                # Lint, type-check, test, build
│       ├── deploy-merchant.yml   # Deploy merchant portal
│       └── deploy-admin.yml      # Deploy admin portal
├── .eslintrc.js                  # Shared ESLint config
├── tsconfig.base.json            # Base TypeScript config
└── README.md
```

---

## 3. Technology Stack

### Core

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | Next.js | 15.x (App Router) | SSR, RSC, middleware, API routes |
| Language | TypeScript | 5.7+ (strict mode) | Type safety, API contract enforcement |
| Runtime | Node.js | 22 LTS | Latest LTS, native fetch |
| Package Manager | pnpm | 9.x | Fast, disk-efficient, workspace support |
| Build Orchestration | Turborepo | 2.x | Parallel builds, remote caching |

### State Management

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| Server state | TanStack Query v5 | Auto caching, background refetch, optimistic updates |
| Client state | Zustand | Minimal boilerplate, no providers needed |
| Form state | React Hook Form + Zod | Performance (uncontrolled), schema validation |
| URL state | nuqs | Type-safe search params (filters, pagination) |

### UI & Styling

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Component Library | shadcn/ui | Accessible, composable, owns the code |
| Primitives | Radix UI | WAI-ARIA compliant headless components |
| Styling | Tailwind CSS 4 | Utility-first, design token support |
| Icons | Lucide React | Consistent, tree-shakeable icon set |
| Charts | Recharts | React-native, responsive, lightweight |
| Data Tables | TanStack Table v8 | Server-side pagination, column resizing, sorting |
| Date Picker | date-fns + react-day-picker | Lightweight, locale-aware |
| Toast / Notifications | sonner | Accessible, stackable notifications |

### API & Networking

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| API Client | OpenAPI Generator (typescript-fetch) | Type-safe, auto-generated from backend specs |
| HTTP | Native fetch (via Next.js) | Built-in, streaming support |
| WebSocket | Socket.IO or native WS | Real-time payment status, notifications |
| Error Handling | Custom ApiError class | Maps backend error codes to user-facing messages |

### Testing

| Level | Technology | Scope |
|-------|-----------|-------|
| Unit | Vitest + Testing Library | Component logic, hooks, utils |
| Integration | Vitest + MSW | API flows with mocked backend |
| E2E | Playwright | Critical user journeys |
| Visual Regression | Chromatic (Storybook) | UI consistency checks |
| Accessibility | axe-core + Playwright | WCAG 2.1 AA compliance |

### Infrastructure

| Concern | Technology | Rationale |
|---------|-----------|-----------|
| Hosting | Vercel (or AWS Amplify) | Edge deployment, preview environments per PR |
| CDN | Vercel Edge Network (or CloudFront) | Global edge caching |
| Analytics | PostHog | Privacy-friendly, self-hostable |
| Error Tracking | Sentry | Real-time error monitoring, source maps |
| Feature Flags | Unleash (self-hosted) | Progressive rollout per merchant |
| CI/CD | GitHub Actions | Monorepo-aware builds |

---

## 4. Authentication Architecture

### Flow

```
1. User visits /login
2. POST /v1/merchants/{id}/auth/login → S13 (via S10 gateway)
3. Response: { accessToken, refreshToken, user: { role, permissions } }
4. Tokens stored in httpOnly secure cookies (NOT localStorage)
5. Next.js middleware reads cookie on every request:
   ├─ Valid JWT → Render page, attach to API calls
   ├─ Expired → Silent refresh via /v1/auth/refresh
   └─ No token → Redirect to /login
6. If MFA required → Redirect to /mfa/verify
```

### RBAC Implementation

```typescript
// @stablebridge/auth/src/hooks/usePermission.ts
export function usePermission(required: string): boolean {
  const { user } = useAuth();
  if (!user) return false;

  // Admin wildcard
  if (user.permissions.includes('*:*')) return true;

  // Check specific permission
  const [resource, action] = required.split(':');
  return user.permissions.some(p => {
    const [r, a] = p.split(':');
    return (r === resource || r === '*') && (a === action || a === '*');
  });
}

// Usage in components
function CreatePaymentButton() {
  const canCreate = usePermission('payments:write');
  if (!canCreate) return null;
  return <Button>Create Payment</Button>;
}
```

### Route Protection (Next.js Middleware)

```typescript
// apps/merchant-portal/middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('sb_access_token');

  if (!token && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Decode JWT (without verification — gateway validates)
  const claims = decodeJwt(token.value);

  if (isExpired(claims)) {
    // Redirect to refresh endpoint
    return NextResponse.redirect(new URL('/api/auth/refresh', request.url));
  }

  // RBAC check
  const requiredPermission = getRoutePermission(request.nextUrl.pathname);
  if (requiredPermission && !hasPermission(claims, requiredPermission)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return NextResponse.next();
}
```

### Security Measures

| Measure | Implementation |
|---------|---------------|
| XSS Prevention | httpOnly cookies, CSP headers, DOMPurify for user content |
| CSRF Protection | SameSite=Strict cookie, CSRF token for mutations |
| Token Storage | httpOnly secure cookies (never localStorage/sessionStorage) |
| Token Refresh | Silent refresh via API route, refresh token rotation |
| Session Timeout | 1hr access token, 24hr refresh token, idle timeout 30min |
| MFA | TOTP (Google Authenticator) — enforced for ADMIN role |
| Rate Limiting | Client-side debounce + S10 gateway rate limits |

---

## 5. API Client Architecture

### OpenAPI Code Generation

```yaml
# packages/@stablebridge/api-client/openapi-config.yaml
generatorName: typescript-fetch
inputSpec: ./openapi/gateway-api.yaml
outputDir: ./src/generated
additionalProperties:
  supportsES6: true
  typescriptThreePlus: true
  enumPropertyNaming: UPPERCASE
```

### TanStack Query Integration

```typescript
// packages/@stablebridge/api-client/src/hooks/useMerchantUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantIamApi } from '../client';

export const merchantKeys = {
  all: ['merchants'] as const,
  detail: (id: string) => [...merchantKeys.all, id] as const,
  users: (merchantId: string) => [...merchantKeys.detail(merchantId), 'users'] as const,
};

export function useMerchantUsers(merchantId: string) {
  return useQuery({
    queryKey: merchantKeys.users(merchantId),
    queryFn: () => merchantIamApi.listUsers({ merchantId }),
  });
}

export function useInviteUser(merchantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) =>
      merchantIamApi.inviteUser({ merchantId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: merchantKeys.users(merchantId) });
    },
  });
}
```

### Idempotency Key Interceptor

```typescript
// packages/@stablebridge/api-client/src/interceptors/idempotency.ts
export function idempotencyInterceptor(request: RequestInit): RequestInit {
  const method = request.method?.toUpperCase();
  if (['POST', 'PATCH', 'DELETE'].includes(method || '')) {
    const headers = new Headers(request.headers);
    if (!headers.has('Idempotency-Key')) {
      headers.set('Idempotency-Key', crypto.randomUUID());
    }
    return { ...request, headers };
  }
  return request;
}
```

### Error Mapping

```typescript
// packages/@stablebridge/api-client/src/interceptors/error-handler.ts
const ERROR_MESSAGES: Record<string, string> = {
  'MO-0003': 'A merchant with this registration already exists.',
  'IAM-0010': 'Invalid email or password. Please try again.',
  'IAM-0011': 'Account locked due to too many failed attempts.',
  'GW-2001': 'Merchant not found.',
  'GW-3005': 'Requested permissions exceed your allowed scope.',
};

export function mapApiError(error: ApiErrorResponse): UserFacingError {
  return {
    title: error.status,
    message: ERROR_MESSAGES[error.code] || error.message,
    code: error.code,
  };
}
```

---

## 6. Design System — @stablebridge/ui

### Brand Tokens

```typescript
// packages/@stablebridge/ui/src/theme/tokens.ts
export const brand = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',   // StableBridge Blue
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a5f',
    },
    accent: {
      500: '#8b5cf6',   // Purple accent
    },
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    neutral: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      500: '#71717a',
      700: '#3f3f46',
      900: '#18181b',
    },
  },
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  radii: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
  },
};
```

### Component Library (shadcn/ui based)

| Category | Components |
|----------|------------|
| **Layout** | AppShell, Sidebar, TopNav, PageHeader, Breadcrumbs |
| **Data Display** | DataTable, StatCard, Badge, Timeline, TransactionRow |
| **Forms** | FormField, CurrencyInput, CountrySelect, DateRangePicker |
| **Feedback** | Toast, AlertBanner, EmptyState, Skeleton, LoadingSpinner |
| **Overlays** | Modal, ConfirmDialog, CommandPalette, SlideOver |
| **Navigation** | Tabs, Stepper, Pagination |
| **Finance** | AmountDisplay, FxRateCard, PaymentStatusBadge, LedgerEntry |

---

## 7. Page-by-Page Specification

### Merchant Portal

| Route | Page | Key Components | API Endpoints |
|-------|------|----------------|---------------|
| `/login` | Login | EmailInput, PasswordInput, MFAPrompt | `POST /v1/merchants/{id}/auth/login` |
| `/mfa/verify` | MFA Verification | TOTPInput, BackupCodeInput | `POST /v1/merchants/{id}/auth/mfa/verify` |
| `/invitations/:token` | Accept Invitation | PasswordSetForm, TermsCheckbox | `POST /v1/invitations/{token}/accept` |
| `/dashboard` | Dashboard | StatCards, RecentTransactions, FxRateWidget | `GET /v1/transactions/summary`, `GET /v1/fx/rates` |
| `/payments/new` | Create Payment | PaymentForm, FxQuoteCard, BeneficiarySelect | `POST /v1/payments`, `GET /v1/fx/quote` |
| `/payments/:id` | Payment Detail | StatusTimeline, LedgerView, DocumentList | `GET /v1/payments/{id}` |
| `/transactions` | Transaction History | DataTable, FilterBar, ExportButton, DateRange | `GET /v1/transactions` |
| `/team` | Team Management | UserTable, InviteModal, RoleDropdown | `GET/POST /v1/merchants/{id}/users` |
| `/team/roles` | Role Management | RoleTable, PermissionMatrix | `GET/POST /v1/merchants/{id}/roles` |
| `/settings` | Settings | TabNav: Profile, API Keys, OAuth, Webhooks | Multiple endpoints |
| `/settings/api-keys` | API Keys | KeyTable, CreateKeyModal, CopyButton | `GET/POST /v1/api-keys` |
| `/settings/oauth` | OAuth Clients | ClientTable, CreateClientForm | `GET/POST /v1/merchants/{id}/oauth-clients` |

### Admin Portal

| Route | Page | Key Components | API Endpoints |
|-------|------|----------------|---------------|
| `/merchants` | Merchant List | DataTable, StatusFilter, SearchBar | `GET /api/v1/merchants` (S11) |
| `/merchants/:id` | Merchant Detail | InfoCard, KYBTimeline, ActionButtons | `GET /api/v1/merchants/{id}` |
| `/merchants/:id/review` | KYB Review | DocumentViewer, ApproveRejectForm | `POST /api/v1/merchants/{id}/activate` |
| `/compliance` | Compliance Dashboard | RiskHeatmap, SanctionsAlerts, AMLQueue | S2 endpoints |
| `/operations` | Operations Monitor | PaymentFlowDiagram, PartnerHealthGrid | S1, S8 endpoints |
| `/ledger` | Ledger & Recon | JournalTable, ReconciliationStatus, 4LegView | S7 endpoints |
| `/partners` | Partner Management | PartnerGrid, CircuitBreakerStatus, ConfigForm | S8 endpoints |
| `/ai` | AI Agent Gateway | ChatInterface, ToolCallViewer, ContextPanel | S14 endpoints |

---

## 8. Real-Time Architecture

### WebSocket Connection (via S9 Notification Service)

```typescript
// packages/@stablebridge/api-client/src/ws/notification-client.ts
export function useNotifications(merchantId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/v1/notifications?merchantId=${merchantId}`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);

      switch (notification.type) {
        case 'payment.status_changed':
          queryClient.invalidateQueries({
            queryKey: ['payments', notification.paymentId]
          });
          toast.info(`Payment ${notification.paymentId} → ${notification.status}`);
          break;

        case 'merchant.suspended':
          // Force logout
          signOut();
          break;

        case 'team.user_invited':
          queryClient.invalidateQueries({ queryKey: merchantKeys.users(merchantId) });
          break;
      }
    };

    return () => ws.close();
  }, [merchantId]);
}
```

---

## 9. Testing Strategy

### Test Pyramid

```
    ┌───────────┐
    │  E2E (5%) │  Playwright — critical user journeys
    ├───────────┤
    │ Integration│  Vitest + MSW — API flow testing (20%)
    │  (20%)    │
    ├───────────┤
    │   Unit    │  Vitest + Testing Library — components, hooks (75%)
    │  (75%)    │
    └───────────┘
```

### MSW Mock Strategy

```typescript
// packages/@stablebridge/testing/src/msw/handlers/merchant-iam.ts
import { http, HttpResponse } from 'msw';

export const merchantIamHandlers = [
  http.post('*/v1/merchants/:merchantId/auth/login', async ({ request }) => {
    const body = await request.json();
    if (body.password === 'wrong') {
      return HttpResponse.json(
        { code: 'IAM-0010', status: 'Unauthorized', message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    return HttpResponse.json({
      data: {
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
        user: { userId: 'user-1', merchantId: 'merchant-1', role: 'ADMIN', permissions: ['*:*'] },
      },
    });
  }),
];
```

### E2E Critical Paths (Playwright)

1. **Merchant Onboarding**: Login → Dashboard → Team → Invite User
2. **Payment Flow**: Login → Create Payment → Confirm FX → Track Status
3. **Admin Review**: Login → Merchant List → Review KYB → Approve
4. **Settings**: Login → API Keys → Create → Copy → Revoke

---

## 10. CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo lint type-check
      - run: pnpm turbo test -- --coverage
      - run: pnpm turbo build

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo build
      - run: pnpm --filter merchant-portal exec playwright install --with-deps
      - run: pnpm --filter merchant-portal exec playwright test

  deploy-preview:
    if: github.event_name == 'pull_request'
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prebuilt
```

---

## 11. Implementation Phases

### FE Phase 1 — Auth & Team Management (aligns with BE Phase 1)

| Week | Deliverable |
|------|-------------|
| 1-2 | Monorepo setup, design system foundation, @stablebridge/ui scaffolding |
| 3-4 | Auth flow (login, MFA, invitation acceptance), @stablebridge/auth |
| 5-6 | Team management (list users, invite, change role, suspend) |
| 7-8 | Settings (API keys, OAuth clients), Admin merchant review |
| 9-10 | E2E tests, accessibility audit, polish, deploy |

### FE Phase 2 — Payments & FX (aligns with BE Phase 2-3)

| Week | Deliverable |
|------|-------------|
| 1-2 | Dashboard with stats, recent transactions widget |
| 3-4 | Create payment form, FX quote integration |
| 5-6 | Payment status tracker, real-time WebSocket updates |
| 7-8 | Beneficiary management, payment templates |
| 9-10 | E2E tests, performance optimization |

### FE Phase 3 — Transactions & Compliance (aligns with BE Phase 3-4)

| Week | Deliverable |
|------|-------------|
| 1-2 | Transaction history (search, filter, server-side pagination) |
| 3-4 | Export functionality (CSV, PDF), date range queries |
| 5-6 | Compliance document viewer, risk status display |
| 7-8 | Admin compliance dashboard, AML queue |

### FE Phase 4 — Operations & Intelligence (aligns with BE Phase 4-6)

| Week | Deliverable |
|------|-------------|
| 1-2 | Admin operations monitor, payment flow visualization |
| 3-4 | Ledger & reconciliation views, 4-leg validator |
| 5-6 | Partner management, circuit breaker dashboard |
| 7-8 | AI agent gateway chat interface (S14) |

---

## 12. Key Architectural Decisions

| # | Decision | Rationale | Alternatives Considered |
|---|----------|-----------|------------------------|
| 1 | Separate FE repo from BE | Different release cadence, team skills, deployment targets | Monorepo with BE (rejected: Gradle + pnpm conflict) |
| 2 | pnpm monorepo for FE | Share code between portals without npm publishing overhead | Separate repos per portal (rejected: duplication) |
| 3 | Next.js App Router | RSC for performance, middleware for auth, API routes for BFF | Vite + React Router (rejected: no SSR, no middleware) |
| 4 | Server Components by default | Minimize JS bundle for data-heavy financial tables | Client-only SPA (rejected: performance for large datasets) |
| 5 | OpenAPI codegen | Single source of truth, type safety across FE-BE boundary | Manual types (rejected: drift risk) |
| 6 | httpOnly cookies for JWT | XSS protection — critical for financial application | localStorage (rejected: vulnerable to XSS) |
| 7 | shadcn/ui over Material UI | Own the code, lighter bundle, Tailwind-native | MUI (rejected: heavy, opinionated), Ant Design (rejected: CJK focus) |
| 8 | TanStack Query for server state | Automatic caching, background refetch, optimistic updates | Redux Toolkit Query (rejected: heavier), SWR (rejected: fewer features) |
| 9 | Zustand for client state | Minimal API, no providers, works with RSC | Redux (rejected: boilerplate), Jotai (rejected: atomic model less intuitive) |
| 10 | Playwright for E2E | Cross-browser, auto-wait, trace viewer | Cypress (rejected: slower, Chromium-only in free tier) |
| 11 | Turborepo for builds | Parallel execution, remote caching, monorepo-native | Nx (rejected: heavier, enterprise-focused) |
| 12 | Idempotency-Key on all mutations | Matches backend requirement, prevents double-payments | None — mandatory |

---

## 13. Non-Functional Requirements

| Requirement | Target | How |
|-------------|--------|-----|
| **Performance** | LCP < 1.5s, FID < 100ms | RSC, code splitting, edge caching |
| **Accessibility** | WCAG 2.1 AA | Radix UI primitives, axe-core CI checks |
| **Internationalization** | English first, i18n-ready | next-intl, ICU message format |
| **Browser Support** | Chrome 120+, Firefox 120+, Safari 17+, Edge 120+ | Browserslist, Playwright matrix |
| **Mobile** | Responsive (tablet + desktop), no native app | Tailwind responsive utilities |
| **Bundle Size** | < 200KB initial JS | Tree shaking, dynamic imports, RSC |
| **Security** | OWASP Top 10 mitigations | CSP, httpOnly cookies, input sanitization |
| **Observability** | Error rate < 0.1%, P95 < 3s | Sentry, PostHog, Web Vitals |
