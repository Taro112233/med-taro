// components/forms/sections/compliance-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ComplianceData {
  complianceStatus: 'GOOD_COMPLIANCE' | 'FIRST_USE' | 'CANNOT_ASSESS' | 'NON_COMPLIANCE' | '';
  cannotAssessReason: string;
  compliancePercent: string;
  nonComplianceReasons: {
    incorrectTechnique: boolean;
    incorrectDosage: boolean;
  };
}

interface ComplianceSectionProps {
  compliance: ComplianceData;
  onComplianceChange: (data: Partial<ComplianceData>) => void;
}

export function ComplianceSection({ compliance, onComplianceChange }: ComplianceSectionProps) {
  return (
    <Card className="col-span-2 col-start-1 row-start-6 p-2 h-full">
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1.5">
            <Label className="text-xs font-semibold mb-0.5 block">A. การใช้ยา (Compliance %)</Label>
            <Checkbox
              checked={compliance.complianceStatus === 'GOOD_COMPLIANCE'}
              onCheckedChange={(checked) => onComplianceChange({
                complianceStatus: checked ? 'GOOD_COMPLIANCE' : ''
              })}
              id="good"
            />
            <Label htmlFor="good" className="text-xs">ใช้ยาได้ดี</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={compliance.complianceStatus === 'FIRST_USE'}
              onCheckedChange={(checked) => onComplianceChange({
                complianceStatus: checked ? 'FIRST_USE' : ''
              })}
              id="first"
            />
            <Label htmlFor="first" className="text-xs">1st use</Label>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={compliance.complianceStatus === 'CANNOT_ASSESS'}
            onCheckedChange={(checked) => onComplianceChange({
              complianceStatus: checked ? 'CANNOT_ASSESS' : ''
            })}
            id="cannot"
          />
          <Label htmlFor="cannot" className="text-xs">ประเมินไม่ได้ เพราะ</Label>
          <Input
            value={compliance.cannotAssessReason}
            onChange={(e) => onComplianceChange({ cannotAssessReason: e.target.value })}
            className="h-6 text-xs flex-1"
            placeholder="..."
          />
        </div>

        <div className="flex items-center space-x-1.5">
          <Checkbox
            checked={compliance.complianceStatus === 'NON_COMPLIANCE'}
            onCheckedChange={(checked) => onComplianceChange({
              complianceStatus: checked ? 'NON_COMPLIANCE' : ''
            })}
            id="non"
          />
          <Label htmlFor="non" className="text-xs inline-flex items-center gap-1.5 flex-wrap">
            Non-compliance (
            <Checkbox
              checked={compliance.nonComplianceReasons.incorrectTechnique}
              onCheckedChange={(checked) => onComplianceChange({
                nonComplianceReasons: {
                  ...compliance.nonComplianceReasons,
                  incorrectTechnique: !!checked,
                }
              })}
              id="incorrectTech"
            />
            วิธีพ่นยาไม่ถูก
            <Checkbox
              checked={compliance.nonComplianceReasons.incorrectDosage}
              onCheckedChange={(checked) => onComplianceChange({
                nonComplianceReasons: {
                  ...compliance.nonComplianceReasons,
                  incorrectDosage: !!checked,
                }
              })}
              id="incorrectDose"
            />
            ใช้ไม่ตรงแพทย์)
          </Label>
        </div>
      </div>
    </Card>
  );
}