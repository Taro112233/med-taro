// components/patient-detail/progress-note-card.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { ProgressNote, VitalSigns } from '@/lib/types';

interface ProgressNoteCardProps {
  note: ProgressNote;
  onDelete: () => void;
}

export function ProgressNoteCard({ note, onDelete }: ProgressNoteCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`/api/progress-notes/${note.id}`, {
        method: 'DELETE',
      });

      toast.success('ลบ Progress Note เรียบร้อยแล้ว');
      setShowDeleteDialog(false);
      onDelete();
    } catch (error) {
      console.error('Error deleting progress note:', error);
      toast.error('ไม่สามารถลบ Progress Note ได้');
    } finally {
      setLoading(false);
    }
  };

  const vitalSigns = note.vitalSigns as VitalSigns | null;

  return (
    <>
      <Card className="p-4 sm:p-6 border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">
              {new Date(note.createdAt).toLocaleString('th-TH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-xs text-gray-500 mt-1 break-words">โดย: {note.createdBy}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
            className="shrink-0 ml-2"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>

        {/* Vital Signs */}
        {vitalSigns && (
          <>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Vital Signs
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                {vitalSigns.bp && (
                  <div>
                    <p className="text-xs text-gray-500">BP</p>
                    <p className="text-xs sm:text-sm font-medium break-all">{vitalSigns.bp}</p>
                  </div>
                )}
                {vitalSigns.hr && (
                  <div>
                    <p className="text-xs text-gray-500">HR</p>
                    <p className="text-xs sm:text-sm font-medium">{vitalSigns.hr} bpm</p>
                  </div>
                )}
                {vitalSigns.rr && (
                  <div>
                    <p className="text-xs text-gray-500">RR</p>
                    <p className="text-xs sm:text-sm font-medium">{vitalSigns.rr} /min</p>
                  </div>
                )}
                {vitalSigns.temp && (
                  <div>
                    <p className="text-xs text-gray-500">Temp</p>
                    <p className="text-xs sm:text-sm font-medium">{vitalSigns.temp} °C</p>
                  </div>
                )}
                {vitalSigns.o2sat && (
                  <div>
                    <p className="text-xs text-gray-500">O2 Sat</p>
                    <p className="text-xs sm:text-sm font-medium">{vitalSigns.o2sat}%</p>
                  </div>
                )}
              </div>
            </div>
            <Separator className="my-4" />
          </>
        )}

        {/* SOAP */}
        <div className="space-y-3 sm:space-y-4">
          {note.subjective && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">
                S - Subjective
              </p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                {note.subjective}
              </p>
            </div>
          )}

          {note.objective && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">
                O - Objective
              </p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                {note.objective}
              </p>
            </div>
          )}

          {note.assessment && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">
                A - Assessment
              </p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                {note.assessment}
              </p>
            </div>
          )}

          {note.plan && (
            <div>
              <p className="text-xs font-bold text-gray-700 mb-1">P - Plan</p>
              <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                {note.plan}
              </p>
            </div>
          )}

          {note.note && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">
                  Additional Note
                </p>
                <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-wrap break-words">
                  {note.note}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              ยืนยันการลบ
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              คุณต้องการลบ Progress Note นี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? 'กำลังลบ...' : 'ลบ'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}