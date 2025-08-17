
'use server';
/**
 * @fileOverview An AI-powered chatbot for querying student data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import prisma from '@/lib/db';

const StudentInfoInputSchema = z.object({
    studentId: z.string().describe("The ID of the student, e.g., S001"),
});

// Tool to get student's latest grades
const getLatestGrades = ai.defineTool(
  {
    name: 'getLatestGrades',
    description: "Get the most recent exam grades for a specific student.",
    inputSchema: StudentInfoInputSchema,
    outputSchema: z.object({
        examName: z.string(),
        grades: z.record(z.number()),
    }),
  },
  async ({ studentId }) => {
    const latestExam = await prisma.exam.findFirst({ orderBy: { date: 'desc' } });
    if (!latestExam) throw new Error("No exams found.");

    const grades = await prisma.grade.findUnique({
      where: { studentId_examId: { studentId, examId: latestExam.id } },
    });
    if (!grades) throw new Error("No grades found for the latest exam.");
    
    return { examName: latestExam.name, grades: grades.scores as Record<string, number> };
  }
);

// Tool to get student's attendance summary
const getAttendanceSummary = ai.defineTool(
  {
    name: 'getAttendanceSummary',
    description: "Get a summary of a student's attendance.",
    inputSchema: StudentInfoInputSchema,
    outputSchema: z.object({
        totalDays: z.number(),
        presentDays: z.number(),
        percentage: z.number(),
    }),
  },
  async ({ studentId }) => {
    const attendanceRecords = await prisma.attendanceRecord.findMany({ where: { studentId } });
    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(r => r.present).length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;
    return { totalDays, presentDays, percentage };
  }
);

const ChatbotInputSchema = z.object({
  studentId: z.string(),
  question: z.string(),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the user's question."),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: { schema: ChatbotInputSchema },
    output: { schema: ChatbotOutputSchema },
    tools: [getLatestGrades, getAttendanceSummary],
    system: `You are a helpful school assistant chatbot. Your role is to answer questions from parents or students about their academic progress.
    Use the provided tools to answer questions about grades or attendance for the given studentId.
    Be friendly and conversational. Keep your answers concise.
    If you don't know the answer or the question is outside of academics, politely say that you cannot help with that request.
    The current student's ID is: {{{studentId}}}. You MUST use this ID when calling any tools.
    `,
});


export async function getChatbotResponse(input: ChatbotInput): Promise<ChatbotOutput> {
    const {output} = await chatbotPrompt({
        studentId: input.studentId,
        prompt: input.question,
    });
    
    return output!;
}
