
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const requirements = await prisma.admissionRequirement.findMany();
    return NextResponse.json(requirements);
  } catch (error) {
    console.error('Failed to fetch admission requirements:', error);
    return NextResponse.json({ error: 'Failed to fetch admission requirements' }, { status: 500 });
  }
}
