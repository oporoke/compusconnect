
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        messages: {
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
    });

    const conversationMap = conversations.reduce((acc, curr) => {
      acc[curr.id] = curr.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString() // Ensure date is serialized
      }));
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(conversationMap);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const { sender, receiver, content } = await request.json();
        const conversationId = [sender, receiver].sort().join('-');

        await prisma.conversation.upsert({
            where: { id: conversationId },
            update: {
                messages: {
                    create: {
                        sender,
                        content,
                    },
                },
            },
            create: {
                id: conversationId,
                members: [sender, receiver],
                messages: {
                    create: {
                        sender,
                        content,
                    },
                },
            },
        });
        
        return NextResponse.json({ message: "Message sent successfully" }, { status: 201 });
    } catch (error) {
        console.error('Failed to send message:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
