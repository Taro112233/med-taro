// components/patient-detail/add-progress-note-dialog.tsx

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
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AddProgressNoteDialogProps {
  admissionId: string;
  onNoteAdded: () => void;
  trigger?: ReactNode;
}

export function AddProgressNoteDialog({
  admissionId,
  onNoteAdded,
  trigger,
}: AddProgressNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    note: '',
    createdBy: '',
    vitalSigns: {
      bp: '',
      hr: '',
      rr: '',
      temp: '',
      o2sat: '',
    },
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Prepare vital signs (only include filled values)
      const vitalSigns: Record<string, string | number> = {};
      if (formData.vitalSigns.bp) vitalSigns.bp = formData.vitalSigns.bp;
      if (formData.vitalSigns.hr)
        vitalSigns.hr = parseFloat(formData.vitalSigns.hr);
      if (formData.vitalSigns.rr)
        vitalSigns.rr = parseFloat(formData.vitalSigns.rr);
      if (formData.vitalSigns.temp)
        vitalSigns.temp = parseFloat(formData.vitalSigns.temp);
      if (formData.vitalSigns.o2sat)
        vitalSigns.o2sat = parseFloat(formData.vitalSigns.o2sat);

      const response = await fetch('/api/progress-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admissionId,
          subjective: formData.subjective || undefined,
          objective: formData.objective || undefined,
          assessment: formData.assessment || undefined,
          plan: formData.plan || undefined,
          note: formData.note || undefined,
          createdBy: formData.createdBy,
          vitalSigns: Object.keys(vitalSigns).length > 0 ? vitalSigns : undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create progress note');
      }

      toast.success('เพิ่ม Progress Note เรียบร้อยแล้ว');
      setFormData({
        subjective: '',
        objective: '',
        assessment: '',
        plan: '',
        note: '',
        createdBy: '',
        vitalSigns: {
          bp: '',
          hr: '',
          rr: '',
          temp: '',
          o2sat: '',
        },
      });
      setOpen(false);
      onNoteAdded();
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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Progress Note
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Add Progress Note</DialogTitle>
          <DialogDescription className="text-sm">
            กรอกข้อมูล SOAP และ Vital Signs
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-6 py-4">
            {/* Vital Signs */}
            <div>
              <Label className="text-sm font-bold mb-3 block">
                Vital Signs (Optional)
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                <div className="space-y-2">
                  <Label htmlFor="bp" className="text-xs">
                    BP
                  </Label>
                  <Input
                    id="bp"
                    placeholder="120/80"
                    value={formData.vitalSigns.bp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: {
                          ...formData.vitalSigns,
                          bp: e.target.value,
                        },
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hr" className="text-xs">
                    HR (bpm)
                  </Label>
                  <Input
                    id="hr"
                    type="number"
                    placeholder="72"
                    value={formData.vitalSigns.hr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: {
                          ...formData.vitalSigns,
                          hr: e.target.value,
                        },
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rr" className="text-xs">
                    RR (/min)
                  </Label>
                  <Input
                    id="rr"
                    type="number"
                    placeholder="16"
                    value={formData.vitalSigns.rr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: {
                          ...formData.vitalSigns,
                          rr: e.target.value,
                        },
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temp" className="text-xs">
                    Temp (°C)
                  </Label>
                  <Input
                    id="temp"
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={formData.vitalSigns.temp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: {
                          ...formData.vitalSigns,
                          temp: e.target.value,
                        },
                      })
                    }
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="o2sat" className="text-xs">
                    O2 Sat (%)
                  </Label>
                  <Input
                    id="o2sat"
                    type="number"
                    placeholder="98"
                    value={formData.vitalSigns.o2sat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vitalSigns: {
                          ...formData.vitalSigns,
                          o2sat: e.target.value,
                        },
                      })
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* SOAP */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjective" className="text-sm font-medium">
                  S - Subjective
                </Label>
                <Textarea
                  id="subjective"
                  value={formData.subjective}
                  onChange={(e) =>
                    setFormData({ ...formData, subjective: e.target.value })
                  }
                  rows={3}
                  placeholder="Patient's complaints and symptoms..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objective" className="text-sm font-medium">
                  O - Objective
                </Label>
                <Textarea
                  id="objective"
                  value={formData.objective}
                  onChange={(e) =>
                    setFormData({ ...formData, objective: e.target.value })
                  }
                  rows={3}
                  placeholder="Physical examination findings..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment" className="text-sm font-medium">
                  A - Assessment
                </Label>
                <Textarea
                  id="assessment"
                  value={formData.assessment}
                  onChange={(e) =>
                    setFormData({ ...formData, assessment: e.target.value })
                  }
                  rows={3}
                  placeholder="Diagnosis and clinical impression..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan" className="text-sm font-medium">
                  P - Plan
                </Label>
                <Textarea
                  id="plan"
                  value={formData.plan}
                  onChange={(e) =>
                    setFormData({ ...formData, plan: e.target.value })
                  }
                  rows={3}
                  placeholder="Treatment plan and follow-up..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium">
                  Additional Note
                </Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows={2}
                  placeholder="Any additional notes..."
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdBy" className="text-sm font-medium">
                  Created By *
                </Label>
                <Input
                  id="createdBy"
                  value={formData.createdBy}
                  onChange={(e) =>
                    setFormData({ ...formData, createdBy: e.target.value })
                  }
                  placeholder="ชื่อผู้บันทึก"
                  required
                  className="text-sm"
                />
              </div>
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