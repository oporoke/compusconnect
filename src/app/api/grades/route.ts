
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const grades = await prisma.grade.findMany();
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Failed to fetch grades:', error);
    return NextResponse.json({ error: 'Failed to fetch grades' }, { status: 500 });
  }
}
