// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { PatientCard } from '@/components/dashboard/patient-card';
import { SearchBar } from '@/components/dashboard/search-bar';
import { StatusFilter } from '@/components/dashboard/status-filter';
import { AddPatientDialog } from '@/components/dashboard/add-patient-dialog';
import { PatientWithAdmission } from '@/lib/types';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [patients, setPatients] = useState<PatientWithAdmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ADMIT');
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      console.log('[Dashboard] Fetching patients...');
      const response = await fetch(`/api/patients?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch patients');
      }

      const data = await response.json();
      console.log('[Dashboard] Received patients:', data.length);
      setPatients(data);
    } catch (error) {
      console.error('[Dashboard] Error fetching patients:', error);
      const errorMessage = error instanceof Error ? error.message : 'ไม่สามารถโหลดข้อมูลได้';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            ผู้ป่วยใน - Dashboard
          </h1>
          <AddPatientDialog onPatientAdded={fetchPatients} />
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <SearchBar onSearch={setSearch} />
            <div className="flex justify-start sm:justify-end">
              <StatusFilter currentStatus={status} onStatusChange={setStatus} />
            </div>
          </div>
        </div>

        {/* Patient Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-red-500">{error}</p>
            <button
              onClick={fetchPatients}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ลองอีกครั้ง
            </button>
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-500">
              ไม่พบข้อมูลผู้ป่วย{status !== 'ALL' ? ` (สถานะ: ${status})` : ''}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              ลองเพิ่มผู้ป่วยใหม่ หรือเปลี่ยนตัวกรอง
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {patients.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}