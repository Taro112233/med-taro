// components/forms/sections/inhaler-technique-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, X } from 'lucide-react';

interface TechniqueSteps {
  prepare: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  inhale: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  rinse: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
  empty: { [device: string]: { status: 'correct' | 'incorrect' | 'none'; note: string } };
}

interface InhalerTechniqueData {
  techniqueCorrect: boolean | null;
  techniqueSteps: TechniqueSteps;
  spacerType: string;
}

interface InhalerTechniqueSectionProps {
  technique: InhalerTechniqueData;
  onTechniqueChange: (data: Partial<InhalerTechniqueData>) => void;
}

const DEVICES = ['MDI', 'TURBU', 'ACCU', 'NS', 'HAND', 'ELLIPTA', 'SPIOLTO'];
const STEPS = ['Prepare', 'Inhale', 'Rinse', 'Empty'];
const SPACER_OPTIONS = [
  { value: 'MOUTH_PIECE', label: 'Mouth-piece' },
  { value: 'VOLUMETRIC', label: 'Volumetric' },
  { value: 'CONE', label: 'Cone' },
  { value: 'NONE', label: 'None' },
];

export function InhalerTechniqueSection({ technique, onTechniqueChange }: InhalerTechniqueSectionProps) {
  const handleStepClick = (step: string, device: string) => {
    const stepKey = step.toLowerCase() as keyof TechniqueSteps;
    const currentStatus = technique.techniqueSteps[stepKey]?.[device]?.status || 'none';
    
    let newStatus: 'correct' | 'incorrect' | 'none';
    if (currentStatus === 'none') {
      newStatus = 'correct';
    } else if (currentStatus === 'correct') {
      newStatus = 'incorrect';
    } else {
      newStatus = 'none';
    }

    onTechniqueChange({
      techniqueSteps: {
        ...technique.techniqueSteps,
        [stepKey]: {
          ...technique.techniqueSteps[stepKey],
          [device]: {
            status: newStatus,
            note: technique.techniqueSteps[stepKey]?.[device]?.note || '',
          }
        }
      }
    });
  };

  const handleNoteChange = (step: string, device: string, value: string) => {
    const stepKey = step.toLowerCase() as keyof TechniqueSteps;

    onTechniqueChange({
      techniqueSteps: {
        ...technique.techniqueSteps,
        [stepKey]: {
          ...technique.techniqueSteps[stepKey],
          [device]: {
            status: technique.techniqueSteps[stepKey][device]?.status || 'none',
            note: value,
          }
        }
      }
    });
  };

  const getIncorrectDevices = (step: string): Array<{device: string; note: string}> => {
    const stepKey = step.toLowerCase() as keyof TechniqueSteps;
    const stepData = technique.techniqueSteps[stepKey] || {};
    
    return Object.entries(stepData)
      .filter(([, val]) => val.status === 'incorrect')
      .map(([device, val]) => ({ device, note: val.note || '' }));
  };

  const renderStatusIcon = (status: 'correct' | 'incorrect' | 'none') => {
    if (status === 'correct') {
      return <Check className="w-4 h-4 text-green-600" />;
    } else if (status === 'incorrect') {
      return <X className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  // ✅ FIX: แก้ไข handler ให้รองรับ CheckedState (true | false | 'indeterminate')
  const handleTechniqueCorrectChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onTechniqueChange({ techniqueCorrect: true });
    } else {
      onTechniqueChange({ techniqueCorrect: null });
    }
  };

  const handleTechniqueIncorrectChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onTechniqueChange({ techniqueCorrect: false });
    } else {
      onTechniqueChange({ techniqueCorrect: null });
    }
  };

  return (
    <Card className="col-span-2 row-span-2 col-start-1 row-start-7 p-2 h-full">
      <div className="space-y-1">
        <div className="flex gap-4">
          <div className="flex items-center space-x-1.5">
            <Label className="text-xs font-semibold mb-0.5 block">เทคนิคการพ่นยา</Label>
            <Checkbox
              checked={technique.techniqueCorrect === true}
              onCheckedChange={handleTechniqueCorrectChange}
              id="tech-correct"
            />
            <Label htmlFor="tech-correct" className="text-xs cursor-pointer">
              ถูกต้องทุกขั้นตอน
            </Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={technique.techniqueCorrect === false}
              onCheckedChange={handleTechniqueIncorrectChange}
              id="tech-incorrect"
            />
            <Label htmlFor="tech-incorrect" className="text-xs cursor-pointer">
              ไม่ถูกต้อง
            </Label>
          </div>
        </div>

        {/* Technique Table */}
        <div className="border rounded text-xs">
          <div className="grid grid-cols-[80px_repeat(7,60px)_1fr] bg-gray-100 border-b">
            <div className="p-1 border-r font-semibold">รูปแบบ</div>
            {DEVICES.map(device => (
              <div key={device} className="p-1 border-r text-center">
                {device === 'TURBU' ? 'Turbu' : device}
              </div>
            ))}
            <div className="p-1">รายละเอียดปัญหา (ถ้ามี)</div>
          </div>

          {STEPS.map((step) => {
            const incorrectDevices = getIncorrectDevices(step);
            
            return (
              <div key={step} className="grid grid-cols-[80px_repeat(7,60px)_1fr] border-b last:border-b-0">
                <div className="p-1 border-r font-medium">{step}</div>
                {DEVICES.map((device) => {
                  const stepKey = step.toLowerCase() as keyof TechniqueSteps;
                  const status = technique.techniqueSteps[stepKey]?.[device]?.status || 'none';
                  return (
                    <div 
                      key={device} 
                      className="p-1 border-r flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleStepClick(step, device)}
                    >
                      {renderStatusIcon(status)}
                    </div>
                  );
                })}
                
                <div className="p-1 space-y-1">
                  {incorrectDevices.length === 0 ? (
                    <span className="text-gray-400 text-xs">-</span>
                  ) : (
                    incorrectDevices.map(({ device, note }) => (
                      <div key={device} className="flex items-center gap-1">
                        <span className="text-xs font-medium text-red-600 whitespace-nowrap">
                          {device}:
                        </span>
                        <Input
                          value={note}
                          onChange={(e) => handleNoteChange(step, device, e.target.value)}
                          className="h-5 text-xs border-gray-300 flex-1"
                          placeholder="ระบุปัญหา..."
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Spacer */}
        <div>
          <div className="flex flex-wrap gap-2">
            <Label className="text-xs mb-0.5 block">Spacer</Label>
            {SPACER_OPTIONS.map(({ value, label }) => (
              <div key={value} className="flex items-center space-x-1.5">
                <Checkbox
                  checked={technique.spacerType === value}
                  onCheckedChange={(checked) => onTechniqueChange({
                    spacerType: checked ? value : ''
                  })}
                  id={`spacer-${value}`}
                />
                <Label htmlFor={`spacer-${value}`} className="text-xs cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}