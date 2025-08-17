
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const hostels = await prisma.hostel.findMany({
      include: {
        rooms: {
          include: {
            occupants: {
              select: {
                id: true // Select only the student ID
              }
            }
          }
        }
      }
    });

    // Transform the data to match the frontend's expected format
    const formattedHostels = hostels.map(hostel => ({
      ...hostel,
      rooms: hostel.rooms.map(room => ({
        ...room,
        occupants: room.occupants.map(o => o.id) // Flatten the occupants array to just IDs
      }))
    }));

    return NextResponse.json(formattedHostels);
  } catch (error) {
    console.error('Failed to fetch hostels:', error);
    return NextResponse.json([], { status: 200 });
  }
}
