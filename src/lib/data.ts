

export interface DisciplinaryRecord {
    id: string;
    date: string;
    reason: string;
    actionTaken: string;
}

export interface Student {
    id: string;
    name: string;
    grade: string;
    section: string;
    discipline?: DisciplinaryRecord[];
}

export interface Exam {
    id:string;
    name: string;
    date: string; // YYYY-MM-DD
    subjects: string[];
}

export interface Grade {
    studentId: string;
    examId: string;
    scores: Record<string, number>; // subject: score
}

export const students: Student[] = [
    { id: 'S001', name: 'Alice Johnson', grade: '10', section: 'A', discipline: [{ id: 'D01', date: '2024-09-15', reason: 'Late Submission', actionTaken: 'Warning' }] },
    { id: 'S002', name: 'Bob Williams', grade: '10', section: 'A' },
    { id: 'S003', name: 'Charlie Brown', grade: '10', section: 'B' },
    { id: 'S004', name: 'Diana Miller', grade: '11', section: 'A' },
    { id: 'S005', name: 'Ethan Davis', grade: '11', section: 'B' },
    { id: 'S006', name: 'Fiona Garcia', grade: '12', section: 'C' },
    { id: 'S007', name: 'George Rodriguez', grade: '12', section: 'A' },
];

export const exams: Exam[] = [
    { id: 'E01', name: 'Mid-Term Examination', date: '2024-10-15', subjects: ['Math', 'Science', 'English', 'History'] },
    { id: 'E02', name: 'Final Examination', date: '2024-12-10', subjects: ['Math', 'Science', 'English', 'History', 'Art'] },
];

export const grades: Grade[] = [
    { studentId: 'S001', examId: 'E01', scores: { 'Math': 85, 'Science': 92, 'English': 78, 'History': 88 } },
    { studentId: 'S002', examId: 'E01', scores: { 'Math': 90, 'Science': 88, 'English': 82, 'History': 91 } },
    { studentId: 'S003', examId: 'E01', scores: { 'Math': 72, 'Science': 75, 'English': 80, 'History': 68 } },
    { studentId: 'S001', examId: 'E02', scores: { 'Math': 88, 'Science': 94, 'English': 81, 'History': 90, 'Art': 95 } },
];


export const announcements = [
    { 
        id: 'A01', 
        title: 'Annual Sports Day', 
        date: '2024-10-15', 
        content: 'The annual sports day will be held on October 15th. All students are requested to participate in at least one event. The event list will be shared soon.' 
    },
    { 
        id: 'A02', 
        title: 'Parent-Teacher Meeting', 
        date: '2024-09-25', 
        content: 'A parent-teacher meeting is scheduled for September 25th to discuss the mid-term examination results. Please ensure your presence.' 
    },
    { 
        id: 'A03', 
        title: 'Science Fair 2024', 
        date: '2024-11-05', 
        content: 'Get ready for the annual Science Fair! Start preparing your projects. The registration deadline is October 20th.' 
    },
];

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

export type CourseMaterial = { id: string; subject: string; title: string; type: string; link: string; };
export const courseMaterials: CourseMaterial[] = [
    { id: 'CM01', subject: 'Math', title: 'Algebra Basics', type: 'PDF', link: '#' },
    { id: 'CM02', subject: 'Science', title: 'Cellular Biology', type: 'Video', link: '#' },
    { id: 'CM03', subject: 'English', title: 'Shakespeare\'s Sonnets', type: 'Document', link: '#' },
    { id: 'CM04', subject: 'History', title: 'The World Wars', type: 'Slides', link: '#' },
];

export type Assignment = { id: string; title: string; subject: string; dueDate: string; status: 'Pending' | 'Submitted' | 'Graded'; };
export const assignments: Assignment[] = [
    { id: 'AS01', title: 'Algebra Worksheet', subject: 'Math', dueDate: '2024-10-20', status: 'Pending' },
    { id: 'AS02', title: 'Lab Report', subject: 'Science', dueDate: '2024-10-22', status: 'Submitted' },
    { id: 'AS03', title: 'Essay on Macbeth', subject: 'English', dueDate: '2024-10-25', status: 'Graded' },
    { id: 'AS04', title: 'Research Paper', subject: 'History', dueDate: '2024-11-01', status: 'Pending' },
];

