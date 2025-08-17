
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const attendance = await prisma.attendanceRecord.findMany();
    return NextResponse.json(attendance);
  } catch (error) {
    console.error('Failed to fetch attendance:', error);
    return NextResponse.json([], { status: 500 });
  }
}
