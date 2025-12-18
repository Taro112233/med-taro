// components/dashboard/add-patient-dialog.tsx

'use client';

import { useState } from 'react';
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
import { Plus } from 'lucide-react';

interface AddPatientDialogProps {
  onPatientAdded: () => void;
}

export function AddPatientDialog({ onPatientAdded }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hospitalNumber: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create patient');
      }

      setFormData({ hospitalNumber: '', firstName: '', lastName: '' });
      setOpen(false);
      onPatientAdded();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto text-sm">
          <Plus className="mr-2 h-4 w-4" />
          เพิ่มผู้ป่วยใหม่
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">เพิ่มผู้ป่วยใหม่</DialogTitle>
          <DialogDescription className="text-sm">
            กรอกข้อมูลผู้ป่วยใหม่
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hn" className="text-sm">HN *</Label>
              <Input
                id="hn"
                value={formData.hospitalNumber}
                onChange={(e) =>
                  setFormData({ ...formData, hospitalNumber: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm">ชื่อ *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm">สกุล *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
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