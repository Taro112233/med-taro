// components/forms/sections/asthma-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface AsthmaData {
  pef: string;
  pefPercent: string;
  day: string;
  night: string;
  rescue: string;
  er: string;
  admit: string;
  controlLevel: string;
}

interface AsthmaSectionProps {
  asthma: AsthmaData;
  onAsthmaChange: (data: Partial<AsthmaData>) => void;
}

export function AsthmaSection({ asthma, onAsthmaChange }: AsthmaSectionProps) {
  const handleControlLevelChange = (value: string) => {
    // If clicking the same option, deselect it
    if (asthma.controlLevel === value) {
      onAsthmaChange({ controlLevel: '' });
    } else {
      onAsthmaChange({ controlLevel: value });
    }
  };

  return (
    <Card className="row-span-2 col-start-1 row-start-4 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">Asthma</Label>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">PEF</Label>
          <Input
            value={asthma.pef}
            onChange={(e) => onAsthmaChange({ pef: e.target.value })}
            className="h-6 text-xs w-20"
          />
          <span className="text-xs">(</span>
          <Input
            type="number"
            value={asthma.pefPercent}
            onChange={(e) => onAsthmaChange({ pefPercent: e.target.value })}
            className="h-6 text-xs w-16"
            placeholder="%"
          />
          <span className="text-xs">%)</span>
        </div>
        
        <div>
          <Label className="text-xs mb-0.5 block">Limited activity</Label>
          <div className="grid grid-cols-5 gap-1">
            {[
              { key: 'day', label: 'Day' },
              { key: 'night', label: 'Night' },
              { key: 'rescue', label: 'Rescue' },
              { key: 'er', label: 'ER' },
              { key: 'admit', label: 'Admit' },
            ].map(({ key, label }) => (
              <div key={key} className="flex flex-col items-center">
                <Label className="text-[10px] mt-0.5">{label}</Label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1">
            {['day', 'night', 'rescue', 'er', 'admit'].map((key) => (
              <Input
                key={key}
                type="number"
                min="0"
                value={asthma[key as keyof AsthmaData]}
                onChange={(e) => onAsthmaChange({ [key]: e.target.value })}
                className="h-6 text-xs text-center"
              />
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-xs mb-0.5 block">Level of controlled</Label>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="control-well"
                checked={asthma.controlLevel === 'WELL'}
                onCheckedChange={() => handleControlLevelChange('WELL')}
              />
              <Label htmlFor="control-well" className="text-xs cursor-pointer">
                Well controlled (0 ข้อ)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="control-partly"
                checked={asthma.controlLevel === 'PARTLY'}
                onCheckedChange={() => handleControlLevelChange('PARTLY')}
              />
              <Label htmlFor="control-partly" className="text-xs cursor-pointer">
                Partly (1 - 2 ข้อ)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="control-uncontrolled"
                checked={asthma.controlLevel === 'UNCONTROLLED'}
                onCheckedChange={() => handleControlLevelChange('UNCONTROLLED')}
              />
              <Label htmlFor="control-uncontrolled" className="text-xs cursor-pointer">
                Uncontrolled (3 - 4 ข้อ)
              </Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}