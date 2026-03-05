# ADR-004: shadcn/ui + Tailwind CSS 4

## Status
Accepted

## Date
2026-03-06

## Context
A financial payments platform requires:
- Accessible components (WCAG 2.1 AA) — regulatory requirement for fintech
- Data-dense tables with sorting, filtering, pagination
- Consistent design language across two portals
- Full control over styling and behavior (no vendor lock-in)
- Small bundle size for performance

## Decision
Use **shadcn/ui** (built on Radix UI primitives) with **Tailwind CSS 4** for styling.

### Why shadcn/ui
- **Copy-paste model** — components live in our codebase, fully owned and customizable
- **Radix UI primitives** — WAI-ARIA compliant, keyboard navigation, focus management
- **Tailwind-native** — no CSS-in-JS runtime, works with RSC
- **Growing ecosystem** — charts, data tables, forms all available

### Design System Package
`@stablebridge/ui` wraps shadcn/ui components with StableBridge brand tokens:
- Brand colors (StableBridge Blue #3b82f6)
- Typography (Inter for UI, JetBrains Mono for code/amounts)
- Finance-specific components (AmountDisplay, FxRateCard, PaymentStatusBadge)

## Consequences

### Positive
- Full ownership of component code — no waiting for upstream fixes
- Radix primitives handle accessibility correctly out of the box
- Tailwind CSS 4 compiles to native CSS — no JS runtime
- Easy to add finance-specific variants (currency inputs, amount displays)
- Consistent across both portals via shared package

### Negative
- Initial setup requires copying and customizing each component
- No out-of-the-box enterprise components (data grid, date range) — must compose
- Tailwind learning curve for developers used to CSS-in-JS

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Material UI (MUI)** | Heavy bundle (~90KB), opinionated Material Design, poor RSC support |
| **Ant Design** | CJK-focused community, large bundle, hard to customize brand |
| **Chakra UI** | CSS-in-JS runtime, weaker accessibility than Radix |
| **Mantine** | Good option but smaller ecosystem, less enterprise adoption |
| **Custom from scratch** | Accessibility is hard to get right — Radix solves this |
