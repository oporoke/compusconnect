
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    await prisma.student.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Student deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    // Handle cases where the student might not be found or other DB errors
    return NextResponse.json({ error: 'Failed to delete student' }, { status: 500 });
  }
}
