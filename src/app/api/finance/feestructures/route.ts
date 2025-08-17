
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const feeStructures = await prisma.feeStructure.findMany();
    return NextResponse.json(feeStructures);
  } catch (error) {
    console.error('Failed to fetch fee structures:', error);
    return NextResponse.json({ error: 'Failed to fetch fee structures' }, { status: 500 });
  }
}

