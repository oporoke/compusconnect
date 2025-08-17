
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const profiles = await prisma.alumniProfile.findMany();
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Failed to fetch alumni profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch alumni profiles' }, { status: 500 });
  }
}
