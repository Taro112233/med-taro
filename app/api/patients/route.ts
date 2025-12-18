// app/api/patients/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ADMIT';

    const whereClause: any = {};

    // Status filter
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    // Search by HN or Name
    if (search) {
      whereClause.OR = [
        { hospitalNumber: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const patients = await prisma.patient.findMany({
      where: whereClause,
      include: {
        admissions: {
          where: {
            dischargeDate: null, // Only current admission
          },
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

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hospitalNumber, firstName, lastName } = body;

    // Validation
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
        status: 'ADMIT',
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