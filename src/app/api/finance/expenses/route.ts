
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const expenses = await prisma.expense.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Failed to fetch expenses:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
