
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const clinicVisits = await prisma.clinicVisit.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(clinicVisits);
  } catch (error) {
    console.error('Failed to fetch clinic visits:', error);
    return NextResponse.json({ error: 'Failed to fetch clinic visits' }, { status: 500 });
  }
}
