// app/api/reports/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma, Diagnosis } from '@prisma/client';

interface AsthmaDataType {
  controlLevel?: string;
}

interface COPDDataType {
  stage?: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const diagnosis = searchParams.get('diagnosis') || 'all';

    // Build where clause
    const andConditions: Prisma.AssessmentWhereInput[] = [];

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

    // Filter by diagnosis
    if (diagnosis !== 'all') {
      andConditions.push({
        primaryDiagnosis: diagnosis as Diagnosis
      });
    }

    // Build final where clause
    const where: Prisma.AssessmentWhereInput = andConditions.length > 0 
      ? { AND: andConditions }
      : {};

    // Fetch all assessments with filters
    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        patient: {
          select: {
            hospitalNumber: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: { assessmentDate: 'desc' },
    });

    // Process statistics
    const stats = {
      totalAssessments: assessments.length,
      totalPatients: new Set(assessments.map(a => a.hospitalNumber)).size,
      
      // Asthma Control Distribution
      asthmaControl: {
        wellControlled: 0,
        partlyControlled: 0,
        uncontrolled: 0,
        notApplicable: 0,
      },
      
      // COPD Stage Distribution (A, B, E only)
      copdStage: {
        stageA: 0,
        stageB: 0,
        stageE: 0,
        notApplicable: 0,
      },
      
      // Compliance Distribution
      complianceRanges: {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
      },
      
      // Average compliance by diagnosis
      avgComplianceByDiagnosis: {} as Record<string, number>,
      
      // Side effects prevalence
      sideEffectsPrevalence: 0,
      
      // Technique correctness
      techniqueCorrectness: {
        correct: 0,
        incorrect: 0,
        notAssessed: 0,
      },
    };

    // Count by diagnosis for avg compliance calculation
    const complianceSumByDiagnosis: Record<string, { sum: number; count: number }> = {};

    assessments.forEach(assessment => {
      // Asthma Control Level
      if (assessment.asthmaData && typeof assessment.asthmaData === 'object') {
        const asthmaData = assessment.asthmaData as AsthmaDataType;
        const controlLevel = asthmaData.controlLevel;
        
        if (controlLevel === 'WELL') {
          stats.asthmaControl.wellControlled++;
        } else if (controlLevel === 'PARTLY') {
          stats.asthmaControl.partlyControlled++;
        } else if (controlLevel === 'UNCONTROLLED') {
          stats.asthmaControl.uncontrolled++;
        }
      } else if (assessment.primaryDiagnosis === 'ASTHMA') {
        stats.asthmaControl.notApplicable++;
      }

      // COPD Stage (A, B, E only)
      if (assessment.copdData && typeof assessment.copdData === 'object') {
        const copdData = assessment.copdData as COPDDataType;
        const stage = copdData.stage;
        
        if (stage === 'A') {
          stats.copdStage.stageA++;
        } else if (stage === 'B') {
          stats.copdStage.stageB++;
        } else if (stage === 'E') {
          stats.copdStage.stageE++;
        }
      } else if (assessment.primaryDiagnosis === 'COPD') {
        stats.copdStage.notApplicable++;
      }

      // Compliance Distribution
      const compliance = assessment.compliancePercent || 0;
      if (compliance >= 80) {
        stats.complianceRanges.excellent++;
      } else if (compliance >= 60) {
        stats.complianceRanges.good++;
      } else if (compliance >= 40) {
        stats.complianceRanges.fair++;
      } else {
        stats.complianceRanges.poor++;
      }

      // Average compliance by diagnosis
      if (assessment.primaryDiagnosis) {
        if (!complianceSumByDiagnosis[assessment.primaryDiagnosis]) {
          complianceSumByDiagnosis[assessment.primaryDiagnosis] = { sum: 0, count: 0 };
        }
        complianceSumByDiagnosis[assessment.primaryDiagnosis].sum += compliance;
        complianceSumByDiagnosis[assessment.primaryDiagnosis].count++;
      }

      // Side effects
      if (assessment.hasSideEffects) {
        stats.sideEffectsPrevalence++;
      }

      // Technique correctness
      if (assessment.techniqueCorrect === true) {
        stats.techniqueCorrectness.correct++;
      } else if (assessment.techniqueCorrect === false) {
        stats.techniqueCorrectness.incorrect++;
      } else {
        stats.techniqueCorrectness.notAssessed++;
      }
    });

    // Calculate average compliance by diagnosis
    Object.keys(complianceSumByDiagnosis).forEach(diagnosis => {
      const { sum, count } = complianceSumByDiagnosis[diagnosis];
      stats.avgComplianceByDiagnosis[diagnosis] = Math.round((sum / count) * 10) / 10;
    });

    // Calculate percentages
    const percentages = {
      sideEffectsRate: stats.totalAssessments > 0
        ? Math.round((stats.sideEffectsPrevalence / stats.totalAssessments) * 1000) / 10
        : 0,
      techniqueCorrectRate: stats.techniqueCorrectness.correct + stats.techniqueCorrectness.incorrect > 0
        ? Math.round((stats.techniqueCorrectness.correct / (stats.techniqueCorrectness.correct + stats.techniqueCorrectness.incorrect)) * 1000) / 10
        : 0,
    };

    return NextResponse.json({
      stats,
      percentages,
      dateRange: {
        from: dateFrom,
        to: dateTo,
      },
      diagnosis: diagnosis === 'all' ? 'ทั้งหมด' : diagnosis,
    });
  } catch (error) {
    console.error('Get report stats error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}