export type OnlineClass = { id: string; subject: string; topic: string; time: string; link: string; };
export const onlineClasses: OnlineClass[] = [
    { id: 'OC01', subject: 'Math', topic: 'Geometry', time: 'Mon, 10:00 AM', link: '#' },
    { id: 'OC02', subject: 'Science', topic: 'Photosynthesis', time: 'Tue, 11:00 AM', link: '#' },
    { id: 'OC03', subject: 'English', topic: 'Grammar Review', time: 'Wed, 9:00 AM', link: '#' },
    { id: 'OC04', subject: 'History', topic: 'Ancient Civilizations', time: 'Thu, 2:00 PM', link: '#' },
];

export type AdmissionDocument = {
    name: string;
    type: string;
    size: number;
}
export type Admission = {
    id: string;
    name: string;
    age: number;
    previousSchool: string;
    grade: string;
    parentName: string;
    parentEmail: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    documents: AdmissionDocument[];
};

export const admissions: Admission[] = [
    { id: 'APP001', name: 'Olivia Martinez', age: 14, previousSchool: 'Northwood Middle', grade: '9', parentName: 'Daniel Martinez', parentEmail: 'daniel@example.com', date: '2024-08-01', status: 'Pending', documents: [] },
    { id: 'APP002', name: 'James Wilson', age: 15, previousSchool: 'Southside High', grade: '10', parentName: 'Sophia Wilson', parentEmail: 'sophia@example.com', date: '2024-08-03', status: 'Approved', documents: [] },
    { id: 'APP003', name: 'Isabella Anderson', age: 14, previousSchool: 'Eastgate Prep', grade: '9', parentName: 'Liam Anderson', parentEmail: 'liam@example.com', date: '2024-08-05', status: 'Rejected', documents: [] },
];

export interface LeaveRequest {
    id: string;
    staffId: string;
    reason: string;
    days: number;
    startDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}
export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  joiningDate: string;
  salary: number;
  leavesTaken: number;
  leavesAvailable: number;
  performanceNotes?: string;
  deductions: { tax: number; insurance: number };
}

export const staff: Staff[] = [
  { id: 'T01', name: 'Dr. Evelyn Reed', role: 'Principal', department: 'Administration', email: 'e.reed@example.com', phone: '123-456-7890', joiningDate: '2010-08-15', salary: 90000, leavesTaken: 5, leavesAvailable: 20, performanceNotes: 'Excellent leadership and administrative skills.', deductions: { tax: 15, insurance: 500 } },
  { id: 'T02', name: 'Mr. Samuel Jones', role: 'Math Teacher', department: 'Academics', email: 's.jones@example.com', phone: '123-456-7891', joiningDate: '2015-09-01', salary: 65000, leavesTaken: 3, leavesAvailable: 15, performanceNotes: 'Consistently receives positive feedback from students. Encourages classroom participation.', deductions: { tax: 12, insurance: 400 } },
  { id: 'T03', name: 'Ms. Clara Oswald', role: 'Science Teacher', department: 'Academics', email: 'c.oswald@example.com', phone: '123-456-7892', joiningDate: '2018-07-20', salary: 62000, leavesTaken: 8, leavesAvailable: 15, deductions: { tax: 12, insurance: 380 } },
  { id: 'T04', name: 'Mr. Peter Capaldi', role: 'Librarian', department: 'Library', email: 'p.capaldi@example.com', phone: '123-456-7893', joiningDate: '2019-01-10', salary: 55000, leavesTaken: 2, leavesAvailable: 12, performanceNotes: 'Has done a great job organizing the new fiction section.', deductions: { tax: 10, insurance: 350 } },
];
export const leaveRequests: LeaveRequest[] = [];


export interface Book {
  id: string;
  rfid: string;
  title: string;
  author: string;
  subject: string;
  isbn: string;
  quantity: number;
  available: number;
}
export interface StudentFee {
    studentId: string;
    type: 'late_fee' | 'transport' | 'hostel';
    amount: number;
    date: string;
}

export interface LibraryTransaction {
    id: string;
    studentId: string;
    bookId: string;
    type: 'borrow' | 'return';
    date: string; // YYYY-MM-DD
    dueDate?: string; // YYYY-MM-DD
}

