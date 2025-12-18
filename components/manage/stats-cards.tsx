// components/manage/stats-cards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Clock, Activity } from "lucide-react";

interface StatsCardsProps {
  totalAssessments: number;
  totalPatients: number;
  recentAssessments: number;
  diagnosisBreakdown: Record<string, number>;
  isFiltered?: boolean; // ✅ เพิ่ม flag บอกว่ากำลังกรองอยู่หรือไม่
}

const DIAGNOSIS_LABELS: Record<string, string> = {
  'ASTHMA': 'Asthma',
  'COPD': 'COPD',
  'ACOD': 'ACOD',
  'BRONCHIECTASIS': 'Bronchiectasis',
  'ALLERGIC_RHINITIS': 'AR',
  'GERD': 'GERD',
};

export function StatsCards({
  totalAssessments,
  totalPatients,
  recentAssessments,
  diagnosisBreakdown,
  isFiltered = false, // ✅ default = false
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isFiltered ? 'การประเมิน (กรอง)' : 'การประเมินทั้งหมด'}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssessments}</div>
          <p className="text-xs text-muted-foreground">
            {isFiltered ? 'จากตัวกรองที่เลือก' : 'รายการทั้งหมด'}
          </p>
        </CardContent>
      </Card>

      {/* Total Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isFiltered ? 'ผู้ป่วย (กรอง)' : 'ผู้ป่วยทั้งหมด'}
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            {isFiltered ? 'จากตัวกรองที่เลือก' : 'คนไข้ในระบบ'}
          </p>
        </CardContent>
      </Card>

      {/* Recent Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isFiltered ? 'ประเมินล่าสุด (กรอง)' : 'ประเมินล่าสุด'}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentAssessments}</div>
          <p className="text-xs text-muted-foreground">
            {isFiltered ? 'จากตัวกรองที่เลือก' : '7 วันที่ผ่านมา'}
          </p>
        </CardContent>
      </Card>

      {/* Diagnosis Breakdown */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isFiltered ? 'โรคหลัก (กรอง)' : 'โรคหลัก'}
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(diagnosisBreakdown).length > 0 ? (
              Object.entries(diagnosisBreakdown)
                .sort(([, a], [, b]) => b - a) // เรียงจากมากไปน้อย
                .slice(0, 3) // แสดงแค่ 3 อันดับแรก
                .map(([diagnosis, count]) => (
                  <div key={diagnosis} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {DIAGNOSIS_LABELS[diagnosis] || diagnosis}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">ไม่มีข้อมูล</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}