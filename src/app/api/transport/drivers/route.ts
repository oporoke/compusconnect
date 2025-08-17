
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const drivers = await prisma.driver.findMany();
    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Failed to fetch drivers:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
