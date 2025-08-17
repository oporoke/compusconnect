
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const vehicles = await prisma.vehicle.findMany();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Failed to fetch vehicles:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
