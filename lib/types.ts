// lib/types.ts

export interface VitalSigns {
  bp?: string;
  hr?: number;
  rr?: number;
  temp?: number;
  o2sat?: number;
}

export interface Patient {
  id: string;
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  status: 'ADMIT' | 'DISCHARGED';
  createdAt: Date;
  updatedAt: Date;
  admissions?: Admission[];
}

export interface Admission {
  id: string;
  admissionNumber: string;
  patientId: string;
  bedNumber: string;
  admissionDate: Date;
  dischargeDate?: Date | null;
  chiefComplaint?: string | null;
  historyPresent?: string | null;
  pastMedicalHx?: string | null;
  familyHistory?: string | null;
  socialHistory?: string | null;
  allergies?: string | null;
  medications?: string | null;
  lab?: string | null;
  note?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientWithAdmission extends Patient {
  admissions: Admission[];
}