
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  try {
    const invoices = await prisma.invoice.findMany({
        orderBy: { date: 'desc' }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json([], { status: 500 });
  }
}
