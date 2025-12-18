// components/patient-detail/patient-header.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Patient, Admission } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface PatientHeaderProps {
  patient: Patient;
  currentAdmission?: Admission;
  onDischarge: () => void;
}

export function PatientHeader({ patient, currentAdmission, onDischarge }: PatientHeaderProps) {
  const router = useRouter();
  const [showDischargeDialog, setShowDischargeDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDischarge = async () => {
    if (!currentAdmission) return;

    setLoading(true);
    try {
      // Update current admission status and discharge date
      await fetch(`/api/admissions/${currentAdmission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'DISCHARGED',
          dischargeDate: new Date().toISOString() 
        }),
      });

      toast.success('Discharge ผู้ป่วยเรียบร้อยแล้ว');
      setShowDischargeDialog(false);
      onDischarge();
    } catch (error) {
      console.error('Error discharging patient:', error);
      toast.error('ไม่สามารถ Discharge ผู้ป่วยได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 break-words">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                HN: {patient.hospitalNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:shrink-0">
            {currentAdmission && (
              <>
                <Badge
                  variant={currentAdmission.status === 'ADMIT' ? 'default' : 'secondary'}
                  className="text-xs sm:text-sm"
                >
                  {currentAdmission.status === 'ADMIT' ? 'Admit' : 'D/C'}
                </Badge>
                {currentAdmission.status === 'ADMIT' && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDischargeDialog(true)}
                    className="text-xs sm:text-sm"
                  >
                    Discharge
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Card>

      <AlertDialog
        open={showDischargeDialog}
        onOpenChange={setShowDischargeDialog}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              ยืนยันการ Discharge
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              คุณต้องการ Discharge ผู้ป่วยคนนี้ใช่หรือไม่?
              การกระทำนี้จะเปลี่ยนสถานะและปิด Admission ปัจจุบัน
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDischarge} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'กำลังดำเนินการ...' : 'ยืนยัน'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}