// components/forms/sections/ar-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ARData {
  symptoms: string;
  severity: 'MILD' | 'MOD_SEVERE' | '';
  pattern: 'INTERMITTENT' | 'PERSISTENT' | '';
}

interface ARSectionProps {
  ar: ARData;
  onARChange: (data: Partial<ARData>) => void;
}

export function ARSection({ ar, onARChange }: ARSectionProps) {
  const handleSeverityChange = (value: 'MILD' | 'MOD_SEVERE') => {
    // If clicking the same option, deselect it
    if (ar.severity === value) {
      onARChange({ severity: '' });
    } else {
      onARChange({ severity: value });
    }
  };

  const handlePatternChange = (value: 'INTERMITTENT' | 'PERSISTENT') => {
    // If clicking the same option, deselect it
    if (ar.pattern === value) {
      onARChange({ pattern: '' });
    } else {
      onARChange({ pattern: value });
    }
  };

  return (
    <Card className="col-start-2 row-start-5 p-2 h-full">
      <Label className="text-xs font-semibold mb-0.5 block">AR</Label>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Label className="text-xs">อาการ</Label>
          <Input
            value={ar.symptoms}
            onChange={(e) => onARChange({ symptoms: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="บันทึกอาการ..."
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ar-mild"
                checked={ar.severity === 'MILD'}
                onCheckedChange={() => handleSeverityChange('MILD')}
              />
              <Label htmlFor="ar-mild" className="text-xs cursor-pointer">Mild</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ar-modsev"
                checked={ar.severity === 'MOD_SEVERE'}
                onCheckedChange={() => handleSeverityChange('MOD_SEVERE')}
              />
              <Label htmlFor="ar-modsev" className="text-xs cursor-pointer">Mod-Severe</Label>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ar-inter"
                checked={ar.pattern === 'INTERMITTENT'}
                onCheckedChange={() => handlePatternChange('INTERMITTENT')}
              />
              <Label htmlFor="ar-inter" className="text-xs cursor-pointer">Intermittent</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ar-persist"
                checked={ar.pattern === 'PERSISTENT'}
                onCheckedChange={() => handlePatternChange('PERSISTENT')}
              />
              <Label htmlFor="ar-persist" className="text-xs cursor-pointer">Persistent</Label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}