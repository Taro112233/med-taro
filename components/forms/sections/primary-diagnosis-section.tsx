// components/forms/sections/primary-diagnosis-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface PrimaryDiagnosisSectionProps {
  primaryDiagnosis: string;
  onDiagnosisChange: (value: string) => void;
}

const DIAGNOSIS_OPTIONS = [
  { value: 'ASTHMA', label: 'Asthma' },
  { value: 'COPD', label: 'COPD' },
  { value: 'ACOD', label: 'ACOD' },
  { value: 'BRONCHIECTASIS', label: 'Bronchiectasis' },
  { value: 'ALLERGIC_RHINITIS', label: 'Allergic Rhinitis' },
  { value: 'GERD', label: 'GERD' },
];

export function PrimaryDiagnosisSection({ primaryDiagnosis, onDiagnosisChange }: PrimaryDiagnosisSectionProps) {
  return (
    <Card className="col-span-2 row-start-2 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">โรคหลัก *</Label>
      <div className="grid grid-cols-3 gap-x-3 gap-y-0.5">
        {DIAGNOSIS_OPTIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center space-x-1.5">
            <Checkbox
              checked={primaryDiagnosis === value}
              onCheckedChange={(checked) => onDiagnosisChange(checked ? value : '')}
              id={value}
            />
            <Label htmlFor={value} className="text-xs">{label}</Label>
          </div>
        ))}
      </div>
    </Card>
  );
}