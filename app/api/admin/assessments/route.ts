// app/api/admin/assessments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma, Diagnosis } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const diagnosis = searchParams.get('diagnosis') || 'all';
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    // Build where clause
    const andConditions: Prisma.AssessmentWhereInput[] = [];

    // Search by HN, first name, or last name
    if (search) {
      andConditions.push({
        OR: [
          { patient: { hospitalNumber: { contains: search, mode: 'insensitive' } } },
          { patient: { firstName: { contains: search, mode: 'insensitive' } } },
          { patient: { lastName: { contains: search, mode: 'insensitive' } } }
        ]
      });
    }

    // Filter by diagnosis
    if (diagnosis !== 'all') {
      andConditions.push({
        primaryDiagnosis: diagnosis as Diagnosis
      });
    }

    // Date range filter
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      andConditions.push({
        assessmentDate: { gte: fromDate }
      });
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      andConditions.push({
        assessmentDate: { lte: toDate }
      });
    }

    // Build final where clause
    const where: Prisma.AssessmentWhereInput = andConditions.length > 0 
      ? { AND: andConditions }
      : {};

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: {
          select: {
            hospitalNumber: true,
            firstName: true,
            lastName: true,
            age: true,
          }
        }
      },
      orderBy: { assessmentDate: 'desc' },
    });

    return NextResponse.json(assessments);
  } catch (error) {
    console.error('Get assessments error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}