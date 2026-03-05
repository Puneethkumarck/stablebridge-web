# ADR-010: StableBridge Brand Identity

## Status
Accepted

## Date
2026-03-06

## Context
The platform needs a brand name that:
- Communicates the core value proposition (cross-border payments via stablecoins)
- Is enterprise-appropriate for B2B fintech
- Avoids regulatory issues (e.g., "Bank" requires a banking license in most jurisdictions)
- Is memorable and domain-available

## Decision
**StableBridge** — Cross-border payments, bridged by stablecoins.

### Brand Elements

| Element | Value |
|---------|-------|
| Name | StableBridge |
| Tagline | Cross-border payments, bridged by stablecoins |
| Primary Color | #3b82f6 (StableBridge Blue) |
| Accent Color | #8b5cf6 (Purple) |
| Font (UI) | Inter |
| Font (Code/Amounts) | JetBrains Mono |
| Domain (app) | app.stablebridge.io |
| Domain (admin) | admin.stablebridge.io |
| Domain (API) | api.stablebridge.io |
| Package Scope | @stablebridge/* |

### Name Rationale
- **Stable** — references stablecoins (USDC), stability, reliability
- **Bridge** — references cross-border bridging, connecting fiat currencies via crypto rails
- Combined: the platform that bridges fiat currencies via stablecoins

## Consequences

### Positive
- Clear, descriptive name — immediately communicates what the platform does
- No regulatory risk — "Bridge" is not a regulated term
- Clean namespace — `@stablebridge/*` available for npm packages
- Professional, enterprise-grade sound

### Negative
- "Stable" prefix is common in crypto space (StableDAO, StableLab, etc.)
- May need trademark search before formal registration

## Alternatives Considered

| Name | Why Rejected |
|------|-------------|
| **Stable Bank** | "Bank" is regulated — requires banking license in US, UK, EU |
| **SettleX** | Punchy but less descriptive of stablecoin mechanics |
| **MeridianPay** | Premium feel but no stablecoin reference |
| **VaultPay** | Security-focused but doesn't convey cross-border bridging |
| **NexaSettle** | Too abstract, less memorable |
