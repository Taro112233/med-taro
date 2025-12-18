// app/dashboard/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { PatientCard } from '@/components/dashboard/patient-card';
import { SearchBar } from '@/components/dashboard/search-bar';
import { StatusFilter } from '@/components/dashboard/status-filter';
import { AddPatientDialog } from '@/components/dashboard/add-patient-dialog';
import { PatientWithAdmission } from '@/lib/types';

export default function DashboardPage() {
  const [patients, setPatients] = useState<PatientWithAdmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ADMIT');

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(`/api/patients?${params.toString()}`);
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
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
        ) : patients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm sm:text-base text-gray-500">ไม่พบข้อมูลผู้ป่วย</p>
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