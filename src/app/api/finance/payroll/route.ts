
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
    return NextResponse.json([], { status: 500 });
  }
}
