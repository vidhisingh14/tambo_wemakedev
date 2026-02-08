import Cerebras from '@cerebras/cerebras_cloud_sdk';

const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY,
});

export async function analyzeResume(resumeText: string, targetRole: string) {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content: `You are an expert ATS (Applicant Tracking System) resume analyzer and career coach. 
          Analyze resumes for job applications and provide actionable feedback.
          Return your analysis in JSON format with:
          - overallScore (0-100)
          - keywordsFound (number)
          - totalKeywords (number)
          - impactLevel ("High", "Medium", or "Low")
          - criticalGaps (array of {skill, description, suggestion, priority})
          - suggestedEdits (array of {type, original, improved, impact})`
        },
        {
          role: 'user',
          content: `Analyze this resume for the role of ${targetRole}:

${resumeText}

Provide:
1. ATS compatibility score (0-100)
2. Keywords found vs. expected
3. Critical skill gaps
4. Specific improvement suggestions with before/after examples`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = (response as any).choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error analyzing resume:', error);
    throw error;
  }
}

export async function generateStudyPlan(
  skills: Array<{ subject: string; proficiency: number }>,
  targetRole: string,
  currentLevel: number
) {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical interview coach. Create personalized study plans based on current skill levels and target roles.'
        },
        {
          role: 'user',
          content: `Create a study plan for:
Target Role: ${targetRole}
Current Level: ${currentLevel}
Current Skills: ${JSON.stringify(skills)}

Recommend:
1. Next 3 topics to focus on
2. Suggested resources
3. Practice problems difficulty level
4. Estimated timeline`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = (response as any).choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error generating study plan:', error);
    throw error;
  }
}

export async function suggestNextStep(application: {
  company: string;
  role: string;
  status: string;
  applied_date: string | null;
}) {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content: 'You are a career coach helping candidates navigate their job applications. Provide specific, actionable next steps.'
        },
        {
          role: 'user',
          content: `Application details:
Company: ${application.company}
Role: ${application.role}
Status: ${application.status}
Applied Date: ${application.applied_date || 'N/A'}

What should the candidate do next? Provide:
1. Recommended action
2. Timeline (when to do it)
3. Template/example if applicable`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = (response as any).choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error suggesting next step:', error);
    throw error;
  }
}

export async function generateInterviewTips(
  company: string,
  role: string,
  interviewType: string
) {
  try {
    const response = await client.chat.completions.create({
      model: 'llama3.1-8b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert interview coach with deep knowledge of company-specific interview processes.'
        },
        {
          role: 'user',
          content: `Generate interview preparation tips for:
Company: ${company}
Role: ${role}
Interview Type: ${interviewType}

Provide:
1. Common topics/questions for this company
2. Company culture insights
3. Key things to emphasize
4. Red flags to avoid
5. Sample questions to ask the interviewer`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const content = (response as any).choices[0].message.content;
    return content ? JSON.parse(content) : null;
  } catch (error) {
    console.error('Error generating interview tips:', error);
    throw error;
  }
}
