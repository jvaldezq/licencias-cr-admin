import { NextRequest, NextResponse } from 'next/server';
import { gradeAssessment } from '@/services/assessments/manuals';

interface GradeAssessmentRequestBody {
  assessmentId: string;
  manualId: string;
  answers: {
    questionId: string;
    answerId: string;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GradeAssessmentRequestBody;

    // Validate required fields
    if (!body.assessmentId || !body.manualId || !body.answers) {
      return NextResponse.json(
        { error: 'Missing required fields: assessmentId, manualId, and answers are required' },
        { status: 400 }
      );
    }

    // Validate assessmentId format (should be UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(body.assessmentId)) {
      return NextResponse.json(
        { error: 'Invalid assessment ID' },
        { status: 400 }
      );
    }

    // Validate answers array
    if (!Array.isArray(body.answers) || body.answers.length === 0) {
      return NextResponse.json(
        { error: 'Answers must be a non-empty array' },
        { status: 400 }
      );
    }

    // Grade the assessment
    const result = await gradeAssessment(
      body.assessmentId,
      body.manualId,
      body.answers
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error grading assessment', error);

    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message === 'Manual not found') {
        return NextResponse.json(
          { error: 'Manual not found' },
          { status: 404 }
        );
      }

      if (error.message === 'No answers provided') {
        return NextResponse.json(
          { error: 'No answers provided' },
          { status: 400 }
        );
      }

      if (error.message === 'Invalid question for this manual') {
        return NextResponse.json(
          { error: 'Invalid question for this manual' },
          { status: 400 }
        );
      }

      if (error.message.startsWith('Question not found:')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      if (error.message.startsWith('Invalid answer for question:')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }

      if (error.message.startsWith('No correct answer found')) {
        return NextResponse.json(
          { error: 'Data integrity error: Missing correct answer' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
