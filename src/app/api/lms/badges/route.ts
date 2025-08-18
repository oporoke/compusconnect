
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const badges = await prisma.badge.findMany();
    return NextResponse.json(badges);
  } catch (error) {
    console.error('Failed to fetch badges:', error);
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}
