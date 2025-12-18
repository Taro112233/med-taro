// app/api/progress-notes/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    const progressNote = await prisma.progressNote.findUnique({
      where: { id },
    });

    if (!progressNote) {
      return NextResponse.json(
        { error: 'Progress note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(progressNote);
  } catch (error) {
    console.error('Error fetching progress note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;

    await prisma.progressNote.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting progress note:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress note' },
      { status: 500 }
    );
  }
}