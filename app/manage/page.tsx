// app/manage/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AssessmentTable } from "@/components/manage/assessment-table";
import { FilterPanel } from "@/components/manage/filter-panel";
import { StatsCards } from "@/components/manage/stats-cards";
import { toast } from "sonner";

interface Assessment {
  id: string;
  assessmentDate: string;
  primaryDiagnosis: string | null;
  compliancePercent: number | null;
  assessedBy: string | null;
  createdAt: string;
  note: string | null;
  hasSideEffects: boolean;
  sideEffects: string[];
  sideEffectsOther: string | null;
  sideEffectsManagement: string | null;
  drps: string | null;
  medicationStatus: string | null;
  medications: Array<{ name: string; quantity: number }> | null;
  techniqueCorrect: boolean | null;
  techniqueSteps: Record<string, Record<string, { status: string; note: string }>> | null;
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

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ManagePage() {
  const router = useRouter();
  const { username, handleLogout } = useAuth();
  
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [diagnosis, setDiagnosis] = useState("all");
  const [dateFrom, setDateFrom] = useState(getTodayDateString());
  const [dateTo, setDateTo] = useState(getTodayDateString());

  const hasActiveFilters = Boolean(
    search ||
    diagnosis !== "all" ||
    dateFrom ||
    dateTo
  );

  const filteredStats = useMemo(() => {
    const totalAssessments = assessments.length;

    const uniquePatients = new Set(assessments.map(a => a.patient.hospitalNumber));
    const totalPatients = uniquePatients.size;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentAssessments = assessments.filter(
      a => new Date(a.assessmentDate) >= sevenDaysAgo
    ).length;

    const diagnosisBreakdown: Record<string, number> = {};
    assessments.forEach(a => {
      if (a.primaryDiagnosis) {
        diagnosisBreakdown[a.primaryDiagnosis] = 
          (diagnosisBreakdown[a.primaryDiagnosis] || 0) + 1;
      }
    });

    return {
      totalAssessments,
      totalPatients,
      recentAssessments,
      diagnosisBreakdown,
    };
  }, [assessments]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (diagnosis !== 'all') params.append('diagnosis', diagnosis);
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const res = await fetch(`/api/admin/assessments?${params.toString()}`);

      if (res.ok) {
        const data = await res.json();
        setAssessments(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  }, [search, diagnosis, dateFrom, dateTo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClearFilters = () => {
    setSearch("");
    setDiagnosis("all");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={username} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              จัดการข้อมูล
            </h1>
            <p className="text-gray-500 mt-1">
              ดู ค้นหา และจัดการข้อมูลการประเมินทั้งหมด
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
            >
              <Home className="h-4 w-4 mr-2" />
              กลับหน้าหลัก
            </Button>
          </div>
        </div>

        <StatsCards
          totalAssessments={filteredStats.totalAssessments}
          totalPatients={filteredStats.totalPatients}
          recentAssessments={filteredStats.recentAssessments}
          diagnosisBreakdown={filteredStats.diagnosisBreakdown}
          isFiltered={hasActiveFilters}
        />

        <FilterPanel
          search={search}
          diagnosis={diagnosis}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearch}
          onDiagnosisChange={setDiagnosis}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onClearFilters={handleClearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="mb-3 text-sm text-gray-600">
          แสดง <span className="font-semibold text-gray-900">{assessments.length}</span> รายการ
          {hasActiveFilters && " (กรองแล้ว)"}
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : (
          <AssessmentTable 
            assessments={assessments} 
            onRefresh={fetchData}
          />
        )}
      </div>
    </div>
  );
}