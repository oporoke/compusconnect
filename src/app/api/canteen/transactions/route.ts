
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const transactions = await prisma.canteenTransaction.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Failed to fetch canteen transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch canteen transactions' }, { status: 500 });
  }
}
