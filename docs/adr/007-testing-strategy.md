# ADR-007: Vitest + Playwright + MSW Testing Strategy

## Status
Accepted

## Date
2026-03-06

## Context
A financial platform requires high confidence in correctness. We need a testing strategy that covers:
- Component rendering and interaction logic
- API integration flows (auth, payments, team management)
- Critical user journeys end-to-end
- Accessibility compliance (WCAG 2.1 AA — regulatory requirement)

## Decision
Three-tier testing strategy with **Vitest** (unit/integration), **Playwright** (E2E), and **MSW** (API mocking).

### Test Pyramid
```
        E2E (5%)        — Playwright: critical user journeys
      Integration (20%) — Vitest + MSW: API flow testing
    Unit (75%)          — Vitest + Testing Library: components, hooks
```

### Tools
| Tool | Purpose |
|------|---------|
| Vitest | Unit + integration test runner (Jest-compatible, Vite-native) |
| Testing Library | Component testing (user-centric queries) |
| MSW (Mock Service Worker) | API mocking at network level |
| Playwright | Cross-browser E2E testing |
| axe-core | Automated accessibility checks |
| Chromatic | Visual regression (via Storybook) |

### MSW Strategy
- Mock handlers in `@stablebridge/testing` match backend OpenAPI contracts
- Same handlers used in Vitest (integration) and Storybook (development)
- Error scenarios mocked (401, 403, 409, 500) for error handling tests

### E2E Critical Paths
1. Login → MFA → Dashboard
2. Accept invitation → set password → login
3. Invite team member → verify in user list
4. Create API key → copy → revoke
5. Admin: review merchant → activate

## Consequences

### Positive
- MSW ensures API mocks match real backend behavior
- Playwright provides cross-browser confidence (Chrome, Firefox, Safari)
- axe-core catches accessibility violations automatically
- Vitest is 10x faster than Jest for large test suites
- Visual regression prevents unintended UI changes

### Negative
- MSW handlers must be updated when backend API changes
- Playwright tests are slower (5-10s each) — run only critical paths
- Three testing tools to learn and maintain

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Jest** | Slower than Vitest, doesn't integrate natively with Vite/Next.js |
| **Cypress** | Chromium-only in free tier, slower than Playwright, weaker cross-browser |
| **Storybook interaction tests** | Good for components but not for full page flows |
| **Backend integration tests** | Already covered by backend Newman suite; FE needs its own layer |
