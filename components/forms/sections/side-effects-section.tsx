// components/forms/sections/side-effects-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface SideEffectsData {
  hasSideEffects: boolean | null;
  oralCandidiasis: boolean;
  hoarseVoice: boolean;
  palpitation: boolean;
  other: string;
  management: string;
}

interface SideEffectsSectionProps {
  sideEffects: SideEffectsData;
  onSideEffectsChange: (data: Partial<SideEffectsData>) => void;
}

const SIDE_EFFECT_OPTIONS = [
  { key: 'oralCandidiasis', label: 'เชื้อราในปาก' },
  { key: 'hoarseVoice', label: 'เสียงแหบ' },
  { key: 'palpitation', label: 'ใจสั่น' },
];

export function SideEffectsSection({ sideEffects, onSideEffectsChange }: SideEffectsSectionProps) {
  // ✅ Handler สำหรับ "ไม่เกิด" - คลิกซ้ำเพื่อ deselect
  const handleNotOccurredChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onSideEffectsChange({ hasSideEffects: false });
    } else {
      // ถ้าคลิกออก ให้กลับเป็น null
      onSideEffectsChange({ hasSideEffects: null });
    }
  };

  // ✅ Handler สำหรับ "เกิด" - คลิกซ้ำเพื่อ deselect
  const handleOccurredChange = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      onSideEffectsChange({ hasSideEffects: true });
    } else {
      // ถ้าคลิกออก ให้กลับเป็น null
      onSideEffectsChange({ hasSideEffects: null });
    }
  };

  return (
    <Card className="col-span-2 col-start-3 row-start-5 p-2 h-full">
      <div className="space-y-1">
        <div className="flex gap-4">
          <div className="flex items-center">
            <Label className="text-xs font-semibold mb-0.5 block">C. ผลข้างเคียงจากการใช้ยา</Label>
          </div>

          {/* "ไม่เกิด" (Not Occurred) */}
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={sideEffects.hasSideEffects === false}
              onCheckedChange={handleNotOccurredChange}
              id="se-no"
            />
            <Label htmlFor="se-no" className="text-xs cursor-pointer">ไม่เกิด</Label>
          </div>

          {/* "เกิด" (Occurred) */}
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={sideEffects.hasSideEffects === true}
              onCheckedChange={handleOccurredChange}
              id="se-yes"
            />
            <Label htmlFor="se-yes" className="text-xs cursor-pointer">เกิด</Label>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {SIDE_EFFECT_OPTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-1.5">
              <Checkbox
                checked={sideEffects[key as keyof SideEffectsData] as boolean}
                onCheckedChange={(checked) => onSideEffectsChange({ [key]: !!checked })}
                id={`se-${key}`}
              />
              <Label htmlFor={`se-${key}`} className="text-xs">{label}</Label>
            </div>
          ))}
          <div className="flex items-center space-x-1.5 col-span-2">
            <Label htmlFor="se-other-input" className="text-xs">อื่น ๆ</Label>
            <Input
              id="se-other-input"
              value={sideEffects.other}
              onChange={(e) => onSideEffectsChange({ other: e.target.value })}
              className="h-6 text-xs flex-1"
              placeholder="ระบุ"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-xs">การจัดการ</Label>
          <Input
            value={sideEffects.management}
            onChange={(e) => onSideEffectsChange({ management: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="ระบุวิธีการจัดการผลข้างเคียง"
          />
        </div>
      </div>
    </Card>
  );
}