
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const admissions = await prisma.admission.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(admissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}
