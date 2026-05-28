import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const body = await req.json();
    const {
      level,
      category,
      text,
      options,
      correctIndex,
      explanation,
      difficultyTier,
      variantGroup,
      organizationId,
      isActive,
    } = body as {
      level: string;
      category: string;
      text: string;
      options: string[];
      correctIndex: number;
      explanation?: string;
      difficultyTier?: number;
      variantGroup?: string;
      organizationId?: string;
      isActive?: boolean;
    };

    // Validate required fields
    if (!level || !category || !text || !options || correctIndex === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: level, category, text, options, correctIndex' },
        { status: 400 }
      );
    }

    // Validate level
    const validLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (!validLevels.includes(level)) {
      return NextResponse.json(
        { error: `Invalid level. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['grammar', 'vocabulary', 'reading', 'listening'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate options
    if (!Array.isArray(options) || options.length !== 4) {
      return NextResponse.json(
        { error: 'Options must be an array of exactly 4 items' },
        { status: 400 }
      );
    }

    // Validate correctIndex
    if (correctIndex < 0 || correctIndex > 3) {
      return NextResponse.json(
        { error: 'correctIndex must be between 0 and 3' },
        { status: 400 }
      );
    }

    const question = await db.question.create({
      data: {
        level,
        category,
        text,
        options: JSON.stringify(options),
        correctIndex,
        explanation: explanation || null,
        difficultyTier: difficultyTier || 5,
        variantGroup: variantGroup || null,
        organizationId: organizationId || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      success: true,
      question: {
        id: question.id,
        level: question.level,
        category: question.category,
        text: question.text,
        options: JSON.parse(question.options),
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        difficultyTier: question.difficultyTier,
        variantGroup: question.variantGroup,
        isActive: question.isActive,
        createdAt: question.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json(
        { error: error.message === 'UNAUTHORIZED' ? 'Unauthorized' : 'Forbidden' },
        { status: error.message === 'UNAUTHORIZED' ? 401 : 403 }
      );
    }
    console.error('[Admin Questions New API Error]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
