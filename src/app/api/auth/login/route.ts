
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";
import type { Role } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, role }: { email: string, role: Role } = await request.json();

    let user;
    
    // For demo purposes, student/parent login is mocked and logs in the first student
    if (role === 'student' || role === 'parent') {
      const student = await prisma.student.findFirst();
      if (!student) {
        return NextResponse.json({ error: "No students found for mock login." }, { status: 404 });
      }
      user = { id: student.id, name: student.name, role: role };
    } else {
      // Staff login checks for an existing staff member by email
      const staffMember = await prisma.staff.findUnique({ where: { email } });
      if (!staffMember) {
        return NextResponse.json({ error: "Invalid credentials or user does not exist." }, { status: 401 });
      }
      // In a real app, you would also verify a password here
      user = { id: staffMember.id, name: staffMember.name, role: staffMember.role as Role };
    }

    // Set session cookie
    const session = { user };
    cookies().set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ error: "An error occurred during login." }, { status: 500 });
  }
}
