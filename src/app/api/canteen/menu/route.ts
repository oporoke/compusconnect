
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // In a real app, the menu would be more structured in the DB.
    // For this demo, we'll just fetch all items and group them by a mock "day".
    const items = await prisma.canteenMenuItem.findMany();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    const menu = days.map((day, index) => {
      // Create a slice of items for each day, cycling through the list
      const dayItems = items.length > 0 ? [items[index % items.length], items[(index + 1) % items.length]] : [];
      return {
        id: `day-${index + 1}`,
        day: day,
        items: dayItems
      };
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Failed to fetch canteen menu:', error);
    return NextResponse.json({ error: 'Failed to fetch canteen menu' }, { status: 500 });
  }
}
