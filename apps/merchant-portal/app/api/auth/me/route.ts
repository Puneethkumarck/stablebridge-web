import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ACCESS_TOKEN_COOKIE } from '@stablebridge/auth';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8080';

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;

  if (!accessToken) {
    return NextResponse.json(
      { data: null, error: { code: 'AUTH-001', message: 'Not authenticated' } },
      { status: 401 },
    );
  }

  const upstream = await fetch(`${API_BASE}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await upstream.json();

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  return NextResponse.json(data);
}