export const books: Book[] = [
    { id: 'B001', rfid: 'RFID001', title: 'To Kill a Mockingbird', author: 'Harper Lee', subject: 'English', isbn: '978-0061120084', quantity: 5, available: 3 },
    { id: 'B002', rfid: 'RFID002', title: '1984', author: 'George Orwell', subject: 'English', isbn: '978-0451524935', quantity: 3, available: 3 },
    { id: 'B003', rfid: 'RFID003', title: 'A Brief History of Time', author: 'Stephen Hawking', subject: 'Science', isbn: '978-0553380163', quantity: 4, available: 2 },
    { id: 'B004', rfid: 'RFID004', title: 'The Elements of Style', author: 'Strunk & White', subject: 'General', isbn: '978-0205309023', quantity: 10, available: 10 },
    { id: 'B005', rfid: 'RFID005', title: 'Calculus: A Modern Approach', author: 'James Stewart', subject: 'Math', isbn: '978-1285740621', quantity: 6, available: 5 },
];

export const studentFees: StudentFee[] = [];

export const libraryTransactions: LibraryTransaction[] = [
    { id: 'L001', studentId: 'S001', bookId: 'B001', type: 'borrow', date: '2024-09-01', dueDate: '2024-09-15' },
    { id: 'L002', studentId: 'S003', bookId: 'B003', type: 'borrow', date: '2024-09-05', dueDate: '2024-09-19' },
];

export interface Vehicle {
    id: string;
    model: string;
    capacity: number;
    location: { lat: number; lng: number; };
}
export interface Driver {
    id: string;
    name: string;
    licenseNumber: string;
    contact: string;
}

export interface Route {
    id: string;
    name: string;
    stops: string[];
    vehicleId: string;
    driverId: string;
}
export interface TransportFeeRecord {
    id: string;
    studentId: string;
    routeId: string;
    amount: number;
    date: string;
}

export const vehicles: Vehicle[] = [
    { id: 'V01', model: 'Blue Bird Vision', capacity: 48, location: { lat: 34.0522, lng: -118.2437 } },
    { id: 'V02', model: 'Thomas Saf-T-Liner', capacity: 54, location: { lat: 34.0522, lng: -118.2437 } },
];
export const drivers: Driver[] = [
    { id: 'D01', name: 'John Doe', licenseNumber: 'DL12345', contact: '555-1234' },
    { id: 'D02', name: 'Jane Smith', licenseNumber: 'DL67890', contact: '555-5678' },
];
export const routes: Route[] = [
    { id: 'R01', name: 'Uptown Express', stops: ['Central Station', 'Oak Street', 'Maple Avenue', 'School'], vehicleId: 'V01', driverId: 'D01' },
    { id: 'R02', name: 'Downtown Local', stops: ['City Hall', 'Pine Street', 'Elm Street', 'School'], vehicleId: 'V02', driverId: 'D02' },
];
export const transportFeeRecords: TransportFeeRecord[] = [];


export interface Room {
    id: string;
    number: string;
    capacity: number;
    occupants: string[]; // student IDs
}
export interface Hostel {
    id: string;
    name: string;
    capacity: number;
    rooms: Room[];
}
export interface HostelFeeRecord {
    id: string;
    studentId: string;
    month: string;
    amount: number;
    date: string;
}
export interface MessMenu {
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
    breakfast: string;
    lunch: string;
    dinner: string;
}
export const hostels: Hostel[] = [
    {
        id: 'H01', name: 'Boys Hostel A', capacity: 10,
        rooms: [
            { id: 'R101', number: '101', capacity: 2, occupants: ['S002', 'S005'] },
            { id: 'R102', number: '102', capacity: 2, occupants: ['S007'] },
            { id: 'R103', number: '103', capacity: 2, occupants: [] },
        ]
    },
    {
        id: 'H02', name: 'Girls Hostel B', capacity: 10,
        rooms: [
            { id: 'R201', number: '201', capacity: 2, occupants: ['S001', 'S004'] },
            { id: 'R202', number: '202', capacity: 2, occupants: ['S006'] },
            { id: 'R203', number: '203', capacity: 2, occupants: ['S003'] },
        ]
    }
];
export const hostelFeeRecords: HostelFeeRecord[] = [];
export const messMenu: MessMenu[] = [
    { day: 'Monday', breakfast: 'Oatmeal', lunch: 'Pizza', dinner: 'Pasta' },
    { day: 'Tuesday', breakfast: 'Cereal', lunch: 'Sandwich', dinner: 'Stir-fry' },
    { day: 'Wednesday', breakfast: 'Eggs', lunch: 'Salad', dinner: 'Soup' },
    { day: 'Thursday', breakfast: 'Pancakes', lunch: 'Tacos', dinner: 'Curry' },
    { day: 'Friday', breakfast: 'Yogurt', lunch: 'Burgers', dinner: 'Roast Chicken' },
    { day: 'Saturday', breakfast: 'Waffles', lunch: 'Leftovers', dinner: 'Steak' },
    { day: 'Sunday', breakfast: 'French Toast', lunch: 'Brunch', dinner: 'Pot Roast' },
];

