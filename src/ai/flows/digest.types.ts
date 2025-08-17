/**
 * @fileOverview Shared types and schemas for the AI Weekly Digest flow.
 */
import {z} from 'zod';

export const WeeklyDigestInputSchema = z.object({
  studentName: z.string().describe("The student's name."),
  logEntries: z
    .string()
    .describe('A newline-separated list of log entries for the week.'),
});
export type WeeklyDigestInput = z.infer<typeof WeeklyDigestInputSchema>;

export const WeeklyDigestOutputSchema = z.object({
  kudos: z
    .array(z.string())
    .describe('A list of positive highlights or achievements.'),
  concerns: z
    .array(z.string())
    .describe(
      'A list of areas that may need attention, framed constructively.'
    ),
});
export type WeeklyDigestOutput = z.infer<typeof WeeklyDigestOutputSchema>;
