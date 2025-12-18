// app/api/admin/assessments/bulk-delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'กรุณาระบุ ID ที่ต้องการลบ' },
        { status: 400 }
      );
    }

    // Delete assessments
    await prisma.assessment.deleteMany({
      where: {
        id: { in: ids }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `ลบข้อมูล ${ids.length} รายการสำเร็จ` 
    });
  } catch (error) {
    console.error('Bulk delete error:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบข้อมูล' },
      { status: 500 }
    );
  }
}