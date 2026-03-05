# ADR-006: httpOnly Cookie JWT with RBAC Middleware

## Status
Accepted

## Date
2026-03-06

## Context
StableBridge is a financial payments platform handling sensitive data and money movement. Authentication must be:
- Resistant to XSS attacks (tokens must not be accessible to JavaScript)
- Support role-based access control (ADMIN, PAYMENTS_OPERATOR, VIEWER, DEVELOPER)
- Handle MFA enforcement for privileged roles
- Integrate with the existing S13 JWT + S10 gateway architecture

The backend issues JWTs with claims: `sub`, `merchantId`, `role`, `permissions[]`, `mfa_verified`.

## Decision
Store JWTs in **httpOnly secure cookies** and enforce RBAC via **Next.js middleware**.

### Token Flow
1. Login → S13 returns `accessToken` + `refreshToken`
2. Next.js API route sets both as httpOnly cookies (`sb_access_token`, `sb_refresh_token`)
3. Middleware reads cookie on every request, checks expiry and permissions
4. API calls forward cookie → Next.js API route extracts token → forwards as `Bearer` header to S10

### Cookie Configuration
```
Name: sb_access_token
HttpOnly: true
Secure: true
SameSite: Strict
Path: /
MaxAge: 3600 (1 hour)
```

### RBAC Model
```typescript
// Route → required permission mapping
const ROUTE_PERMISSIONS = {
  '/team': 'team:read',
  '/team/invite': 'team:write',
  '/settings/api-keys': 'settings:write',
  '/payments/new': 'payments:write',
};
```

Middleware checks JWT claims against route permission before rendering.

### MFA Enforcement
- After login, if `mfa_verified: false` and role is ADMIN → redirect to `/mfa/verify`
- MFA setup via TOTP (Google Authenticator compatible)
- Backup codes for recovery

## Consequences

### Positive
- **XSS-resistant** — JavaScript cannot access httpOnly cookies
- **CSRF-safe** — SameSite=Strict prevents cross-site cookie sending
- **Server-validated** — middleware runs before page render
- **Permission granularity** — `resource:action` model matches backend (e.g., `payments:write`)
- **MFA enforced** — critical for financial application compliance

### Negative
- Requires API route proxy (cookies can't be sent cross-origin to S10 gateway directly)
- Token refresh adds complexity (silent refresh via API route)
- Cookie size limit (4KB) — JWT must stay small

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **localStorage** | Vulnerable to XSS — any injected script can steal tokens |
| **sessionStorage** | Same XSS risk, lost on tab close |
| **In-memory only** | Lost on page refresh, poor UX |
| **OAuth2 PKCE flow** | More complex, backend doesn't expose authorization server for PKCE |
