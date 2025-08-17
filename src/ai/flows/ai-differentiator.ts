
'use server';
/**
 * @fileOverview An AI-powered content differentiator.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const DifferentiatorInputSchema = z.object({
  originalText: z.string().describe('The original text content to be adapted.'),
  targetLevel: z.enum(['standard', 'simplified', 'advanced']).describe('The target reading level.'),
});
export type DifferentiatorInput = z.infer<typeof DifferentiatorInputSchema>;

export const DifferentiatorOutputSchema = z.object({
  differentiatedText: z.string().describe('The adapted text content.'),
});
export type DifferentiatorOutput = z.infer<typeof DifferentiatorOutputSchema>;

const differentiationPrompt = ai.definePrompt({
    name: 'differentiationPrompt',
    input: { schema: DifferentiatorInputSchema },
    output: { schema: DifferentiatorOutputSchema },
    prompt: `You are an expert curriculum developer. Your task is to rewrite the provided text for a specific reading level.

- If the target level is 'simplified', rewrite the text using simpler vocabulary, shorter sentences, and provide analogies where possible. Break down complex ideas into smaller, more digestible parts.
- If the target level is 'standard', ensure the text is clear, well-structured, and appropriate for the average student at the specified grade level.
- If the target level is 'advanced', enrich the text with more sophisticated vocabulary, complex sentence structures, and introduce deeper, related concepts to challenge high-achieving students.

Original Text:
{{{originalText}}}

Target Level: {{{targetLevel}}}

Rewrite the text now.
`,
});

export async function differentiateContent(input: DifferentiatorInput): Promise<DifferentiatorOutput> {
  const {output} = await differentiationPrompt(input);
  return output!;
}
