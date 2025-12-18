// app/api/assessments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const assessment = await prisma.assessment.findUnique({
      where: { id },
      include: {
        patient: true
      }
    });

    if (!assessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Get assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const cookies = request.headers.get('cookie');
    const authCookie = cookies?.split(';').find(c => c.trim().startsWith('auth='));
    
    let username = 'Unknown';
    if (authCookie) {
      try {
        const authValue = decodeURIComponent(authCookie.split('=')[1]);
        const authData = JSON.parse(authValue);
        username = authData.username || 'Unknown';
      } catch (error) {
        console.error('Failed to parse auth cookie:', error);
      }
    }

    const data = await request.json();

    const existingAssessment = await prisma.assessment.findUnique({
      where: { id },
      select: { hospitalNumber: true }
    });

    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'ไม่พบข้อมูลการประเมิน' },
        { status: 404 }
      );
    }

    await prisma.patient.update({
      where: { hospitalNumber: existingAssessment.hospitalNumber },
      data: {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        age: data.age || undefined,
        updatedAt: new Date(),
      }
    });

    // ✅ Process techniqueSteps - รักษาข้อมูลเดิมถ้าไม่มีการเปลี่ยนแปลง
    const STEPS = ['prepare', 'inhale', 'rinse', 'empty'];
    let processedTechniqueSteps: Record<string, Record<string, { status: string; note: string }>> | undefined = {};
    let processedInhalerDevices: string[] | undefined = [];

    // ✅ ถ้ามีการส่ง techniqueSteps มา ให้ process
    if (data.techniqueSteps) {
      const deviceSet = new Set<string>();

      STEPS.forEach(step => {
        const stepData = data.techniqueSteps?.[step] as Record<string, { status: string; note: string }> | undefined;
        if (stepData) {
          const filteredEntries = Object.entries(stepData)
            .filter(([, details]) => 
              details && 
              details.status !== 'none' && 
              (details.status === 'correct' || details.status === 'incorrect')
            )
            .map(([device, details]) => {
              deviceSet.add(device);
              return [device, {
                status: details.status,
                note: details.note || ''
              }];
            });
          
          if (processedTechniqueSteps) {
            processedTechniqueSteps[step] = Object.fromEntries(filteredEntries);
          }
        } else {
          if (processedTechniqueSteps) {
            processedTechniqueSteps[step] = {};
          }
        }
      });

      processedInhalerDevices = [...deviceSet];
    } else {
      // ✅ ถ้าไม่ส่ง techniqueSteps มา ให้ใช้ค่าเดิม (undefined) เพื่อไม่ overwrite
      processedTechniqueSteps = undefined;
      processedInhalerDevices = undefined;
    }

    // ✅ Update assessment
    const updateData: Prisma.AssessmentUpdateInput = {
      assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : undefined,
      assessedBy: username,
      alcohol: data.alcohol,
      alcoholAmount: data.alcoholAmount,
      smoking: data.smoking,
      smokingAmount: data.smokingAmount,
      primaryDiagnosis: data.primaryDiagnosis || undefined,
      secondaryDiagnoses: data.secondaryDiagnoses,
      note: data.note,
      asthmaData: data.asthmaData,
      copdData: data.copdData,
      arData: data.arData,
      complianceStatus: data.complianceStatus || undefined,
      compliancePercent: data.compliancePercent,
      cannotAssessReason: data.cannotAssessReason,
      nonComplianceReasons: data.nonComplianceReasons,
      lessThanDetail: data.lessThanDetail,
      moreThanDetail: data.moreThanDetail,
      nonComplianceOther: data.nonComplianceOther,
      hasSideEffects: data.hasSideEffects,
      sideEffects: data.sideEffects,
      sideEffectsOther: data.sideEffectsOther,
      sideEffectsManagement: data.sideEffectsManagement,
      drps: data.drps,
      medicationStatus: data.medicationStatus || undefined,
      unopenedMedication: data.unopenedMedication,
      medications: data.medications,
      updatedAt: new Date(),
    };

    // ✅ เพิ่ม technique fields เฉพาะเมื่อมีการส่งมา
    if (data.techniqueCorrect !== undefined) {
      updateData.techniqueCorrect = data.techniqueCorrect === true ? true : data.techniqueCorrect === false ? false : null;
    }

    if (processedInhalerDevices !== undefined) {
      updateData.inhalerDevices = processedInhalerDevices;
    }

    if (processedTechniqueSteps !== undefined) {
      updateData.techniqueSteps = processedTechniqueSteps;
    }

    if (data.spacerType !== undefined) {
      updateData.spacerType = data.spacerType || null;
    }

    const assessment = await prisma.assessment.update({
      where: { id },
      data: updateData,
      include: {
        patient: true
      }
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Update assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await prisma.assessment.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}