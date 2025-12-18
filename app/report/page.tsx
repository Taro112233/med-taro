// app/report/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ReportFilters } from "@/components/reports/report-filters";
import { toast } from "sonner";
import { AsthmaControlChart } from "@/components/reports/asthma-control-chart";
import { ComplianceChart } from "@/components/reports/compliance-chart";
import { COPDStageChart } from "@/components/reports/copd-stage-chart";
import { ReportSummary } from "@/components/reports/report-summary";
import { TechniqueChart } from "@/components/reports/technique-chart";

interface ReportStats {
  totalAssessments: number;
  totalPatients: number;
  asthmaControl: {
    wellControlled: number;
    partlyControlled: number;
    uncontrolled: number;
    notApplicable: number;
  };
  copdStage: {
    stageA: number;
    stageB: number;
    stageE: number;
    notApplicable: number;
  };
  complianceRanges: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  avgComplianceByDiagnosis: Record<string, number>;
  sideEffectsPrevalence: number;
  techniqueCorrectness: {
    correct: number;
    incorrect: number;
    notAssessed: number;
  };
}

interface ReportData {
  stats: ReportStats;
  percentages: {
    sideEffectsRate: number;
    techniqueCorrectRate: number;
  };
  dateRange: {
    from: string | null;
    to: string | null;
  };
  diagnosis: string;
}

const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

const getFirstDayOfMonthString = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toISOString().split('T')[0];
};

export default function ReportPage() {
  const router = useRouter();
  const { username, handleLogout } = useAuth();
  
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [dateFrom, setDateFrom] = useState(getFirstDayOfMonthString());
  const [dateTo, setDateTo] = useState(getTodayDateString());
  const [diagnosis, setDiagnosis] = useState("all");

  const fetchReport = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      if (diagnosis !== 'all') params.append('diagnosis', diagnosis);

      const res = await fetch(`/api/reports/stats?${params.toString()}`);

      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      } else {
        toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  }, [dateFrom, dateTo, diagnosis]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader username={username} onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              รายงานสรุปผล
            </h1>
            <p className="text-gray-500 mt-1">
              ภาพรวมการควบคุมอาการของผู้ป่วย
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchReport}
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

        <ReportFilters
          dateFrom={dateFrom}
          dateTo={dateTo}
          diagnosis={diagnosis}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
          onDiagnosisChange={setDiagnosis}
        />

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-6">
            <ReportSummary
              totalAssessments={reportData.stats.totalAssessments}
              totalPatients={reportData.stats.totalPatients}
              sideEffectsRate={reportData.percentages.sideEffectsRate}
              techniqueCorrectRate={reportData.percentages.techniqueCorrectRate}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(diagnosis === 'all' || diagnosis === 'ASTHMA') && (
                <AsthmaControlChart data={reportData.stats.asthmaControl} />
              )}

              {(diagnosis === 'all' || diagnosis === 'COPD') && (
                <COPDStageChart data={reportData.stats.copdStage} />
              )}

              <ComplianceChart data={reportData.stats.complianceRanges} />

              <TechniqueChart data={reportData.stats.techniqueCorrectness} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">ไม่พบข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );
}