// lib/types.ts

export interface VitalSigns {
  bp?: string;
  hr?: number;
  rr?: number;
  temp?: number;
  o2sat?: number;
}

export interface ProgressNote {
  id: string;
  admissionId: string;
  subjective?: string | null;
  objective?: string | null;
  assessment?: string | null;
  plan?: string | null;
  vitalSigns?: VitalSigns | null;
  note?: string | null;
  createdAt: Date;
  createdBy: string;
}

export interface Admission {
  id: string;
  admissionNumber: string;
  patientId: string;
  bedNumber: string;
  admissionDate: Date;
  dischargeDate?: Date | null;
  status: 'ADMIT' | 'DISCHARGED'; // เพิ่ม status ใน Admission
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
  progressNotes?: ProgressNote[];
}

export interface Patient {
  id: string;
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  admissions?: Admission[];
}

export interface PatientWithAdmission extends Patient {
  admissions: Admission[];
}