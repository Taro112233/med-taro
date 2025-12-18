// components/forms/sections/risk-factor-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RiskFactorSectionProps {
  note: string;
  onNoteChange: (value: string) => void;
}

export function RiskFactorSection({ note, onNoteChange }: RiskFactorSectionProps) {
  return (
    <Card className="col-span-2 col-start-1 row-start-3 p-2 h-full">
      <div className="flex items-center gap-2">
        <Label className="text-xs font-semibold">Note/Risk factor</Label>
        <Input
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="h-6 text-xs flex-1"
          placeholder="บันทึกปัจจัยเสี่ยง..."
        />
      </div>
    </Card>
  );
}