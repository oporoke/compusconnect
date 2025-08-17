import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const exams = await prisma.exam.findMany();
    return NextResponse.json(exams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}
