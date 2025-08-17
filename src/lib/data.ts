
export interface Student {
    id: string;
    name: string;
    grade: string;
    section: string;
}

export interface Grade {
    studentId: string;
    math: number;
    science: number;
    english: number;
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

export const grades: Grade[] = [
    { studentId: 'S001', math: 85, science: 92, english: 78 },
    { studentId: 'S002', math: 90, science: 88, english: 82 },
    { studentId: 'S003', math: 72, science: 75, english: 80 },
    { studentId: 'S004', math: 95, science: 98, english: 92 },
    { studentId: 'S005', math: 88, science: 90, english: 85 },
    { studentId: 'S006', math: 78, science: 82, english: 70 },
    { studentId: 'S007', math: 92, science: 95, english: 88 },
];

export const courseMaterials = [
    { id: 'CM01', subject: 'Math', title: 'Algebra Basics', type: 'PDF', link: '#' },
    { id: 'CM02', subject: 'Science', title: 'Cellular Biology', type: 'Video', link: '#' },
    { id: 'CM03', subject: 'English', title: 'Shakespeare\'s Sonnets', type: 'Document', link: '#' },
    { id: 'CM04', subject: 'History', title: 'The World Wars', type: 'Slides', link: '#' },
];

export const assignments = [
    { id: 'AS01', title: 'Algebra Worksheet', subject: 'Math', dueDate: '2024-10-20', status: 'Pending' },
    { id: 'AS02', title: 'Lab Report', subject: 'Science', dueDate: '2024-10-22', status: 'Submitted' },
    { id: 'AS03', title: 'Essay on Macbeth', subject: 'English', dueDate: '2024-10-25', status: 'Graded' },
    { id: 'AS04', title: 'Research Paper', subject: 'History', dueDate: '2024-11-01', status: 'Pending' },
];

export const onlineClasses = [
    { id: 'OC01', subject: 'Math', topic: 'Geometry', time: 'Mon, 10:00 AM', link: '#' },
    { id: 'OC02', subject: 'Science', topic: 'Photosynthesis', time: 'Tue, 11:00 AM', link: '#' },
    { id: 'OC03', subject: 'English', topic: 'Grammar Review', time: 'Wed, 9:00 AM', link: '#' },
    { id: 'OC04', subject: 'History', topic: 'Ancient Civilizations', time: 'Thu, 2:00 PM', link: '#' },
];
