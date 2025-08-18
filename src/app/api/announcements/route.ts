
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(announcements);
  } catch (error) {
     console.error('Failed to fetch announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}
