// components/dashboard/patient-card.tsx

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { PatientWithAdmission } from '@/lib/types';
import Link from 'next/link';

interface PatientCardProps {
  patient: PatientWithAdmission;
}

export function PatientCard({ patient }: PatientCardProps) {
  const currentAdmission = patient.admissions?.[0];
  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <Link href={`/${patient.id}`}>
      <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
        <div className="space-y-3 sm:space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-xl font-bold text-gray-900 break-words">
                {fullName}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 break-all">
                HN: {patient.hospitalNumber}
              </p>
            </div>
            {currentAdmission && (
              <Badge
                variant={currentAdmission.status === 'ADMIT' ? 'default' : 'secondary'}
                className="text-xs shrink-0"
              >
                {currentAdmission.status === 'ADMIT' ? 'Admit' : 'D/C'}
              </Badge>
            )}
          </div>

          {/* Admission Info */}
          {currentAdmission && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">AN</p>
                <p className="text-xs sm:text-sm font-medium break-all">
                  {currentAdmission.admissionNumber}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bed</p>
                <p className="text-xs sm:text-sm font-medium">
                  {currentAdmission.bedNumber}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Admit Date</p>
                <p className="text-xs sm:text-sm font-medium">
                  {new Date(currentAdmission.admissionDate).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>
          )}

          {/* Clinical Info */}
          {currentAdmission && (
            <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
              {currentAdmission.chiefComplaint && (
                <div>
                  <p className="text-xs font-medium text-gray-700">CC</p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 break-words">
                    {currentAdmission.chiefComplaint}
                  </p>
                </div>
              )}
              
              {currentAdmission.historyPresent && (
                <div>
                  <p className="text-xs font-medium text-gray-700">HPI</p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 break-words">
                    {currentAdmission.historyPresent}
                  </p>
                </div>
              )}
              
              {currentAdmission.note && (
                <div>
                  <p className="text-xs font-medium text-gray-700">Note</p>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 break-words">
                    {currentAdmission.note}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}