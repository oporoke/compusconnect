
export type { DisciplinaryRecord, Student, Exam, Grade, Announcement, CourseMaterial, Assignment, OnlineClass, AdmissionDocument, Admission, LeaveRequest, Staff, Book, StudentFee, LibraryTransaction, Vehicle, Driver, Route, TransportFeeRecord, Room, Hostel, HostelFeeRecord, MessMenu, FeeStructure, Invoice, InvoiceItem, Payment, PayrollRecord, Expense, CanteenAccount, CanteenTransaction, CanteenMenuItem, CanteenMenu, AlumniProfile, Donation, Mentorship, HealthRecord, ClinicVisit, Asset, Campaign, Pledge } from '@prisma/client';
export type { User, Role } from './auth';

export const defaultCourseSchedules = `
- Math 101: 3 hours, Mon/Wed/Fri
- Physics 201: 4 hours, Tue/Thu
- English 101: 3 hours, Mon/Wed/Fri
- History 202: 2 hours, Tue/Thu
- Computer Science 301: 4 hours, Mon/Wed
`;

export const defaultInstructorAvailability = `
- Dr. Smith: Mon-Fri 9am-5pm
- Prof. Jones: Mon/Wed/Fri 10am-4pm
- Ms. Davis: Tue/Thu 8am-12pm
- Mr. Lee: Mon-Fri 1pm-5pm
`;

export interface Message {
    sender: string; // User's name
    content: string;
    timestamp: string; // ISO 8601
}
export type Conversation = Message[];
