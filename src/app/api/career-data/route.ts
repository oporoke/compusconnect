
import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const [interests, careers] = await Promise.all([
      prisma.careerInterest.findMany(),
      prisma.careerPath.findMany(),
    ]);
    return NextResponse.json({ interests, careers });
  } catch (error) {
    console.error('Failed to fetch career data:', error);
    return NextResponse.json({ interests: [], careers: [] }, { status: 500 });
  }
}
