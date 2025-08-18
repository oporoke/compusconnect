import { Role, User, ROLES } from './auth';
export type { User, Role };

export type { DisciplinaryRecord, Student, Exam, Grade, Announcement, CourseMaterial, Assignment, OnlineClass, Admission, AdmissionRequirement, Staff, Book, LibraryTransaction, Vehicle, Driver, Route, Room, Hostel, FeeStructure, Invoice, Payment, PayrollRecord, Expense, CanteenAccount, CanteenTransaction, CanteenMenuItem, AlumniProfile, Mentorship, HealthRecord, ClinicVisit, Asset } from '@prisma/client';


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

// Mock Data
export const students = [
  { id: 'S001', name: 'Alice Johnson', grade: '10', section: 'A', discipline: [{ id: 'D01', date: '2024-09-15', reason: 'Late Submission', actionTaken: 'Warning' }] },
  { id: 'S002', name: 'Bob Williams', grade: '10', section: 'A' },
  { id: 'S003', name: 'Charlie Brown', grade: '10', section: 'B' },
  { id: 'S004', name: 'Diana Miller', grade: '11', section: 'A', discipline: [] },
  { id: 'S005', name: 'Ethan Davis', grade: '11', section: 'B' },
  { id: 'S006', name: 'Fiona Garcia', grade: '12', section: 'C' },
  { id: 'S007', name: 'George Rodriguez', grade: '12', section: 'C' },
];

export const exams = [
  { id: 'E01', name: 'Mid-Term Exam', date: '2024-10-15', subjects: ['Math', 'Science', 'English', 'History'] },
  { id: 'E02', name: 'Final Exam', date: '2025-03-10', subjects: ['Math', 'Science', 'English', 'History', 'Art', 'Physical Education'] },
];

export const grades = [
  { studentId: 'S001', examId: 'E01', scores: { Math: 85, Science: 92, English: 78, History: 88 } },
  { studentId: 'S002', examId: 'E01', scores: { Math: 90, Science: 88, English: 82, History: 91 } },
  { studentId: 'S003', examId: 'E01', scores: { Math: 65, Science: 70, English: 68, History: 72 } },
];

export const staff = [
  { id: 'T01', name: 'Dr. Evelyn Reed', role: 'Principal', department: 'Administration', email: 'e.reed@school.com', phone: '123-456-7890', joiningDate: '2010-08-15', salary: 9000, leavesTaken: 5, leavesAvailable: 20, performanceNotes: "Excellent leadership and vision.", deductions: { tax: 0.20, insurance: 300}, schoolId: "school-a" },
  { id: 'T02', name: 'Mr. Samuel Jones', role: 'Teacher', department: 'Mathematics', email: 's.jones@school.com', phone: '123-456-7891', joiningDate: '2015-09-01', salary: 6000, leavesTaken: 3, leavesAvailable: 15, performanceNotes: "Consistently high student scores in his classes.", deductions: { tax: 0.15, insurance: 250}, schoolId: "school-a" },
  { id: 'T03', name: 'Ms. Clara Oswald', role: 'Teacher', department: 'Science', email: 'c.oswald@school.com', phone: '123-456-7892', joiningDate: '2018-08-21', salary: 5500, leavesTaken: 8, leavesAvailable: 15, performanceNotes: "", deductions: { tax: 0.15, insurance: 250}, schoolId: "school-b" },
  { id: 'T04', name: 'Mr. Peter Capaldi', role: 'Librarian', department: 'Library', email: 'p.capaldi@school.com', phone: '123-456-7893', joiningDate: '2020-02-10', salary: 4500, leavesTaken: 2, leavesAvailable: 12, performanceNotes: "", deductions: { tax: 0.12, insurance: 200}, schoolId: "school-a" },
];

export const admissions = [
  { id: 'APP001', name: 'John Doe', age: 14, previousSchool: 'Greenwood High', grade: '9', parentName: 'Richard Doe', parentEmail: 'r.doe@example.com', date: '2024-09-01', status: 'Pending', documents: [{ name: 'Birth Certificate', url: '#' }, { name: 'Previous Marksheet', url: '#' }] },
  { id: 'APP002', name: 'Jane Smith', age: 15, previousSchool: 'Oakridge Academy', grade: '10', parentName: 'Robert Smith', parentEmail: 'r.smith@example.com', date: '2024-09-03', status: 'Approved' },
  { id: 'APP003', name: 'Mike Ross', age: 14, previousSchool: 'Northwood Middle', grade: '9', parentName: 'Harvey Ross', parentEmail: 'h.ross@example.com', date: '2024-09-05', status: 'Rejected' },
];

