// app/api/progress-notes/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { VitalSigns } from '@/lib/types';

const prisma = new PrismaClient();

interface CreateProgressNoteBody {
  admissionId: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  vitalSigns?: VitalSigns;
  note?: string;
  createdBy: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const admissionId = searchParams.get('admissionId');

    const whereClause = admissionId ? { admissionId } : {};

    const progressNotes = await prisma.progressNote.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(progressNotes);
  } catch (error) {
    console.error('Error fetching progress notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateProgressNoteBody;

    if (!body.admissionId || !body.createdBy) {
      return NextResponse.json(
        { error: 'Admission ID and Created By are required' },
        { status: 400 }
      );
    }

    const progressNote = await prisma.progressNote.create({
      data: {
        admissionId: body.admissionId,
        subjective: body.subjective,
        objective: body.objective,
        assessment: body.assessment,
        plan: body.plan,
        vitalSigns: body.vitalSigns as any,
        note: body.note,
        createdBy: body.createdBy,
      },
    });

    return NextResponse.json(progressNote, { status: 201 });
  } catch (error) {
    console.error('Error creating progress note:', error);
    return NextResponse.json(
      { error: 'Failed to create progress note' },
      { status: 500 }
    );
  }
}