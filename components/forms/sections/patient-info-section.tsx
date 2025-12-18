// components/forms/sections/patient-info-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface PatientInfoSectionProps {
  hospitalNumber: string;
  firstName: string;
  lastName: string;
  age: string;
  alcohol: string;
  alcoholAmount: string;
  smoking: string;
  smokingAmount: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onAgeChange: (value: string) => void;
  onAlcoholChange: (value: 'YES' | 'NO' | '') => void;
  onAlcoholAmountChange: (value: string) => void;
  onSmokingChange: (value: 'YES' | 'NO' | '') => void;
  onSmokingAmountChange: (value: string) => void;
}

export function PatientInfoSection(props: PatientInfoSectionProps) {
  return (
    <Card className="col-span-2 col-start-3 p-2 h-full">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">HN *</Label>
          <Input
            value={props.hospitalNumber}
            disabled
            className="h-6 text-xs flex-1 bg-gray-50 cursor-not-allowed"
            placeholder="กรุณาค้นหา HN ด้านบน"
          />
          <Label className="text-xs whitespace-nowrap">ชื่อ</Label>
          <Input
            value={props.firstName}
            onChange={(e) => props.onFirstNameChange(e.target.value)}
            className="h-6 text-xs flex-1"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">สกุล</Label>
          <Input
            value={props.lastName}
            onChange={(e) => props.onLastNameChange(e.target.value)}
            className="h-6 text-xs flex-1"
          />
          <Label className="text-xs whitespace-nowrap">อายุ (ปี)</Label>
          <Input
            type="number"
            value={props.age}
            onChange={(e) => props.onAgeChange(e.target.value)}
            className="h-6 text-xs w-24"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Alcohol</Label>
          <div className="flex gap-2">
            <div className="flex items-center space-x-1">
              <Checkbox
                checked={props.alcohol === 'NO'}
                onCheckedChange={(checked) => props.onAlcoholChange(checked ? 'NO' : '')}
                id="alc-no"
              />
              <Label htmlFor="alc-no" className="text-xs">No</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                checked={props.alcohol === 'YES'}
                onCheckedChange={(checked) => props.onAlcoholChange(checked ? 'YES' : '')}
                id="alc-yes"
              />
              <Label htmlFor="alc-yes" className="text-xs">Yes</Label>
            </div>
          </div>
          <Input
            placeholder="เท่าไหร่"
            value={props.alcoholAmount}
            onChange={(e) => props.onAlcoholAmountChange(e.target.value)}
            className="h-6 text-xs flex-1"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Label className="text-xs whitespace-nowrap">Smoking</Label>
          <div className="flex gap-2">
            <div className="flex items-center space-x-1">
              <Checkbox
                checked={props.smoking === 'NO'}
                onCheckedChange={(checked) => props.onSmokingChange(checked ? 'NO' : '')}
                id="smk-no"
              />
              <Label htmlFor="smk-no" className="text-xs">No</Label>
            </div>
            <div className="flex items-center space-x-1">
              <Checkbox
                checked={props.smoking === 'YES'}
                onCheckedChange={(checked) => props.onSmokingChange(checked ? 'YES' : '')}
                id="smk-yes"
              />
              <Label htmlFor="smk-yes" className="text-xs">Yes</Label>
            </div>
          </div>
          <Input
            placeholder="เท่าไหร่"
            value={props.smokingAmount}
            onChange={(e) => props.onSmokingAmountChange(e.target.value)}
            className="h-6 text-xs flex-1"
          />
        </div>
      </div>
    </Card>
  );
}