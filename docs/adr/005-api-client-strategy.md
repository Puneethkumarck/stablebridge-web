# ADR-005: OpenAPI Code Generation for API Client

## Status
Accepted

## Date
2026-03-06

## Context
The backend exposes REST APIs through the S10 API Gateway. We need a type-safe API client that:
- Stays in sync with backend API changes
- Eliminates manual type definitions
- Reduces boilerplate for HTTP calls
- Integrates with TanStack Query for caching

## Decision
Use **OpenAPI Generator** (typescript-fetch target) to auto-generate the API client from backend OpenAPI specs.

### Pipeline
```
Backend (Spring Boot + springdoc-openapi)
  → Export openapi.yaml
  → Commit to @stablebridge/api-client/openapi/
  → openapi-generator-cli generate
  → TypeScript fetch client in src/generated/
  → TanStack Query hooks in src/hooks/
```

### Interceptor Chain
1. **Auth**: Inject `Authorization: Bearer <token>` from httpOnly cookie
2. **Idempotency**: Auto-add `Idempotency-Key: <UUID>` on POST/PATCH/DELETE
3. **Error mapping**: Transform backend error codes to user-facing messages

## Consequences

### Positive
- **Zero type drift** — generated types match backend exactly
- **CI validation** — if generated code doesn't compile, API contract is broken
- **Automated** — `pnpm generate-api` regenerates everything
- **Request/response types** auto-imported in components
- Interceptors ensure consistent auth and idempotency handling

### Negative
- Generated code is verbose (mitigated by wrapping in clean hooks)
- Requires backend to maintain accurate OpenAPI annotations
- Generator version updates can cause breaking changes

## Alternatives Considered

| Alternative | Why Rejected |
|-------------|-------------|
| **Manual TypeScript types** | Drift risk, maintenance burden, no single source of truth |
| **GraphQL + codegen** | Backend is REST-only, adding GraphQL layer adds complexity |
| **tRPC** | Requires shared TypeScript project — backend is Java |
| **Orval** | Good alternative to openapi-generator but smaller community |
