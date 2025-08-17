'use server';
/**
 * @fileOverview An AI-powered canteen assistant for providing nutritional feedback.
 *
 * - getCanteenSuggestion - A function that generates nutritional advice based on purchase history.
 * - CanteenSuggestionInput - The input type for the getCanteenSuggestion function.
 * - CanteenSuggestionOutput - The return type for the getCanteenSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CanteenSuggestionInputSchema = z.object({
  studentName: z.string().describe("The name of the student."),
  purchaseHistory: z.string().describe("A list of food items the student has recently purchased."),
});
export type CanteenSuggestionInput = z.infer<typeof CanteenSuggestionInputSchema>;

const CanteenSuggestionOutputSchema = z.object({
  suggestion: z.string().describe("A brief, helpful, and friendly nutritional analysis and suggestion."),
});
export type CanteenSuggestionOutput = z.infer<typeof CanteenSuggestionOutputSchema>;

export async function getCanteenSuggestion(input: CanteenSuggestionInput): Promise<CanteenSuggestionOutput> {
  return getCanteenSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCanteenSuggestionPrompt',
  input: {schema: CanteenSuggestionInputSchema},
  output: {schema: CanteenSuggestionOutputSchema},
  prompt: `You are a friendly school nutritionist AI. You will receive a student's name and their recent canteen purchase history.

Your task is to provide a short, positive, and helpful nutritional analysis. Focus on balance and making healthy suggestions. Avoid being overly critical.

Student: {{{studentName}}}
Purchase History:
{{{purchaseHistory}}}

Generate a suggestion.
Example: "It looks like {{{studentName}}} is enjoying our burgers and fries! To add more variety, how about trying the grilled chicken salad next time? It's a great source of protein and vitamins!"
`,
});

const getCanteenSuggestionFlow = ai.defineFlow(
  {
    name: 'getCanteenSuggestionFlow',
    inputSchema: CanteenSuggestionInputSchema,
    outputSchema: CanteenSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
