
'use server';
/**
 * @fileOverview An AI-powered lesson plan generator.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const LessonPlanInputSchema = z.object({
  topic: z.string().describe('The main topic for the lesson plan.'),
  gradeLevel: z.string().describe('The grade level of the students.'),
  duration: z.string().describe('The duration of the lesson plan (e.g., 1 week, 5 lessons).'),
});
export type LessonPlanInput = z.infer<typeof LessonPlanInputSchema>;

export const LessonPlanOutputSchema = z.object({
  lessonPlan: z
    .string()
    .describe('The detailed, structured lesson plan formatted in Markdown. It should include sections for Learning Objectives, Materials, and a day-by-day or lesson-by-lesson breakdown of Activities and Assessments.'),
});
export type LessonPlanOutput = z.infer<typeof LessonPlanOutputSchema>;


const lessonPlannerPrompt = ai.definePrompt({
    name: 'lessonPlannerPrompt',
    input: { schema: LessonPlanInputSchema },
    output: { schema: LessonPlanOutputSchema },
    prompt: `You are an expert instructional designer and teacher. Create a detailed lesson plan based on the following inputs.

Topic: {{{topic}}}
Grade Level: {{{gradeLevel}}}
Duration: {{{duration}}}

The lesson plan should be well-structured, engaging, and appropriate for the specified grade level. Format the output in Markdown.

Include the following sections:
### Learning Objectives
- List 3-5 clear and measurable learning objectives.

### Materials
- List all necessary materials for the lessons.

### Lesson Breakdown
Provide a day-by-day or lesson-by-lesson plan. For each lesson:
- **Topic**: A specific sub-topic for the lesson.
- **Activities**: Describe the teaching and student activities in detail. Include a mix of activities like direct instruction, group work, hands-on experiments, or discussions.
- **Assessment**: Describe how student understanding will be assessed (e.g., exit ticket, quiz, observation).

Generate the lesson plan now.
`,
});


export async function generateLessonPlan(input: LessonPlanInput): Promise<LessonPlanOutput> {
  const {output} = await lessonPlannerPrompt(input);
  return output!;
}
