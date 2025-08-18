
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const mentorships = await prisma.mentorship.findMany({
        orderBy: { startDate: 'desc' }
    });
    return NextResponse.json(mentorships);
  } catch (error) {
    console.error('Failed to fetch mentorships:', error);
    return NextResponse.json({ error: 'Failed to fetch mentorships' }, { status: 500 });
  }
}
