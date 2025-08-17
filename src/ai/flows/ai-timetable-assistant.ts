
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
  timetable: z.string().describe('The generated conflict-free timetable, formatted as plain text. For each day, list the time slots and the scheduled class, including course, instructor, and room number.'),
});
export type TimetableOutput = z.infer<typeof TimetableOutputSchema>;

export async function generateTimetable(input: TimetableInput): Promise<TimetableOutput> {
  return generateTimetableFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTimetablePrompt',
  input: {schema: TimetableInputSchema},
  output: {schema: TimetableOutputSchema},
  prompt: `You are a highly efficient school timetable scheduling AI. You are provided with a list of courses, their schedules, room requirements, and instructor availability.

  Your task is to generate a conflict-free weekly timetable from 9:00 AM to 5:00 PM, Monday to Friday.
  
  Assign a unique room number (e.g., 101, 102, 201) for each class session. Ensure that no instructor or room is booked for two different classes at the same time.

  If there are any potential conflicts (e.g., an instructor is unavailable, or a course is hard to schedule), you MUST still schedule it but include a clear warning in your output.
  
  Format the output clearly with each day as a major heading. Under each day, list the time slots and the scheduled event.

  Example Output Format:
  Monday:
    9:00 AM - 10:00 AM: Math 101 (Dr. Smith) - Room 101
    10:00 AM - 11:00 AM: Physics 201 (Prof. Jones) - Room 203
  Tuesday:
    9:00 AM - 10:00 AM: English 101 (Ms. Davis) - Room 102
  ...and so on for the rest of the week.

  Course Schedules:
  {{courseSchedules}}

  Instructor Availability:
  {{instructorAvailability}}

  Generate the full, formatted timetable now.
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
