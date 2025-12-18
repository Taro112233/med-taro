// components/forms/sections/non-compliance-reasons-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface NonComplianceReasons {
  lessThan: boolean;
  lessThanDetail: string;
  moreThan: boolean;
  moreThanDetail: string;
  lackKnowledge: boolean;
  notReadLabel: boolean;
  elderly: boolean;
  forget: boolean;
  fearSideEffects: boolean;
  other: string;
}

interface NonComplianceReasonsSectionProps {
  reasons: NonComplianceReasons;
  compliancePercent: string;
  onReasonsChange: (data: Partial<NonComplianceReasons>) => void;
  onCompliancePercentChange: (value: string) => void;
}

const REASON_OPTIONS = [
  { key: 'lackKnowledge', label: 'ไม่เข้าใจโรค/ขาดความรู้' },
  { key: 'notReadLabel', label: 'ไม่อ่านฉลากยา' },
  { key: 'elderly', label: 'สูงอายุ/ขาดผู้ดูแล' },
  { key: 'forget', label: 'ลืม/ติดธุระ' },
  { key: 'fearSideEffects', label: 'กลัวผลข้างเคียง' },
];

export function NonComplianceReasonsSection({ 
  reasons, 
  compliancePercent,
  onReasonsChange,
  onCompliancePercentChange,
}: NonComplianceReasonsSectionProps) {
  return (
    <Card className="col-span-2 row-span-3 col-start-3 row-start-2 p-2 h-full">
      <div className="flex justify-between items-center mb-1">
        <Label className="text-xs font-semibold">B. เหตุผลที่ไม่ใช้ยาตามที่กำหนด</Label>
        <div className="flex items-center gap-1">
          <Label className="text-xs whitespace-nowrap">Compliance</Label>
          <Input
            type="number"
            min="0"
            max="100"
            value={compliancePercent}
            onChange={(e) => onCompliancePercentChange(e.target.value)}
            className="h-6 text-xs w-16 text-center"
            placeholder="0"
          />
          <span className="text-xs">%</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={reasons.lessThan}
            onCheckedChange={(checked) => onReasonsChange({ lessThan: !!checked })}
            id="reason-lessThan"
          />
          <Label htmlFor="reason-lessThan" className="text-xs">น้อยกว่า</Label>
          <Input
            value={reasons.lessThanDetail}
            onChange={(e) => onReasonsChange({ lessThanDetail: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="รายละเอียด"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Checkbox
            checked={reasons.moreThan}
            onCheckedChange={(checked) => onReasonsChange({ moreThan: !!checked })}
            id="reason-moreThan"
          />
          <Label htmlFor="reason-moreThan" className="text-xs">มากกว่า</Label>
          <Input
            value={reasons.moreThanDetail}
            onChange={(e) => onReasonsChange({ moreThanDetail: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="รายละเอียด"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-0.5">
          {REASON_OPTIONS.map(({ key, label }) => (
            <div key={key} className="flex items-center space-x-1.5">
              <Checkbox
                checked={reasons[key as keyof NonComplianceReasons] as boolean}
                onCheckedChange={(checked) => onReasonsChange({ [key]: !!checked })}
                id={`reason-${key}`}
              />
              <Label htmlFor={`reason-${key}`} className="text-xs leading-tight">{label}</Label>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs">อื่น ๆ</Label>
          <Input
            value={reasons.other}
            onChange={(e) => onReasonsChange({ other: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="ระบุเหตุผลอื่น ๆ"
          />
        </div>
      </div>
    </Card>
  );
}