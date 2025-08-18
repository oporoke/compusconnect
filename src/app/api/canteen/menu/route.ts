
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    // In a real app, the menu would be more structured in the DB.
    // For this demo, we'll just fetch all items and group them by a mock "day".
    const items = await prisma.canteenMenuItem.findMany();
    // A simple way to create a weekly menu from a flat list of items
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const menu = days.map((day, index) => {
      // Create a slice of items for each day, cycling through the list
      const start = (index * 3) % items.length;
      const end = start + 3;
      const dayItems = items.slice(start, end);
      if (end > items.length && items.length > 0) {
        dayItems.push(...items.slice(0, end - items.length));
      }
      return {
        id: (index + 1).toString(),
        day: day,
        items: dayItems
      };
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Failed to fetch canteen menu:', error);
    return new NextResponse('Failed to fetch canteen menu', { status: 500 });
  }
}
