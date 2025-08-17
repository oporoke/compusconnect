
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const payroll = await prisma.payrollRecord.findMany({
        orderBy: { month: 'desc' }
    });
    return NextResponse.json(payroll);
  } catch (error) {
    console.error('Failed to fetch payroll records:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
