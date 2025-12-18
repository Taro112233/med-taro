// app/api/admissions/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    const body = await request.json();

    // Handle admissionNumber uniqueness check if it's being updated
    if (body.admissionNumber) {
      const existingAdmission = await prisma.admission.findFirst({
        where: {
          admissionNumber: body.admissionNumber,
          id: { not: id },
        },
      });

      if (existingAdmission) {
        return NextResponse.json(
          { error: 'Admission Number already exists' },
          { status: 409 }
        );
      }
    }

    const admission = await prisma.admission.update({
      where: { id },
      data: {
        ...body,
        dischargeDate: body.dischargeDate ? new Date(body.dischargeDate) : undefined,
      },
      include: {
        progressNotes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json(admission);
  } catch (error) {
    console.error('Error updating admission:', error);
    return NextResponse.json(
      { error: 'Failed to update admission' },
      { status: 500 }
    );
  }
}