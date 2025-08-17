
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const assets = await prisma.asset.findMany({
        orderBy: { purchaseDate: 'desc' }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    // Return 200 OK with an empty array to prevent client-side errors
    return NextResponse.json([], { status: 200 });
  }
}
