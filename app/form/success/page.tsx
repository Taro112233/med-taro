// app/form/success/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function AdultSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center from-blue-50 to-white px-4">
      <Card className="w-full max-w-md shadow-lg space-y-3">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl text-green-600">
              บันทึกข้อมูลสำเร็จ
            </CardTitle>
            <CardDescription className="mt-2">
              ข้อมูลการประเมินผู้ป่วยได้รับการบันทึกเรียบร้อยแล้ว
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => router.push('/form')} 
            className="w-full"
          >
            บันทึกผู้ป่วยรายใหม่
          </Button>
          <Button 
            onClick={() => router.push('/manage')} 
            variant="outline"
            className="w-full"
          >
            ดูข้อมูลทั้งหมด
          </Button>
          <Button 
            onClick={() => router.push('/dashboard')} 
            variant="ghost"
            className="w-full"
          >
            กลับหน้าหลัก
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}