export const admissionRequirements = [
    { id: 'req1', requirement: "Copy of student's birth certificate." },
    { id: 'req2', requirement: "Copy of previous school's report card." },
    { id: 'req3', requirement: "Copy of parent/guardian ID." },
    { id: 'req4', requirement: "2 passport-sized photographs." },
]

export const feeStructures = [
  { id: 'FS01', name: 'Annual Tuition', amount: 5000, grades: ['9', '10', '11', '12'] },
  { id: 'FS02', name: 'Activity Fee', amount: 200, grades: ['9', '10', '11', '12'] },
  { id: 'FS03', name: 'Science Lab Fee', amount: 150, grades: ['11', '12'] },
];

export const invoices = [
  { id: 'INV-S001-1672531200000', studentId: 'S001', date: '2024-08-01', dueDate: '2024-09-01', items: [{ description: 'Annual Tuition', amount: 5000 }, { description: 'Activity Fee', amount: 200 }], total: 5200, status: 'Unpaid' },
];

export const payments = [
    { id: 'PAY-1', invoiceId: 'INV-S002-1672531200000', amount: 5000, date: '2024-09-12', method: 'Card' }
]

export const announcements = [
    { id: 'AN01', title: 'Annual Sports Day', date: '2024-10-20', content: 'The annual sports day will be held on November 15th. All students are encouraged to participate.' },
    { id: 'AN02', title: 'Parent-Teacher Meeting', date: '2024-10-18', content: 'The quarterly parent-teacher meeting is scheduled for October 30th. Please book your slots.' },
];

export const events = [
    { id: 'EV01', title: 'Science Fair', date: '2024-11-05', description: 'Annual science fair for grades 9-12.' },
    { id: 'EV02', title: 'Mid-term Exams', date: '2024-10-20', description: 'Mid-term examinations for all grades.' },
];

export const assignments = [
    { id: 'AS01', title: 'Algebra Worksheet', subject: 'Math', dueDate: '2024-10-25', status: 'Pending', skills: ['Problem Solving', 'Data Analysis'] },
    { id: 'AS02', title: 'Photosynthesis Essay', subject: 'Science', dueDate: '2024-10-22', status: 'Submitted', skills: ['Scientific Writing', 'Research'] },
    { id: 'AS03', title: 'World War II Report', subject: 'History', dueDate: '2024-10-20', status: 'Graded', skills: ['Research', 'Critical Thinking'] },
];

export const courseMaterials = [
    { id: 'CM01', title: 'Introduction to Calculus', subject: 'Math', type: 'PDF', link: '#' },
    { id: 'CM02', title: 'The Cell Structure', subject: 'Science', type: 'Video', link: '#' },
    { id: 'CM03', title: 'Shakespearean Sonnets', subject: 'English', type: 'Slides', link: '#' },
];

export const onlineClasses = [
    { id: 'OC01', topic: 'Trigonometry Basics', subject: 'Math', time: 'Mon, 10:00 AM', link: '#' },
    { id: 'OC02', topic: 'Genetics 101', subject: 'Science', time: 'Tue, 11:00 AM', link: '#' },
];

export const messages: Record<string, Conversation> = {
    'Admin User-Student User': [
        { sender: 'Admin User', content: 'Welcome to the school!', timestamp: '2024-10-01T10:00:00Z' },
        { sender: 'Student User', content: 'Thank you!', timestamp: '2024-10-01T10:05:00Z' },
    ]
}

