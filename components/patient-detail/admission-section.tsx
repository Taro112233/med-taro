// components/patient-detail/admission-section.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Pencil, Save, X, Plus } from 'lucide-react';
import type { Admission } from '@/lib/types';
import { AddAdmissionDialog } from './add-admission-dialog';
import { toast } from 'sonner';

interface AdmissionSectionProps {
  admissions: Admission[];
  patientId: string;
  selectedAdmissionId: string;
  onAdmissionChange: (id: string) => void;
  onAdmissionAdded: () => void;
}

export function AdmissionSection({
  admissions,
  patientId,
  selectedAdmissionId,
  onAdmissionChange,
  onAdmissionAdded,
}: AdmissionSectionProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Admission>>({});

  const selectedAdmission = admissions.find(
    (adm) => adm.id === selectedAdmissionId
  );

  const handleEdit = () => {
    if (selectedAdmission) {
      setFormData({
        admissionNumber: selectedAdmission.admissionNumber,
        bedNumber: selectedAdmission.bedNumber,
        chiefComplaint: selectedAdmission.chiefComplaint || '',
        historyPresent: selectedAdmission.historyPresent || '',
        pastMedicalHx: selectedAdmission.pastMedicalHx || '',
        familyHistory: selectedAdmission.familyHistory || '',
        socialHistory: selectedAdmission.socialHistory || '',
        allergies: selectedAdmission.allergies || '',
        medications: selectedAdmission.medications || '',
        lab: selectedAdmission.lab || '',
        note: selectedAdmission.note || '',
      });
      setEditMode(true);
    }
  };

  const handleCancel = () => {
    setFormData({});
    setEditMode(false);
  };

  const handleSave = async () => {
    if (!selectedAdmission) return;

    setLoading(true);
    try {
      await fetch(`/api/admissions/${selectedAdmission.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      toast.success('บันทึกข้อมูลเรียบร้อยแล้ว');
      setEditMode(false);
      onAdmissionAdded();
    } catch (error) {
      console.error('Error updating admission:', error);
      toast.error('ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedAdmission) {
    return (
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="text-center py-8">
          <p className="text-sm sm:text-base text-gray-500 mb-4">ไม่มีข้อมูล Admission</p>
          <AddAdmissionDialog
            patientId={patientId}
            onAdmissionAdded={onAdmissionAdded}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Admission Information</h2>
        <div className="flex flex-wrap items-center gap-2">
          {admissions.length > 1 && (
            <Select
              value={selectedAdmissionId}
              onValueChange={onAdmissionChange}
            >
              <SelectTrigger className="w-full sm:w-[200px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {admissions.map((adm) => (
                  <SelectItem key={adm.id} value={adm.id} className="text-sm">
                    AN: {adm.admissionNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <AddAdmissionDialog
            patientId={patientId}
            onAdmissionAdded={onAdmissionAdded}
            trigger={
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Plus className="h-4 w-4 mr-2" />
                เพิ่ม Admission
              </Button>
            }
          />
          {!editMode ? (
            <Button variant="outline" size="sm" onClick={handleEdit} className="text-xs sm:text-sm">
              <Pencil className="h-4 w-4 mr-2" />
              แก้ไข
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={loading}
                className="text-xs sm:text-sm"
              >
                <X className="h-4 w-4 mr-2" />
                ยกเลิก
              </Button>
              <Button size="sm" onClick={handleSave} disabled={loading} className="text-xs sm:text-sm">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="col-span-2 md:col-span-1">
          <p className="text-xs text-gray-500">AN</p>
          {editMode ? (
            <Input
              value={formData.admissionNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, admissionNumber: e.target.value })
              }
              className="text-sm mt-1"
            />
          ) : (
            <p className="text-sm font-medium break-all">
              {selectedAdmission.admissionNumber}
            </p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500">Bed</p>
          {editMode ? (
            <Input
              value={formData.bedNumber || ''}
              onChange={(e) =>
                setFormData({ ...formData, bedNumber: e.target.value })
              }
              className="text-sm mt-1"
            />
          ) : (
            <p className="text-sm font-medium">{selectedAdmission.bedNumber}</p>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500">Admit Date</p>
          <p className="text-sm font-medium">
            {new Date(selectedAdmission.admissionDate).toLocaleDateString(
              'th-TH'
            )}
          </p>
        </div>
        {selectedAdmission.dischargeDate && (
          <div>
            <p className="text-xs text-gray-500">Discharge Date</p>
            <p className="text-sm font-medium">
              {new Date(selectedAdmission.dischargeDate).toLocaleDateString(
                'th-TH'
              )}
            </p>
          </div>
        )}
      </div>

      <Separator className="my-4 sm:my-6" />

      {/* Clinical Fields */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label htmlFor="cc" className="text-xs sm:text-sm font-medium">
            CC - Chief Complaint
          </Label>
          <Textarea
            id="cc"
            value={
              editMode
                ? formData.chiefComplaint || ''
                : selectedAdmission.chiefComplaint || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, chiefComplaint: e.target.value })
            }
            disabled={!editMode}
            rows={2}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="hpi" className="text-xs sm:text-sm font-medium">
            HPI - History of Present Illness
          </Label>
          <Textarea
            id="hpi"
            value={
              editMode
                ? formData.historyPresent || ''
                : selectedAdmission.historyPresent || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, historyPresent: e.target.value })
            }
            disabled={!editMode}
            rows={4}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="pmh" className="text-xs sm:text-sm font-medium">
            PMH - Past Medical History
          </Label>
          <Textarea
            id="pmh"
            value={
              editMode
                ? formData.pastMedicalHx || ''
                : selectedAdmission.pastMedicalHx || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, pastMedicalHx: e.target.value })
            }
            disabled={!editMode}
            rows={3}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="fh" className="text-xs sm:text-sm font-medium">
            FH - Family History
          </Label>
          <Textarea
            id="fh"
            value={
              editMode
                ? formData.familyHistory || ''
                : selectedAdmission.familyHistory || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, familyHistory: e.target.value })
            }
            disabled={!editMode}
            rows={2}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="sh" className="text-xs sm:text-sm font-medium">
            SH - Social History
          </Label>
          <Textarea
            id="sh"
            value={
              editMode
                ? formData.socialHistory || ''
                : selectedAdmission.socialHistory || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, socialHistory: e.target.value })
            }
            disabled={!editMode}
            rows={2}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="allergies" className="text-xs sm:text-sm font-medium">
            Allergies
          </Label>
          <Textarea
            id="allergies"
            value={
              editMode
                ? formData.allergies || ''
                : selectedAdmission.allergies || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, allergies: e.target.value })
            }
            disabled={!editMode}
            rows={2}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="medications" className="text-xs sm:text-sm font-medium">
            Medications
          </Label>
          <Textarea
            id="medications"
            value={
              editMode
                ? formData.medications || ''
                : selectedAdmission.medications || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, medications: e.target.value })
            }
            disabled={!editMode}
            rows={3}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="lab" className="text-xs sm:text-sm font-medium">
            Lab Results
          </Label>
          <Textarea
            id="lab"
            value={
              editMode ? formData.lab || '' : selectedAdmission.lab || '-'
            }
            onChange={(e) => setFormData({ ...formData, lab: e.target.value })}
            disabled={!editMode}
            rows={3}
            className="mt-2 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="note" className="text-xs sm:text-sm font-medium">
            Note
          </Label>
          <Textarea
            id="note"
            value={
              editMode ? formData.note || '' : selectedAdmission.note || '-'
            }
            onChange={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
            disabled={!editMode}
            rows={2}
            className="mt-2 text-sm"
          />
        </div>
      </div>
    </Card>
  );
}