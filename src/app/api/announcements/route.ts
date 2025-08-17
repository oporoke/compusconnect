
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const announcements = await prisma.announcement.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(announcements);
  } catch (error) {
     console.error('Failed to fetch announcements:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
