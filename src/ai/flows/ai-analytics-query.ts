
'use server';
/**
 * @fileOverview An AI-powered analytics query handler.
 *
 * - getAnalyticsQuery - A function that takes a natural language query and returns a structured result.
 * - AnalyticsQueryOutput - The return type for the getAnalyticsQuery function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyticsQueryOutputSchema = z.object({
  result: z.string().describe("A formatted string containing the answer to the user's query, suitable for display in a <pre> tag."),
});
export type AnalyticsQueryOutput = z.infer<typeof AnalyticsQueryOutputSchema>;

export async function getAnalyticsQuery(query: string): Promise<AnalyticsQueryOutput> {
  return getAnalyticsQueryFlow(query);
}

const prompt = ai.definePrompt({
  name: 'getAnalyticsQueryPrompt',
  input: {schema: z.string()},
  output: {schema: AnalyticsQueryOutputSchema},
  prompt: `You are a school analytics AI assistant. You will receive a natural language query about school data.
  Your task is to provide a plausible, well-formatted, mock answer to the query.
  The user knows this is a mock interface, so you don't need to state that the data is fake.
  Just provide a realistic-looking answer.

  Example Query: "Who are the top 5 performing students in the last exam?"
  Example Response:
  Top 5 Students (Final Exam):
  1. Bob Williams - 87.7%
  2. Alice Johnson - 87.6%
  3. Fiona Garcia - 85.1%
  4. George Rodriguez - 84.4%
  5. Ethan Davis - 82.9%

  Example Query: "Show me a summary of staff leave utilization."
  Example Response:
  Staff Leave Utilization Summary:
  - Dr. Evelyn Reed: 5/20 (25%)
  - Mr. Samuel Jones: 3/15 (20%)
  - Ms. Clara Oswald: 8/15 (53%) - HIGH
  - Mr. Peter Capaldi: 2/12 (17%)

  User Query:
  "{{{query}}}"

  Provide a plausible, mock response based on the query.
  `,
});

const getAnalyticsQueryFlow = ai.defineFlow(
  {
    name: 'getAnalyticsQueryFlow',
    inputSchema: z.string(),
    outputSchema: AnalyticsQueryOutputSchema,
  },
  async query => {
    const {output} = await prompt(query);
    return output!;
  }
);
