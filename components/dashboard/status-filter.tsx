// components/dashboard/status-filter.tsx

'use client';

import { Button } from '@/components/ui/button';

interface StatusFilterProps {
  currentStatus: string;
  onStatusChange: (status: string) => void;
}

export function StatusFilter({ currentStatus, onStatusChange }: StatusFilterProps) {
  const statuses = [
    { value: 'ALL', label: 'ทั้งหมด' },
    { value: 'ADMIT', label: 'Admit' },
    { value: 'DISCHARGED', label: 'D/C' },
  ];

  return (
    <div className="flex gap-2">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={currentStatus === status.value ? 'default' : 'outline'}
          onClick={() => onStatusChange(status.value)}
          size="sm"
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}