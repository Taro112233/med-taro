// app/api/admissions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateAdmissionBody {
  admissionNumber: string;
  patientId: string;
  bedNumber: string;
  admissionDate: string;
  chiefComplaint?: string;
  historyPresent?: string;
  pastMedicalHx?: string;
  familyHistory?: string;
  socialHistory?: string;
  allergies?: string;
  medications?: string;
  note?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = (await request.json()) as CreateAdmissionBody;

    if (!body.admissionNumber || !body.patientId || !body.bedNumber) {
      return NextResponse.json(
        { error: 'Admission Number, Patient ID, and Bed Number are required' },
        { status: 400 }
      );
    }

    // Check if AN already exists
    const existingAdmission = await prisma.admission.findUnique({
      where: { admissionNumber: body.admissionNumber },
    });

    if (existingAdmission) {
      return NextResponse.json(
        { error: 'Admission Number already exists' },
        { status: 409 }
      );
    }

    const admission = await prisma.admission.create({
      data: {
        admissionNumber: body.admissionNumber,
        patientId: body.patientId,
        bedNumber: body.bedNumber,
        admissionDate: new Date(body.admissionDate),
        status: 'ADMIT', // เพิ่มบรรทัดนี้
        chiefComplaint: body.chiefComplaint,
        historyPresent: body.historyPresent,
        pastMedicalHx: body.pastMedicalHx,
        familyHistory: body.familyHistory,
        socialHistory: body.socialHistory,
        allergies: body.allergies,
        medications: body.medications,
        note: body.note,
      },
      include: {
        progressNotes: true,
      },
    });

    return NextResponse.json(admission, { status: 201 });
  } catch (error) {
    console.error('Error creating admission:', error);
    return NextResponse.json(
      { error: 'Failed to create admission' },
      { status: 500 }
    );
  }
}