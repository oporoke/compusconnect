
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const payments = await prisma.payment.findMany();
    return NextResponse.json(payments);
  } catch (error) {
    console.error('Failed to fetch payments:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
