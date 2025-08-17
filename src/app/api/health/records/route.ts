
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const healthRecords = await prisma.healthRecord.findMany();
    return NextResponse.json(healthRecords);
  } catch (error) {
    console.error('Failed to fetch health records:', error);
    return NextResponse.json([], { status: 200 });
  }
}
