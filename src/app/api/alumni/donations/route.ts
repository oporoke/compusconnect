
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const donations = await prisma.donation.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
