// app/manage/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TechniqueStep {
  status: string;
  note?: string;
}

interface TechniqueSteps {
  [device: string]: TechniqueStep;
}

interface AssessmentData {
  id: string;
  assessmentDate: string;
  assessedBy: string | null;
  primaryDiagnosis: string | null;
  note: string | null;
  hasSideEffects: boolean;
  sideEffects: string[];
  sideEffectsOther: string | null;
  sideEffectsManagement: string | null;
  drps: string | null;
  medicationStatus: string | null;
  medications: Array<{ name: string; quantity: number }> | null;
  techniqueCorrect: boolean | null;
  techniqueSteps: Record<string, TechniqueSteps> | null;
  compliancePercent: number | null;
  nonComplianceReasons: string[];
  lessThanDetail: string | null;
  moreThanDetail: string | null;
  asthmaData?: {
    controlLevel?: string;
  };
  copdData?: {
    stage?: string;
  };
  arData?: {
    symptoms?: string;
    severity?: string;
    pattern?: string;
  };
  patient: {
    hospitalNumber: string;
    firstName: string | null;
    lastName: string | null;
    age: number | null;
  };
}

const DIAGNOSIS_LABELS: Record<string, string> = {
  'ASTHMA': 'ASTHMA',
  'COPD': 'COPD',
  'ACOD': 'ACOD',
  'BRONCHIECTASIS': 'BRONCHIECTASIS',
  'ALLERGIC_RHINITIS': 'AR',
  'GERD': 'GERD',
};

