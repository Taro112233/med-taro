// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [totalAssessments, totalPatients, diagnosisStats, recentAssessments] = await Promise.all([
      // Total assessments
      prisma.assessment.count(),
      
      // Total unique patients
      prisma.patient.count(),
      
      // Group by diagnosis
      prisma.assessment.groupBy({
        by: ['primaryDiagnosis'],
        _count: {
          primaryDiagnosis: true
        },
        where: {
          primaryDiagnosis: { not: null }
        }
      }),
      
      // Recent 7 days count
      prisma.assessment.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]);

    // Format diagnosis stats
    const diagnosisBreakdown = diagnosisStats.reduce((acc, stat) => {
      if (stat.primaryDiagnosis) {
        acc[stat.primaryDiagnosis] = stat._count.primaryDiagnosis;
      }
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      totalAssessments,
      totalPatients,
      recentAssessments,
      diagnosisBreakdown
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงสถิติ' },
      { status: 500 }
    );
  }
}