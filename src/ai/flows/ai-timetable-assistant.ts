'use server';

/**
 * @fileOverview An AI-powered timetable assistant for generating conflict-free timetables.
 *
 * - generateTimetable - A function that generates a timetable based on course schedules and instructor availability.
 * - TimetableInput - The input type for the generateTimetable function.
 * - TimetableOutput - The return type for the generateTimetable function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TimetableInputSchema = z.object({
  courseSchedules: z
    .string()
    .describe('The course schedules, including course name, duration, and days.'),
  instructorAvailability: z
    .string()
    .describe('The instructor availability, including instructor name and available time slots.'),
});
export type TimetableInput = z.infer<typeof TimetableInputSchema>;

const TimetableOutputSchema = z.object({
  timetable: z.string().describe('The generated conflict-free timetable.'),
});
export type TimetableOutput = z.infer<typeof TimetableOutputSchema>;

export async function generateTimetable(input: TimetableInput): Promise<TimetableOutput> {
  return generateTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: TimetableInputSchema},
  output: {schema: TimetableOutputSchema},
  prompt: `You are a timetable scheduling assistant. You are provided with a list of courses and their schedules, along with instructor availability.

  Your task is to generate a conflict-free timetable that accommodates all courses and instructors. If there are any courses that are difficult to schedule, include a warning message.

  Course Schedules:
  {{courseSchedules}}

  Instructor Availability:
  {{instructorAvailability}}

  Timetable:
  `,
});

const generateTimetableFlow = ai.defineFlow(
  {
    name: 'generateTimetableFlow',
    inputSchema: TimetableInputSchema,
    outputSchema: TimetableOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
