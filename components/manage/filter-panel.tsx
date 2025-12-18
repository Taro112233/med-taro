// components/manage/filter-panel.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";

interface FilterPanelProps {
  search: string;
  diagnosis: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (value: string) => void;
  onDiagnosisChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
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

export function FilterPanel({
  search,
  diagnosis,
  dateFrom,
  dateTo,
  onSearchChange,
  onDiagnosisChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
  hasActiveFilters,
}: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="space-y-1">
          <Label htmlFor="search" className="text-xs">ค้นหา HN / ชื่อ</Label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 h-9"
              placeholder="กรอก HN หรือชื่อ"
            />
          </div>
        </div>

        {/* Diagnosis */}
        <div className="space-y-1">
          <Label htmlFor="diagnosis" className="text-xs">โรคหลัก</Label>
          <Select value={diagnosis} onValueChange={onDiagnosisChange}>
            <SelectTrigger id="diagnosis" className="h-9">
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

        {/* Date From */}
        <div className="space-y-1">
          <Label htmlFor="dateFrom" className="text-xs">วันที่เริ่มต้น</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Date To */}
        <div className="space-y-1">
          <Label htmlFor="dateTo" className="text-xs">วันที่สิ้นสุด</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Clear Filters Button - ย้ายมาอยู่แถวเดียวกัน */}
        <div className="space-y-1">
          <Label className="text-xs invisible">Action</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9 w-full"
          >
            <X className="h-4 w-4 mr-1" />
            ล้างตัวกรอง
          </Button>
        </div>
      </div>
    </div>
  );
}