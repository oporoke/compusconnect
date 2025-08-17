
import { faker } from '@faker-js/faker';
import type { Student, Exam, Grade, Staff, Admission, Invoice, Payment, PayrollRecord, Expense } from './data';
import { AttendanceRecord } from '@/hooks/use-students';
import { subDays, format } from 'date-fns';

const GRADES = ['9', '10', '11', '12'];
const SECTIONS = ['A', 'B', 'C'];
const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Art', 'Physical Education'];

export function generateMockStudents(count: number) {
    const students: Student[] = [];
    const grades: Grade[] = [];
    const attendance: AttendanceRecord[] = [];
    const exams: Exam[] = [
        { id: 'E01', name: 'Mid-Term Exam', date: format(subDays(new Date(), 90), 'yyyy-MM-dd'), subjects: SUBJECTS.slice(0, 4) },
        { id: 'E02', name: 'Final Exam', date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), subjects: SUBJECTS },
    ];

    for (let i = 1; i <= count; i++) {
        const studentId = `S${i.toString().padStart(3, '0')}`;
        const student: Student = {
            id: studentId,
            name: faker.person.fullName(),
            grade: faker.helpers.arrayElement(GRADES),
            section: faker.helpers.arrayElement(SECTIONS),
        };

        if (faker.number.int({ min: 1, max: 10 }) > 8) {
            student.discipline = [{
                id: `D${i}`,
                date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
                reason: faker.helpers.arrayElement(['Late Submission', 'Uniform Infraction', 'Class Disruption']),
                actionTaken: 'Warning',
            }];
        }
        students.push(student);

        // Generate grades for exams
        exams.forEach(exam => {
            const grade: Grade = {
                studentId,
                examId: exam.id,
                scores: {},
            };
            exam.subjects.forEach(subject => {
                grade.scores[subject] = faker.number.int({ min: 45, max: 100 });
            });
            grades.push(grade);
        });

        // Generate attendance
        for (let j = 0; j < 30; j++) { // Last 30 days of attendance
            attendance.push({
                studentId,
                date: subDays(new Date(), j).toISOString().split('T')[0],
                present: faker.number.int({ min: 1, max: 100 }) > 5, // 95% chance of being present
            });
        }
    }

    return { students, grades, exams, attendance };
}
