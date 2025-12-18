// components/reports/report-summary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ReportSummaryProps {
  totalAssessments: number;
  totalPatients: number;
  sideEffectsRate: number;
  techniqueCorrectRate: number;
}

export function ReportSummary({
  totalAssessments,
  totalPatients,
  sideEffectsRate,
  techniqueCorrectRate,
}: ReportSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Assessments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            การประเมินทั้งหมด
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssessments}</div>
          <p className="text-xs text-muted-foreground">
            รายการในช่วงที่เลือก
          </p>
        </CardContent>
      </Card>

      {/* Total Patients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            ผู้ป่วยทั้งหมด
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPatients}</div>
          <p className="text-xs text-muted-foreground">
            คนไข้ในช่วงที่เลือก
          </p>
        </CardContent>
      </Card>

      {/* Side Effects Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            อัตราผลข้างเคียง
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {sideEffectsRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            ผู้ป่วยที่มีผลข้างเคียง
          </p>
        </CardContent>
      </Card>

      {/* Technique Correct Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            อัตราเทคนิคถูกต้อง
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {techniqueCorrectRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            ผู้ป่วยที่พ่นยาถูกต้อง
          </p>
        </CardContent>
      </Card>
    </div>
  );
}