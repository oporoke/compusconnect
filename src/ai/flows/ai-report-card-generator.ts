'use server';

/**
 * @fileOverview An AI-powered report card generator.
 *
 * - generateReportCard - A function that generates a personalized report card summary and a full report.
 * - ReportCardInput - The input type for the generateReportCard function.
 * - ReportCardOutput - The return type for the generateReportCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReportCardInputSchema = z.object({
  studentName: z.string().describe('The name of the student.'),
  grades: z.string().describe('A string of subjects and grades, e.g., "Math: 85, Science: 92, English: 78".'),
});
export type ReportCardInput = z.infer<typeof ReportCardInputSchema>;

const ReportCardOutputSchema = z.object({
  summary: z.string().describe("A brief, encouraging, and personalized summary of the student's performance."),
  reportCard: z.string().describe('The full, formatted report card text.'),
});
export type ReportCardOutput = z.infer<typeof ReportCardOutputSchema>;

export async function generateReportCard(input: ReportCardInput): Promise<ReportCardOutput> {
  return generateReportCardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReportCardPrompt',
  input: {schema: ReportCardInputSchema},
  output: {schema: ReportCardOutputSchema},
  prompt: `You are an experienced and caring teacher. Your task is to generate a student report card based on their grades.

  **Student Name:** {{studentName}}
  **Grades:** {{grades}}

  **Instructions:**
  1.  **Generate a Summary:** Write a brief, positive, and encouraging summary (2-3 sentences) of the student's performance. Highlight their strengths and provide constructive feedback for areas of improvement in a gentle manner.
  2.  **Generate a Full Report Card:** Create a formatted report card that includes:
      - A header with "Report Card".
      - Student's Name.
      - A table-like structure for subjects, grades, and remarks.
      - Provide a brief, positive remark for each subject.
      - A concluding positive remark.

  **Example Output Format:**

  **Summary:** A short paragraph.

  **Report Card:**
  *************************
  *      REPORT CARD      *
  *************************
  
  Student: {{studentName}}
  
  -------------------------
  Subject | Grade | Remarks
  -------------------------
  Math    | 85    | Good effort!
  Science | 92    | Excellent work!
  ...
  
  Well done, {{studentName}}!
  `,
});

const generateReportCardFlow = ai.defineFlow(
  {
    name: 'generateReportCardFlow',
    inputSchema: ReportCardInputSchema,
    outputSchema: ReportCardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
