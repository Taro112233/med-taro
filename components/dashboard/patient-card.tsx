// components/dashboard/patient-card.tsx

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PatientWithAdmission } from '@/lib/types';
import Link from 'next/link';

interface PatientCardProps {
  patient: PatientWithAdmission;
}

export function PatientCard({ patient }: PatientCardProps) {
  const currentAdmission = patient.admissions?.[0];
  const fullName = `${patient.firstName} ${patient.lastName}`;

  return (
    <Link href={`/${patient.id}`}>
      <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
              <p className="text-sm text-gray-500 mt-1">HN: {patient.hospitalNumber}</p>
            </div>
            <Badge variant={patient.status === 'ADMIT' ? 'default' : 'secondary'}>
              {patient.status === 'ADMIT' ? 'Admit' : 'D/C'}
            </Badge>
          </div>

          {/* Admission Info */}
          {currentAdmission && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500">AN</p>
                <p className="text-sm font-medium">{currentAdmission.admissionNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bed</p>
                <p className="text-sm font-medium">{currentAdmission.bedNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Admit Date</p>
                <p className="text-sm font-medium">
                  {new Date(currentAdmission.admissionDate).toLocaleDateString('th-TH')}
                </p>
              </div>
            </div>
          )}

          {/* Clinical Info */}
          {currentAdmission && (
            <div className="space-y-3 pt-4 border-t">
              {currentAdmission.chiefComplaint && (
                <div>
                  <p className="text-xs font-medium text-gray-700">CC</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {currentAdmission.chiefComplaint}
                  </p>
                </div>
              )}
              
              {currentAdmission.historyPresent && (
                <div>
                  <p className="text-xs font-medium text-gray-700">HPI</p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {currentAdmission.historyPresent}
                  </p>
                </div>
              )}
              
              {currentAdmission.note && (
                <div>
                  <p className="text-xs font-medium text-gray-700">Note</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
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