
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const pledges = await prisma.pledge.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(pledges);
  } catch (error) {
    console.error('Failed to fetch pledges:', error);
    return NextResponse.json({ error: 'Failed to fetch pledges' }, { status: 500 });
  }
}
