
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const admissions = await prisma.admission.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(admissions);
  } catch (error) {
    console.error('Failed to fetch admissions:', error);
    return NextResponse.json([], { status: 500 });
  }
}
