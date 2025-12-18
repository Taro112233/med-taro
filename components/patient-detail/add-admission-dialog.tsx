// components/patient-detail/add-admission-dialog.tsx

'use client';

import { useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddAdmissionDialogProps {
  patientId: string;
  onAdmissionAdded: () => void;
  trigger?: ReactNode;
}

export function AddAdmissionDialog({
  patientId,
  onAdmissionAdded,
  trigger,
}: AddAdmissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    admissionNumber: '',
    bedNumber: '',
    admissionDate: new Date().toISOString().split('T')[0],
    chiefComplaint: '',
    historyPresent: '',
    pastMedicalHx: '',
    familyHistory: '',
    socialHistory: '',
    allergies: '',
    medications: '',
    note: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          patientId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create admission');
      }

      toast.success('เพิ่ม Admission เรียบร้อยแล้ว');
      setFormData({
        admissionNumber: '',
        bedNumber: '',
        admissionDate: new Date().toISOString().split('T')[0],
        chiefComplaint: '',
        historyPresent: '',
        pastMedicalHx: '',
        familyHistory: '',
        socialHistory: '',
        allergies: '',
        medications: '',
        note: '',
      });
      setOpen(false);
      onAdmissionAdded();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="w-full sm:w-auto text-sm">
            <Plus className="mr-2 h-4 w-4" />
            เพิ่ม Admission ใหม่
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">เพิ่ม Admission ใหม่</DialogTitle>
          <DialogDescription className="text-sm">
            กรอกข้อมูล Admission ใหม่สำหรับผู้ป่วยคนนี้
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="an" className="text-sm">AN *</Label>
                <Input
                  id="an"
                  value={formData.admissionNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      admissionNumber: e.target.value,
                    })
                  }
                  required
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bed" className="text-sm">Bed Number *</Label>
                <Input
                  id="bed"
                  value={formData.bedNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, bedNumber: e.target.value })
                  }
                  required
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admitDate" className="text-sm">Admission Date *</Label>
              <Input
                id="admitDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) =>
                  setFormData({ ...formData, admissionDate: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cc" className="text-sm">CC - Chief Complaint</Label>
              <Textarea
                id="cc"
                value={formData.chiefComplaint}
                onChange={(e) =>
                  setFormData({ ...formData, chiefComplaint: e.target.value })
                }
                rows={2}
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hpi" className="text-sm">HPI - History of Present Illness</Label>
              <Textarea
                id="hpi"
                value={formData.historyPresent}
                onChange={(e) =>
                  setFormData({ ...formData, historyPresent: e.target.value })
                }
                rows={3}
                className="text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}