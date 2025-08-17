
import { NextResponse } from 'next/server'
import { messages } from '@/lib/data'

// In a real application, this would fetch from a database.
// For this mock API, we'll return the hardcoded message data.
export async function GET(request: Request) {
  try {
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    // This is a mock endpoint and doesn't actually save the message.
    // In a real app, this would write to the database.
    try {
        const body = await request.json();
        console.log("Mock message received:", body);
        return NextResponse.json({ message: "Message sent successfully (mock)" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
