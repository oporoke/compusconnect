
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const materials = await prisma.courseMaterial.findMany();
    return NextResponse.json(materials);
  } catch (error) {
    console.error('Failed to fetch course materials:', error);
    return NextResponse.json({ error: 'Failed to fetch course materials' }, { status: 500 });
  }
}
