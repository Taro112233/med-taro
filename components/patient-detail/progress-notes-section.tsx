// components/patient-detail/progress-notes-section.tsx

'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Admission, ProgressNote } from '@/lib/types';
import { AddProgressNoteDialog } from './add-progress-note-dialog';
import { ProgressNoteCard } from './progress-note-card';

interface ProgressNotesSectionProps {
  admission: Admission | undefined;
  onNoteAdded: () => void;
}

export function ProgressNotesSection({
  admission,
  onNoteAdded,
}: ProgressNotesSectionProps) {
  if (!admission) {
    return null;
  }

  const progressNotes = admission.progressNotes || [];

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold">Progress Notes</h2>
        <AddProgressNoteDialog
          admissionId={admission.id}
          onNoteAdded={onNoteAdded}
          trigger={
            <Button className="w-full sm:w-auto text-sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          }
        />
      </div>

      {progressNotes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">ยังไม่มี Progress Note</p>
        </div>
      ) : (
        <div className="space-y-4">
          {progressNotes.map((note: ProgressNote) => (
            <ProgressNoteCard
              key={note.id}
              note={note}
              onDelete={onNoteAdded}
            />
          ))}
        </div>
      )}
    </Card>
  );
}