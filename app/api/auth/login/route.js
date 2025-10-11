import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  // Forward credentials to backend
  const res = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data?.message || 'Login failed' }, { status: res.status });
  }

  // assume backend returns { token, user }
  const token = data.token;

  const secure = process.env.NODE_ENV === 'production';

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: 'auth_token',
    value: token,
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/'
  });

  return response;
}
