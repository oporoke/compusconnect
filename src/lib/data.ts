export const students = [
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

export const grades = [
    { studentId: 'S001', math: 85, science: 92, english: 78 },
    { studentId: 'S002', math: 90, science: 88, english: 82 },
    { studentId: 'S003', math: 72, science: 75, english: 80 },
    { studentId: 'S004', math: 95, science: 98, english: 92 },
    { studentId: 'S005', math: 88, science: 90, english: 85 },
    { studentId: 'S006', math: 78, science: 82, english: 70 },
    { studentId: 'S007', math: 92, science: 95, english: 88 },
];