// Finance Module Data
export interface FeeStructure {
    id: string;
    name: string; // e.g., 'Annual Tuition', 'Activity Fee'
    amount: number;
    grades: string[]; // e.g., ['9', '10', '11', '12'] or ['all']
}
export interface InvoiceItem {
    description: string;
    amount: number;
}
export interface Invoice {
    id: string;
    studentId: string;
    date: string; // YYYY-MM-DD
    dueDate: string; // YYYY-MM-DD
    items: InvoiceItem[];
    total: number;
    status: 'Paid' | 'Unpaid' | 'Overdue';
}
export interface Payment {
    id: string;
    invoiceId: string;
    amount: number;
    date: string;
    method: 'Card' | 'Cash' | 'Bank Transfer';
}
export interface PayrollRecord {
    id: string;
    staffId: string;
    month: string; // e.g., '2024-10'
    grossSalary: number;
    deductions: number;
    netSalary: number;
    date: string;
}
export interface Expense {
    id: string;
    category: 'Utilities' | 'Maintenance' | 'Supplies' | 'Other';
    description: string;
    amount: number;
    date: string;
}

export const feeStructures: FeeStructure[] = [
    { id: 'FS01', name: 'Annual Tuition', amount: 5000, grades: ['all'] },
    { id: 'FS02', name: 'Activity Fee', amount: 200, grades: ['all'] },
    { id: 'FS03', name: 'Transport Fee - Uptown', amount: 800, grades: ['all'] },
    { id: 'FS04', name: 'Hostel Fee', amount: 2500, grades: ['all'] },
];
export const invoices: Invoice[] = [
    // Add an overdue invoice for testing reminders
    { id: 'INV-S001-1672531200000', studentId: 'S001', date: '2024-08-01', dueDate: '2024-09-01', items: [{ description: 'Annual Tuition', amount: 5000 }], total: 5000, status: 'Unpaid' }
];
export const payments: Payment[] = [];
export const payrollRecords: PayrollRecord[] = [];
export const expenses: Expense[] = [];


// Communication Module Data
export interface Message {
    sender: string; // User's name
    content: string;
    timestamp: string; // ISO 8601
}
export type Conversation = Message[];

// Key is a sorted combination of two user names, e.g., "Admin User-Student User"
export const messages: Record<string, Conversation> = {
    'Admin User-Student User': [
        { sender: 'Admin User', content: 'Welcome to CampusConnect Lite!', timestamp: '2024-09-10T10:00:00Z' },
        { sender: 'Student User', content: 'Thank you!', timestamp: '2024-09-10T10:01:00Z' },
    ],
    'Parent User-Teacher User': [
        { sender: 'Parent User', content: 'Hi, I wanted to ask about Alice\'s progress in Math.', timestamp: '2024-09-11T14:00:00Z' },
    ]
};

export interface Event {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    description: string;
}

export const events: Event[] = [
    { id: 'EVT01', title: 'Parent-Teacher Meeting', date: '2024-10-25', description: 'Discuss student progress for the first term.' },
    { id: 'EVT02', title: 'Science Fair', date: '2024-11-15', description: 'Annual science fair for grades 9-12.' },
    { id: 'EVT03', title: 'Winter Break', date: '2024-12-20', description: 'School closed for winter break.' },
];

    