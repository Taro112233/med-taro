// app/api/assessments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET - (ไม่เปลี่ยนแปลง)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    const assessments = await prisma.assessment.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { patient: { hospitalNumber: { contains: search, mode: 'insensitive' } } },
              { patient: { firstName: { contains: search, mode: 'insensitive' } } },
              { patient: { lastName: { contains: search, mode: 'insensitive' } } }
            ]
          } : {},
        ]
      },
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
      take: 100,
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

// POST - Create new assessment (มีการเปลี่ยนแปลง)
export async function POST(request: NextRequest) {
  try {
    // ✅ ดึง username (เหมือนเดิม)
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

    // Validate required field (เหมือนเดิม)
    if (!data.hospitalNumber) {
      return NextResponse.json(
        { error: 'กรุณาระบุ HN' },
        { status: 400 }
      );
    }

    // Create or update patient (upsert) (เหมือนเดิม)
    await prisma.patient.upsert({
      where: { hospitalNumber: data.hospitalNumber },
      update: {
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        age: data.age || null,
        updatedAt: new Date(),
      },
      create: {
        hospitalNumber: data.hospitalNumber,
        firstName: data.firstName || null,
        lastName: data.lastName || null,
        age: data.age || null,
        createdBy: username,
      }
    });

    // ✅ Process techniqueSteps - กรอง status 'none' ออก
    const STEPS = ['prepare', 'inhale', 'rinse', 'empty'];
    const processedTechniqueSteps: Record<string, Record<string, { status: string; note: string }>> = {};
    const deviceSet = new Set<string>(); // ✅ Set สำหรับเก็บ device ที่ใช้งานจริง

    STEPS.forEach(step => {
      const stepData = data.techniqueSteps?.[step] as Record<string, { status: string; note: string }> | undefined;
      if (stepData) {
        // กรองเฉพาะ entry ที่ status ไม่ใช่ 'none'
        const filteredEntries = Object.entries(stepData)
          .filter(([, details]) => 
            details && details.status !== 'none' && (details.status === 'correct' || details.status === 'incorrect')
          )
          .map(([device, details]) => {
            deviceSet.add(device); // ✅ เพิ่ม device ที่ผ่านการกรองเข้า Set
            return [device, { // คืนค่าโครงสร้างเดิม
              status: details.status,
              note: details.note || ''
            }];
          });
        
        processedTechniqueSteps[step] = Object.fromEntries(filteredEntries);
      } else {
        // ถ้าไม่มี step data ให้ khởi tạo เป็น object ว่าง
        processedTechniqueSteps[step] = {};
      }
    });

    // ✅ สร้าง inhalerDevices list ขึ้นมาใหม่จาก Set
    const processedInhalerDevices = [...deviceSet];


    // Create assessment
    const assessment = await prisma.assessment.create({
      data: {
        hospitalNumber: data.hospitalNumber,
        assessmentDate: data.assessmentDate ? new Date(data.assessmentDate) : new Date(),
        assessedBy: username,
        
        // ... (ส่วนอื่นๆ เหมือนเดิม) ...
        alcohol: data.alcohol || null,
        alcoholAmount: data.alcoholAmount || null,
        smoking: data.smoking || null,
        smokingAmount: data.smokingAmount || null,
        primaryDiagnosis: data.primaryDiagnosis || null,
        secondaryDiagnoses: data.secondaryDiagnoses || [],
        note: data.note || null,
        asthmaData: data.asthmaData || null,
        copdData: data.copdData || null,
        arData: data.arData || null,
        complianceStatus: data.complianceStatus || null,
        compliancePercent: data.compliancePercent || 0,
        cannotAssessReason: data.cannotAssessReason || null,
        nonComplianceReasons: data.nonComplianceReasons || [],
        lessThanDetail: data.lessThanDetail || null,
        moreThanDetail: data.moreThanDetail || null,
        nonComplianceOther: data.nonComplianceOther || null,
        hasSideEffects: data.hasSideEffects || false,
        sideEffects: data.sideEffects || [],
        sideEffectsOther: data.sideEffectsOther || null,
        sideEffectsManagement: data.sideEffectsManagement || null,
        drps: data.drps || null,
        medicationStatus: data.medicationStatus || null,
        unopenedMedication: data.unopenedMedication || false,
        
        // ✅ Inhaler technique - ใช้ข้อมูลที่ผ่านการ process แล้ว
        techniqueCorrect: data.techniqueCorrect === true ? true : data.techniqueCorrect === false ? false : null,
        inhalerDevices: processedInhalerDevices, // ✅ ใช้ list ที่สร้างใหม่
        techniqueSteps: processedTechniqueSteps, // ✅ ใช้ steps ที่กรองแล้ว
        spacerType: data.spacerType || null,
        
        medications: data.medications || null,
      },
      include: {
        patient: true
      }
    });

    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    );
  }
}