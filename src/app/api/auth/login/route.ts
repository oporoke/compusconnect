
import { NextResponse } from 'next/server';
import { USERS } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { role, name } = await request.json();
    
    // In a real app, you would create a new user in the database or find an existing one.
    // For this demo, we'll create a user object on the fly if a name is provided,
    // otherwise we fall back to the old role-based lookup.
    let user;
    if (name) {
        user = { name, role };
    } else {
        user = USERS.find((u) => u.role === role);
    }

    if (!user) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }

    // In a real app, you'd create a session in the database
    // and store the session ID in the cookie.
    // For this demo, we'll store the user object directly.
    const session = { user };

    // Set a cookie for the session
    cookies().set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
