
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  try {
    const session = JSON.parse(sessionCookie.value);
    return NextResponse.json({ user: session.user });
  } catch (error) {
    // Invalid cookie
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
