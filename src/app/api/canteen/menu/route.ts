
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    // In a real app, the menu would be more structured in the DB.
    // For this demo, we'll just fetch all items and group them by a mock "day".
    const items = await prisma.canteenMenuItem.findMany();
    const menu = [
        { id: '1', day: 'Monday', items: items.slice(0, 3) },
        { id: '2', day: 'Tuesday', items: items.slice(3, 6) },
        { id: '3', day: 'Wednesday', items: items.slice(6, 9) },
        { id: '4', day: 'Thursday', items: items.slice(0, 3) },
        { id: '5', day: 'Friday', items: items.slice(3, 6) }
    ];
    return NextResponse.json(menu);
  } catch (error) {
    console.error('Failed to fetch canteen menu:', error);
    return NextResponse.json([], { status: 200 });
  }
}
