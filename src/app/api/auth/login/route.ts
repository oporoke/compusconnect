import { NextResponse } from "next/server";
import { USERS } from "@/lib/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { role, email } = await request.json();

    let user;
    if (role === 'student' || role === 'parent') {
      // For simplicity, demo student/parent login uses a default student
      const student = await prisma.student.findFirst();
      if (student) {
        user = { id: student.id, name: student.name, role: role };
      }
    } else {
       const staffMember = await prisma.staff.findFirst({ where: { email, role }});
       if(staffMember) {
           user = { id: staffMember.id, name: staffMember.name, role: staffMember.role };
       }
    }


    if (!user) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const session = { user };

    const cookieStore = await cookies();
    cookieStore.set("session", JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
