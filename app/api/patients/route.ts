// app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, AdmissionStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ADMIT';

    // Patient where clause
    const patientWhereClause: Prisma.PatientWhereInput = {};

    // Search by HN or Name
    if (search) {
      patientWhereClause.OR = [
        { hospitalNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Admission where clause
    const admissionWhereClause: Prisma.AdmissionWhereInput = {
      dischargeDate: null, // Only current admission
    };

    // Add status filter if not ALL
    if (status !== 'ALL') {
      admissionWhereClause.status = status as AdmissionStatus;
    }

    const patients = await prisma.patient.findMany({
      where: patientWhereClause,
      include: {
        admissions: {
          where: admissionWhereClause,
          orderBy: {
            admissionDate: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Filter out patients without matching admissions
    const filteredPatients = patients.filter(p => p.admissions && p.admissions.length > 0);

    return NextResponse.json(filteredPatients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { hospitalNumber, firstName, lastName } = body;

    if (!hospitalNumber || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Hospital Number, First Name, and Last Name are required' },
        { status: 400 }
      );
    }

    // Check if HN already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { hospitalNumber },
    });

    if (existingPatient) {
      return NextResponse.json(
        { error: 'Hospital Number already exists' },
        { status: 409 }
      );
    }

    const patient = await prisma.patient.create({
      data: {
        hospitalNumber,
        firstName,
        lastName,
      },
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}