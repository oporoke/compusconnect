
"use server";
/**
 * @fileOverview AI flows for generating career pathways and academic goals.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

// Career Pathway Generation
const CareerPathwayInputSchema = z.object({
  studentInterests: z.array(z.string()).describe("A list of the student's interests (e.g., 'Technology', 'Healthcare')."),
  targetCareer: z.string().describe("The student's chosen target career (e.g., 'Software Engineer').")
});

const CareerPathwayOutputSchema = z.object({
  pathway: z.object({
      introduction: z.string().describe("A brief, encouraging introduction to the career path."),
      milestones: z.array(z.object({
          stage: z.enum(["High School", "University", "Career"]),
          title: z.string().describe("The title of the milestone (e.g., 'Excel in Key Subjects', 'Bachelor's Degree in Computer Science'])."),
          description: z.string().describe("A one-sentence description of the milestone."),
      })).describe("A list of key milestones from high school to career entry.")
  })
});

const careerPathwayPrompt = ai.definePrompt({
    name: 'careerPathwayPrompt',
    input: { schema: CareerPathwayInputSchema },
    output: { schema: CareerPathwayOutputSchema },
    prompt: `You are a futuristic AI career guidance counselor.
    
    A student has expressed interest in a specific career. Your task is to generate a simplified, high-level roadmap for them, from high school to their first job.
    
    Student's Target Career: {{{targetCareer}}}
    Student's Interests: {{{studentInterests}}}
    
    Generate a Career Pathway with an introduction and 3-4 key milestones.
    Milestones should include:
    1.  A "High School" milestone focusing on key subjects.
    2.  A "University" milestone suggesting a relevant degree.
    3.  One or two "Career" milestones about internships or first jobs.
    
    Be positive, encouraging, and clear.
    `,
});

export async function generateCareerPathways(input: z.infer<typeof CareerPathwayInputSchema>) {
  const {output} = await careerPathwayPrompt(input);
  return output!;
}


// Academic Goal Setting
const AcademicGoalInputSchema = z.object({
    currentScores: z.string().describe("A JSON string of the student's current scores, e.g., '{\"Math\": 85, \"Science\": 92}'.") ,
    targetCareer: z.string().describe("The student's chosen target career.")
});

const AcademicGoalOutputSchema = z.object({
    goals: z.object({
        summary: z.string().describe("A brief summary of the academic recommendations."),
        recommendations: z.array(z.object({
            area: z.string().describe("The subject or area for improvement."),
            recommendation: z.string().describe("A specific, actionable recommendation."),
        }))
    })
});

const academicGoalPrompt = ai.definePrompt({
    name: 'academicGoalPrompt',
    input: { schema: AcademicGoalInputSchema },
    output: { schema: AcademicGoalOutputSchema },
    prompt: `You are an AI academic advisor.
    
    A student has a target career and you have their current scores. Your task is to set 2-3 realistic, actionable academic goals to help them achieve their career aspiration.
    
    Target Career: {{{targetCareer}}}
    Current Scores: {{{currentScores}}}
    
    Analyze the scores in relation to the career. For example, an aspiring engineer with a low Math score needs a recommendation to improve it.
    
    Generate a list of recommendations.
    `
});

export async function setAcademicGoals(input: z.infer<typeof AcademicGoalInputSchema>) {
    const {output} = await academicGoalPrompt(input);
    return output!;
}

    