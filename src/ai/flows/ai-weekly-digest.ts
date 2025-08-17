
'use server';
/**
 * @fileOverview An AI-powered flow to generate a weekly digest for parents.
 */

import {ai} from '@/ai/genkit';
import {
  WeeklyDigestInputSchema,
  WeeklyDigestOutputSchema,
  WeeklyDigestInput,
  WeeklyDigestOutput,
} from './digest.types';

const weeklyDigestPrompt = ai.definePrompt({
  name: 'weeklyDigestPrompt',
  input: {schema: WeeklyDigestInputSchema},
  output: {schema: WeeklyDigestOutputSchema},
  prompt: `You are a helpful and positive school AI assistant. Your task is to analyze a week's worth of log entries for a student and create a summary for their parent.

Student: {{{studentName}}}
Weekly Log Entries:
{{{logEntries}}}

Review the entries and categorize them into two lists:
1.  'kudos': Positive achievements, high scores (above 85), perfect attendance mentions, etc.
2.  'concerns': Areas needing attention, like missed assignments, low scores (below 60), or absences. Phrase these constructively.

Extract 2-3 items for each category if available. If a category has no items, return an empty array for it.
`,
});

export async function generateWeeklyDigest(
  input: WeeklyDigestInput
): Promise<WeeklyDigestOutput> {
  const {output} = await weeklyDigestPrompt(input);
  return output!;
}
