
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const classes = await prisma.onlineClass.findMany();
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Failed to fetch online classes:', error);
    return NextResponse.json({ error: 'Failed to fetch online classes' }, { status: 500 });
  }
}