export const books = [
    { id: 'B001', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', subject: 'English', quantity: 5, available: 4, rfid: 'RFID001' },
    { id: 'B002', title: 'A Brief History of Time', author: 'Stephen Hawking', subject: 'Science', quantity: 3, available: 3, rfid: 'RFID002' },
];

export const libraryTransactions = [
    { id: 'L001', studentId: 'S001', bookId: 'B001', type: 'borrow', date: '2024-09-20', dueDate: '2024-10-04' },
];

export const vehicles = [
    { id: 'V01', model: 'TATA Marcopolo', capacity: 40, driverId: 'D01', location: { lat: -1.286389, lng: 36.817223 } },
];
export const drivers = [{ id: 'D01', name: 'John Kamau' }];
export const routes = [{ id: 'R01', name: 'Route A - Morning', vehicleId: 'V01', driverId: 'D01', stops: ['Kenyatta Ave', 'Uhuru Highway', 'Westlands'] }];

export const hostels = [
    { id: 'H01', name: 'Boys Hostel A', capacity: 100, rooms: [{ id: 'R101', number: '101', capacity: 2, occupants: ['S003'] }] },
    { id: 'H02', name: 'Girls Hostel B', capacity: 100, rooms: [{ id: 'R102', number: '102', capacity: 2, occupants: [] }] },
];

export const canteenAccounts = [
    { studentId: 'S001', balance: 15.50 },
    { studentId: 'S002', balance: 25.00 },
];
export const canteenTransactions = [
    { id: 'CT01', studentId: 'S001', type: 'debit', amount: 5.00, description: 'Pizza Slice, Soda', date: '2024-10-01' },
];

export const canteenMenu: any[] = [
    { id: 'CM1', day: 'Monday', items: [{ name: 'Pizza Slice', price: 2.50, stock: 50 }, { name: 'Apple Juice', price: 1.00, stock: 100 }] },
    { id: 'CM2', day: 'Tuesday', items: [{ name: 'Chicken Sandwich', price: 3.50, stock: 40 }, { name: 'Orange Juice', price: 1.00, stock: 100 }] },
];

export const alumniProfiles = [
    { id: 'AL01', name: 'Jane Doe', graduationYear: 2015, occupation: 'Software Engineer', company: 'Google', email: 'jane.d@example.com', phone: '555-1234' },
    { id: 'AL02', name: 'John Smith', graduationYear: 2012, occupation: 'Doctor', company: 'City Hospital', email: 'john.s@example.com', phone: '555-5678' },
];
export const campaigns = [
    { id: 'CAMP01', title: 'New Library Wing', goal: 50000, raised: 12500, startDate: '2024-09-01', endDate: '2025-03-01' },
];
export const pledges = [
    { id: 'PL01', alumniId: 'AL01', campaignId: 'CAMP01', amount: 1000, date: '2024-09-15', status: 'Pledged' },
];
export const donations = [
    { id: 'DON01', alumniId: 'AL02', amount: 500, date: '2024-09-20', purpose: 'Scholarship Fund', campaignId: null },
];
export const mentorships = [
    { id: 'MENT01', mentorId: 'AL01', menteeId: 'S001', startDate: '2024-10-01', status: 'Active' },
];

export const healthRecords = [
    { studentId: 'S001', bloodGroup: 'O+', allergies: ['Peanuts'], vaccinations: [{ name: 'MMR', date: '2010-05-20' }, { name: 'Polio', date: '2010-07-15' }] },
];

export const clinicVisits = [
    { id: 'CV01', studentId: 'S001', reason: 'Fever and cough', treatment: 'Prescribed paracetamol', date: '2024-09-28' },
];

export const assets = [
    { id: 'AST01', name: 'Dell Latitude 5420 (SN: ABC123)', type: 'Device', status: 'In Use', assignedTo: 'T02', purchaseDate: '2023-01-15' },
    { id: 'AST02', name: 'Epson Projector (SN: XYZ987)', type: 'Equipment', status: 'Available', assignedTo: null, purchaseDate: '2022-08-20' },
];

export const skills = [
  { id: 'skill-1', name: 'Critical Thinking', studentId: 'S001' },
  { id: 'skill-2', name: 'Data Analysis', studentId: 'S001' },
  { id: 'skill-3', name: 'Creative Writing', studentId: 'S001' },
];

export const threads = [
    { id: 'thread-1', title: 'Questions about Photosynthesis Essay', authorName: 'Alice Johnson', createdAt: '2024-10-20T10:00:00Z', replies: [
        { authorName: 'Mr. Samuel Jones', content: "Great question! Make sure to focus on the Calvin Cycle.", createdAt: '2024-10-20T11:30:00Z' },
        { authorName: 'Alice Johnson', content: "Thank you, that helps!", createdAt: '2024-10-20T12:00:00Z' }
    ]}
];

export const badges = [
    { id: 'badge-1', name: 'Perfect Attendance', description: 'Attended all classes in a month.', icon: 'Star' },
    { id: 'badge-2', name: 'Top Performer', description: 'Scored above 90% in an exam.', icon: 'Trophy' },
    { id: 'badge-3', name: 'Bookworm', description: 'Read 5+ library books.', icon: 'BookOpen' },
    { id: 'badge-4', name: 'Master Debater', description: 'Actively participated in forum discussions.', icon: 'Brain' }
];

export const careerInterests = [
    { id: 'int-1', name: 'Technology' },
    { id: 'int-2', name: 'Healthcare' },
    { id: 'int-3', name: 'Arts & Design' },
];

export const careerPaths = [
    { id: 'cp-1', name: 'Software Engineer', interestId: 'int-1' },
    { id: 'cp-2', name: 'Data Scientist', interestId: 'int-1' },
    { id: 'cp-3', name: 'Doctor', interestId: 'int-2' },
    { id: 'cp-4', name: 'Nurse', interestId: 'int-2' },
    { id: 'cp-5', name: 'Graphic Designer', interestId: 'int-3' },
];

export const payrollRecords: any[] = []
