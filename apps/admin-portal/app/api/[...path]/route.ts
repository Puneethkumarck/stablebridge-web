import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@stablebridge/auth';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost';

async function proxyRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  // Strip the /api prefix — the remaining path maps directly to NGINX Ingress routes
  const backendPath = url.pathname.replace(/^\/api/, '');
  const upstream = `${API_BASE}${backendPath}${url.search}`;

  const headers: Record<string, string> = {
    'Content-Type': request.headers.get('content-type') ?? 'application/json',
    Accept: 'application/json',
  };

  // Forward idempotency key if present
  const idempotencyKey = request.headers.get('idempotency-key');
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  // Inject Bearer token from httpOnly cookie
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchInit: RequestInit = { method, headers };

  if (method !== 'GET' && method !== 'HEAD') {
    try {
      const body = await request.text();
      if (body) fetchInit.body = body;
    } catch {
      // No body — fine for DELETE etc.
    }
  }

  const response = await fetch(upstream, fetchInit);

  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.text();
  return new NextResponse(data, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('content-type') ?? 'application/json' },
  });
}

export const GET = (req: NextRequest) => proxyRequest(req, 'GET');
export const POST = (req: NextRequest) => proxyRequest(req, 'POST');
export const PUT = (req: NextRequest) => proxyRequest(req, 'PUT');
export const PATCH = (req: NextRequest) => proxyRequest(req, 'PATCH');
export const DELETE = (req: NextRequest) => proxyRequest(req, 'DELETE');
