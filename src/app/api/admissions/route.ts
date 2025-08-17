
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const admissions = await prisma.admission.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(admissions);
  } catch (error) {
    console.error('Failed to fetch admissions:', error);
    return NextResponse.json({ error: 'Failed to fetch admissions' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newAdmission = await prisma.admission.create({
      data: {
        ...data,
        id: `APP${Date.now()}`,
        status: 'Pending',
        date: new Date().toISOString(),
        documents: [], // Handle file uploads separately
      },
    });
    return NextResponse.json(newAdmission, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create admission' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, status } = await request.json();
    const updatedAdmission = await prisma.admission.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updatedAdmission, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update admission status' }, { status: 500 });
  }
}
