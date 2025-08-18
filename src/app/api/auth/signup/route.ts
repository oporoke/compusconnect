
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Role } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, role, password } = await request.json();

    if (!name || !email || !role || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // For this demo, only staff (Admins, Teachers) can sign up directly.
    // Student/Parent accounts are typically created by admins.
    if (role !== 'admin' && role !== 'teacher' && role !== 'super-admin') {
         return NextResponse.json({ error: `Direct sign up for role '${role}' is not supported.` }, { status: 400 });
    }

    // Check if user already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email },
    });

    if (existingStaff) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }
    
    // In a real app, you would hash the password here before saving
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await prisma.staff.create({
      data: {
        id: `T${Date.now().toString().slice(-4)}`,
        name,
        email,
        role,
        // Other fields would have default values or be updated later
        department: 'Unassigned',
        phone: 'N/A',
        joiningDate: new Date(),
        salary: 0,
        leavesAvailable: 15,
        leavesTaken: 0,
        performanceNotes: 'Newly registered.',
        taxDeduction: 0,
        insuranceDeduction: 0,
        schoolId: 'school-a', // Default school
      },
    });

    return NextResponse.json({ message: "User created successfully", user: newStaff }, { status: 201 });

  } catch (error) {
    console.error('Signup failed:', error);
    return NextResponse.json({ error: "An error occurred during sign up." }, { status: 500 });
  }
}
