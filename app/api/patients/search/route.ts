// app/api/patients/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hn = searchParams.get('hn');

    if (!hn) {
      return NextResponse.json(
        { error: 'กรุณาระบุ HN' },
        { status: 400 }
      );
    }

    const patient = await prisma.patient.findUnique({
      where: { hospitalNumber: hn.trim() },
      include: {
        assessments: {
          orderBy: { assessmentDate: 'desc' },
          select: {
            id: true,
            assessmentDate: true,
            primaryDiagnosis: true,
            compliancePercent: true,
            assessedBy: true,
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลผู้ป่วย' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error('Search patient error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหา' },
      { status: 500 }
    );
  }
}