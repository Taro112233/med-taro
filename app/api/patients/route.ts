// app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, AdmissionStatus, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ADMIT';

    console.log('[API] Fetching patients with params:', { search, status });

    // Patient where clause with expanded search
    const patientWhereClause: Prisma.PatientWhereInput = {};

    // Search by HN, Name, AN, Bed, CC, HPI, or Note
    if (search) {
      patientWhereClause.OR = [
        { hospitalNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        {
          admissions: {
            some: {
              OR: [
                { admissionNumber: { contains: search, mode: 'insensitive' } },
                { bedNumber: { contains: search, mode: 'insensitive' } },
                { chiefComplaint: { contains: search, mode: 'insensitive' } },
                { historyPresent: { contains: search, mode: 'insensitive' } },
                { note: { contains: search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    // Admission where clause
    const admissionWhereClause: Prisma.AdmissionWhereInput = {
      dischargeDate: null, // Only current admission (not discharged yet)
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

    console.log(`[API] Found ${patients.length} patients`);
    
    // Debug: Log each patient's admissions
    patients.forEach(p => {
      console.log(`[API] Patient ${p.hospitalNumber} (${p.firstName} ${p.lastName}): ${p.admissions.length} matching admissions`);
      if (p.admissions.length > 0) {
        p.admissions.forEach(a => {
          console.log(`  - Admission ${a.admissionNumber}: status=${a.status}, dischargeDate=${a.dischargeDate}`);
        });
      }
    });

    // Only filter if status is not ALL - for ALL, show everyone
    let filteredPatients = patients;
    
    if (status !== 'ALL') {
      filteredPatients = patients.filter(p => p.admissions && p.admissions.length > 0);
    }

    console.log(`[API] Returning ${filteredPatients.length} patients`);

    return NextResponse.json(filteredPatients);
  } catch (error) {
    console.error('[API] Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { hospitalNumber, firstName, lastName } = body;

    console.log('[API] Creating patient:', { hospitalNumber, firstName, lastName });

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

    console.log('[API] Patient created successfully:', patient.id);

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    console.error('[API] Error creating patient:', error);
    return NextResponse.json(
      { error: 'Failed to create patient', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}