export default function AssessmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedHN, setCopiedHN] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const fetchAssessment = useCallback(async () => {
    try {
      const res = await fetch(`/api/assessments/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setAssessment(data);
      } else {
        toast.error('ไม่พบข้อมูลการประเมิน');
        router.push('/manage');
      }
    } catch (error) {
      console.error('Error fetching assessment:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    fetchAssessment();
  }, [fetchAssessment]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/assessments/${params.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('ลบข้อมูลสำเร็จ');
        router.push('/manage');
      } else {
        toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
      }
    } catch (error) {
      console.error('Error deleting assessment:', error);
      toast.error('เกิดข้อผิดพลาดในการลบข้อมูล');
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleCopyHN = async () => {
    if (!assessment) return;
    
    try {
      await navigator.clipboard.writeText(assessment.patient.hospitalNumber);
      setCopiedHN(true);
      toast.success('คัดลอก HN สำเร็จ');
      setTimeout(() => setCopiedHN(false), 2000);
    } catch (error) {
      console.error('Error copying HN:', error);
      toast.error('ไม่สามารถคัดลอก HN ได้');
    }
  };

  const generateTechniqueText = () => {
    if (!assessment) return '-';
    
    if (assessment.techniqueCorrect) {
      const steps = assessment.techniqueSteps || {};
      const allDevices = new Set<string>();
      
      Object.values(steps).forEach((devices) => {
        if (devices && typeof devices === 'object') {
          Object.keys(devices).forEach(device => allDevices.add(device));
        }
      });

      if (allDevices.size === 0) {
        return 'ถูกต้องทุกขั้นตอน';
      }

      const deviceResults: string[] = [];
      allDevices.forEach(device => {
        deviceResults.push(`${device}: ถูกต้องทุกขั้นตอน`);
      });

      return deviceResults.join(', ');
    }

    const steps = assessment.techniqueSteps || {};
    const allDevices = new Set<string>();
    
    Object.values(steps).forEach((devices) => {
      if (devices && typeof devices === 'object') {
        Object.keys(devices).forEach(device => allDevices.add(device));
      }
    });

    if (allDevices.size === 0) {
      return '-';
    }

    const deviceResults: string[] = [];

    allDevices.forEach(device => {
      let hasAnyStatus = false;
      let allCorrect = true;
      const incorrectDetails: string[] = [];

      Object.entries(steps).forEach(([, devices]) => {
        if (devices && devices[device]) {
          hasAnyStatus = true;
          const status = devices[device].status;
          const note = devices[device].note;

          if (status === 'incorrect') {
            allCorrect = false;
            if (note && note.trim()) {
              incorrectDetails.push(note.trim());
            }
          }
        }
      });

      if (!hasAnyStatus) {
        deviceResults.push(`${device}: -`);
      } else if (allCorrect) {
        deviceResults.push(`${device}: ถูกต้องทุกขั้นตอน`);
      } else {
        const details = incorrectDetails.length > 0 
          ? incorrectDetails.join(', ')
          : 'มีข้อผิดพลาด';
        deviceResults.push(`${device}: ${details}`);
      }
    });

    return deviceResults.join(', ');
  };

  const generateComplianceReasonText = () => {
    if (!assessment) return '';
    
    const reasons: string[] = [];
    
    if (assessment.nonComplianceReasons.includes('LESS_THAN') && assessment.lessThanDetail) {
      reasons.push(`น้อยกว่า ${assessment.lessThanDetail}`);
    }
    
    if (assessment.nonComplianceReasons.includes('MORE_THAN') && assessment.moreThanDetail) {
      reasons.push(`มากกว่า ${assessment.moreThanDetail}`);
    }
    
    return reasons.length > 0 ? `\nเหตุผล: ${reasons.join('; ')}` : '';
  };

  const handleCopyReport = async () => {
    if (!assessment) return;
    
    try {
      const reportText = `Asthma/COPD ambulatory: ${assessment.assessedBy || '-'}
Dx: ${assessment.primaryDiagnosis ? DIAGNOSIS_LABELS[assessment.primaryDiagnosis] || assessment.primaryDiagnosis : '-'}
Level of controlled: ${
  assessment.asthmaData?.controlLevel 
    ? assessment.asthmaData.controlLevel === 'WELL' 
      ? 'Well controlled (0 ข้อ)'
      : assessment.asthmaData.controlLevel === 'PARTLY'
      ? 'Partly controlled (1-2 ข้อ)'
      : 'Uncontrolled (3-4 ข้อ)'
    : assessment.copdData?.stage 
    ? `Stage ${assessment.copdData.stage}`
    : '-'
}
Note/Risk factor: ${assessment.note || '-'}
AR: ${assessment.arData?.symptoms || '-'}${
  assessment.arData?.severity || assessment.arData?.pattern
    ? ` (${[assessment.arData.severity, assessment.arData.pattern].filter(Boolean).join(', ')})`
    : ''
}
เทคนิคพ่นยา: ${generateTechniqueText()}
Patient Compliance: ${assessment.compliancePercent !== null ? `${assessment.compliancePercent}%` : '-'}${generateComplianceReasonText()}
ADR: ${
  assessment.hasSideEffects
    ? [
        ...(assessment.sideEffects || []).map((se: string) => {
          const labels: Record<string, string> = {
            'ORAL_CANDIDIASIS': 'เชื้อราในปาก',
            'HOARSE_VOICE': 'เสียงแหบ',
            'PALPITATION': 'ใจสั่น'
          };
          return labels[se] || se;
        }),
        assessment.sideEffectsOther || ''
      ].filter(Boolean).join(', ')
    : 'ไม่มี'
}${assessment.sideEffectsManagement ? ` (การจัดการ: ${assessment.sideEffectsManagement})` : ''}
Other: ${assessment.drps || '-'}
ยาเหลือ: ${
  assessment.medicationStatus === 'HAS_REMAINING'
    ? assessment.medications && Array.isArray(assessment.medications) && assessment.medications.length > 0
      ? assessment.medications
          .map(med => `${med.name} (${med.quantity})`)
          .join(', ')
      : 'มี'
    : 'ไม่เหลือ'
}`;

      await navigator.clipboard.writeText(reportText);
      setCopiedReport(true);
      toast.success('คัดลอกข้อมูลการประเมินสำเร็จ');
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (error) {
      console.error('Error copying report:', error);
      toast.error('ไม่สามารถคัดลอกข้อมูลได้');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/manage')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับ
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                รายละเอียดการประเมิน
              </h1>
              <p className="text-gray-500">HN: {assessment.patient.hospitalNumber}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/form`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              แบบฟอร์ม
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              ลบ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>ข้อมูลผู้ป่วย</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">HN</label>
                <div className="flex items-center gap-2">
                  <p className="text-base font-medium">{assessment.patient.hospitalNumber}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyHN}
                    className="h-6 w-6 p-0"
                  >
                    {copiedHN ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ชื่อ-สกุล</label>
                <p className="text-base font-medium">
                  {assessment.patient.firstName} {assessment.patient.lastName}
                </p>
              </div>
              {assessment.patient.age && (
                <div>
                  <label className="text-sm font-medium text-gray-500">อายุ</label>
                  <p className="text-base">{assessment.patient.age} ปี</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">วันที่ประเมิน</label>
                <p className="text-base">
                  {new Date(assessment.assessmentDate).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ข้อมูลการประเมิน</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyReport}
                  className="gap-2"
                >
                  {copiedReport ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>คัดลอกข้อมูล</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <pre className="text-sm whitespace-pre-wrap font-mono text-gray-800">
{`Asthma/COPD ambulatory: ${assessment.assessedBy || '-'}
Dx: ${assessment.primaryDiagnosis ? DIAGNOSIS_LABELS[assessment.primaryDiagnosis] || assessment.primaryDiagnosis : '-'}
Level of controlled: ${
  assessment.asthmaData?.controlLevel 
    ? assessment.asthmaData.controlLevel === 'WELL' 
      ? 'Well controlled (0 ข้อ)'
      : assessment.asthmaData.controlLevel === 'PARTLY'
      ? 'Partly controlled (1-2 ข้อ)'
      : 'Uncontrolled (3-4 ข้อ)'
    : assessment.copdData?.stage 
    ? `Stage ${assessment.copdData.stage}`
    : '-'
}
Note/Risk factor: ${assessment.note || '-'}
AR: ${assessment.arData?.symptoms || '-'}${
  assessment.arData?.severity || assessment.arData?.pattern
    ? ` (${[assessment.arData.severity, assessment.arData.pattern].filter(Boolean).join(', ')})`
    : ''
}
เทคนิคพ่นยา: ${generateTechniqueText()}
Patient Compliance: ${assessment.compliancePercent !== null ? `${assessment.compliancePercent}%` : '-'}${generateComplianceReasonText()}
ADR: ${
  assessment.hasSideEffects
    ? [
        ...(assessment.sideEffects || []).map((se: string) => {
          const labels: Record<string, string> = {
            'ORAL_CANDIDIASIS': 'เชื้อราในปาก',
            'HOARSE_VOICE': 'เสียงแหบ',
            'PALPITATION': 'ใจสั่น'
          };
          return labels[se] || se;
        }),
        assessment.sideEffectsOther || ''
      ].filter(Boolean).join(', ')
    : 'ไม่มี'
}${assessment.sideEffectsManagement ? ` (การจัดการ: ${assessment.sideEffectsManagement})` : ''}
Other: ${assessment.drps || '-'}
ยาเหลือ: ${
  assessment.medicationStatus === 'HAS_REMAINING'
    ? assessment.medications && Array.isArray(assessment.medications) && assessment.medications.length > 0
      ? assessment.medications
          .map(med => `${med.name} (${med.quantity})`)
          .join(', ')
      : 'มี'
    : 'ไม่เหลือ'
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณแน่ใจหรือไม่ที่จะลบข้อมูลการประเมินนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "กำลังลบ..." : "ลบข้อมูล"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}