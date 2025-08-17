import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const attendance = await prisma.attendanceRecord.findMany();
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
