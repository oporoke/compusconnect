
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const students = await prisma.student.findMany({
      include: {
        discipline: true,
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error('Failed to fetch students:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newStudent = await prisma.student.create({
      data: {
        id: data.id,
        name: data.name,
        grade: data.grade,
        section: data.section,
      },
    });
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
  }
}
