// app/[id]/page.tsx

'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { PatientHeader } from '@/components/patient-detail/patient-header';
import { AdmissionSection } from '@/components/patient-detail/admission-section';
import { ProgressNotesSection } from '@/components/patient-detail/progress-notes-section';
import type { Patient, Admission } from '@/lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAdmissionId, setSelectedAdmissionId] = useState<string>('');

  const fetchPatient = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/patients/${resolvedParams.id}`);
      const data = await response.json();
      setPatient(data);
      if (data.admissions && data.admissions.length > 0) {
        setSelectedAdmissionId(data.admissions[0].id);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-sm sm:text-base text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-sm sm:text-base text-gray-500">ไม่พบข้อมูลผู้ป่วย</p>
      </div>
    );
  }

  const selectedAdmission = patient.admissions?.find(
    (adm: Admission) => adm.id === selectedAdmissionId
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4">
        <PatientHeader 
          patient={patient} 
          currentAdmission={selectedAdmission}
          onDischarge={fetchPatient} 
        />
        
        <AdmissionSection
          admissions={patient.admissions || []}
          patientId={patient.id}
          selectedAdmissionId={selectedAdmissionId}
          onAdmissionChange={setSelectedAdmissionId}
          onAdmissionAdded={fetchPatient}
        />

        <ProgressNotesSection
          admission={selectedAdmission}
          onNoteAdded={fetchPatient}
        />
      </div>
    </div>
  );
}