// components/reports/report-filters.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ReportFiltersProps {
  dateFrom: string;
  dateTo: string;
  diagnosis: string;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onDiagnosisChange: (value: string) => void;
}

const DIAGNOSIS_OPTIONS = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'ASTHMA', label: 'Asthma (หอบหืด)' },
  { value: 'COPD', label: 'COPD (ปอดอุดกั้นเรื้อรัง)' },
  { value: 'ACOD', label: 'ACOD' },
  { value: 'BRONCHIECTASIS', label: 'Bronchiectasis (หลอดลมขยาย)' },
  { value: 'ALLERGIC_RHINITIS', label: 'Allergic Rhinitis (AR)' },
  { value: 'GERD', label: 'GERD' },
];

export function ReportFilters({
  dateFrom,
  dateTo,
  diagnosis,
  onDateFromChange,
  onDateToChange,
  onDiagnosisChange,
}: ReportFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Date From */}
        <div className="space-y-2">
          <Label htmlFor="dateFrom">วันที่เริ่มต้น</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
          />
        </div>

        {/* Date To */}
        <div className="space-y-2">
          <Label htmlFor="dateTo">วันที่สิ้นสุด</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
          />
        </div>

        {/* Diagnosis */}
        <div className="space-y-2">
          <Label htmlFor="diagnosis">โรคหลัก</Label>
          <Select value={diagnosis} onValueChange={onDiagnosisChange}>
            <SelectTrigger id="diagnosis">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIAGNOSIS_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}