
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const accounts = await prisma.canteenAccount.findMany({
        orderBy: { studentId: 'asc' }
    });
    return NextResponse.json(accounts);
  } catch (error) {
    console.error('Failed to fetch canteen accounts:', error);
    return NextResponse.json([], { status: 200 });
  }
}
