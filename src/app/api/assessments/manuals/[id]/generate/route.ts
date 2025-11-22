import { NextRequest, NextResponse } from 'next/server';
import { generateAssessment } from '@/services/assessments/manuals';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json().catch(() => ({}));
    const questionCount = body.questionCount || 40;

    // Validate question count
    if (questionCount < 1 || questionCount > 100) {
      return NextResponse.json(
        { error: 'Question count must be between 1 and 100' },
        { status: 400 }
      );
    }

    const assessment = await generateAssessment(params.id, questionCount);

    return NextResponse.json(assessment, { status: 200 });
  } catch (error) {
    console.error('Error generating assessment', error);

    if (error instanceof Error) {
      // Handle specific error cases
      if (error.message === 'Manual not found') {
        return NextResponse.json(
          { error: 'Manual not found' },
          { status: 404 }
        );
      }

      if (error.message === 'No content available') {
        return NextResponse.json(
          { error: 'No content available' },
          { status: 400 }
        );
      }

      if (error.message.startsWith('Insufficient questions')) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
