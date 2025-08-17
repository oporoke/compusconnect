
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const grades = await prisma.grade.findMany();
    return NextResponse.json(grades);
  } catch (error) {
    console.error('Failed to fetch grades:', error);
    return NextResponse.json([], { status: 500 });
  }
}
