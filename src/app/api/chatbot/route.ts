
import { getChatbotResponse } from '@/ai/flows/ai-chatbot';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { studentId, question } = await req.json();

    if (!studentId || !question) {
      return NextResponse.json(
        { error: 'Missing studentId or question' },
        { status: 400 }
      );
    }
    
    // In a real app, you would verify that the authenticated user
    // has permission to view data for this studentId.

    const response = await getChatbotResponse({ studentId, question });

    return NextResponse.json(response);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
