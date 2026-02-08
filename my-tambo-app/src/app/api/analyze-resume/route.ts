import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/cerebras';

export async function POST(request: NextRequest) {
  try {
    const { resumeText, targetRole } = await request.json();

    if (!resumeText || !targetRole) {
      return NextResponse.json(
        { error: 'Resume text and target role are required' },
        { status: 400 }
      );
    }

    // Call Cerebras AI
    const analysis = await analyzeResume(resumeText, targetRole);

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume', details: error.message },
      { status: 500 }
    );
  }
}
