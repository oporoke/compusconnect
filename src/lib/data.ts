
export interface Student {
    id: string;
    name: string;
    grade: string;
    section: string;
}

export interface Exam {
    id: string;
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
    { id: 'S001', name: 'Alice Johnson', grade: '10', section: 'A' },
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
};

export const admissions: Admission[] = [
    { id: 'APP001', name: 'Olivia Martinez', age: 14, previousSchool: 'Northwood Middle', grade: '9', parentName: 'Daniel Martinez', parentEmail: 'daniel@example.com', date: '2024-08-01', status: 'Pending' },
    { id: 'APP002', name: 'James Wilson', age: 15, previousSchool: 'Southside High', grade: '10', parentName: 'Sophia Wilson', parentEmail: 'sophia@example.com', date: '2024-08-03', status: 'Approved' },
    { id: 'APP003', name: 'Isabella Anderson', age: 14, previousSchool: 'Eastgate Prep', grade: '9', parentName: 'Liam Anderson', parentEmail: 'liam@example.com', date: '2024-08-05', status: 'Rejected' },
];
