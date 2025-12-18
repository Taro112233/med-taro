// components/forms/sections/medications-section.tsx
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

interface MedicationItem {
  id: string;
  name: string;
  quantity: number;
}

interface MedicationsData {
  medicationStatus: 'NO_REMAINING' | 'HAS_REMAINING' | '';
  items: MedicationItem[];
}

interface MedicationsSectionProps {
  medications: MedicationsData;
  onMedicationsChange: (data: Partial<MedicationsData>) => void;
}

const MEDICATION_OPTIONS = [
  { value: 'budesonide', label: 'Budesonide' },
  { value: 'seretide25_125', label: 'Seretide 25/125' },
  { value: 'seretide25_250', label: 'Seretide 25/250' },
  { value: 'seretide50_250', label: 'Seretide 50/250' },
  { value: 'seretideAccu', label: 'Seretide Accu' },
  { value: 'symbicort80_4.5', label: 'Symbicort 80/4.5' },
  { value: 'symbicort160_4.5', label: 'Symbicort 160/4.5' },
  { value: 'symbicort320_9', label: 'Symbicort 320/9' },
  { value: 'ventolinMDI', label: 'Ventolin MDI' },
  { value: 'berodualMDI', label: 'Berodual MDI' },
  { value: 'avamysNS', label: 'Avamys NS' },
  { value: 'theophylline', label: 'Theophylline' },
  { value: 'montelukast', label: 'Montelukast' },
  { value: 'spirivaHand', label: 'Spiriva Hand' },
  { value: 'ellipta', label: 'Ellipta' },
  { value: 'spiolto', label: 'Spiolto' },
  { value: 'other', label: 'อื่น ๆ (ระบุ)' },
];

export function MedicationsSection({ medications, onMedicationsChange }: MedicationsSectionProps) {
  const [selectedMed, setSelectedMed] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customName, setCustomName] = useState('');

  const handleAddMedication = () => {
    if (!selectedMed) {
      return;
    }

    const medName = selectedMed === 'other' 
      ? customName 
      : MEDICATION_OPTIONS.find(opt => opt.value === selectedMed)?.label || '';

    if (!medName || !quantity || parseInt(quantity) <= 0) {
      return;
    }

    const newItem: MedicationItem = {
      id: Date.now().toString(),
      name: medName,
      quantity: parseInt(quantity)
    };

    onMedicationsChange({
      items: [...(medications.items || []), newItem]
    });

    // Reset form
    setSelectedMed('');
    setQuantity('');
    setCustomName('');
  };

  const handleRemoveMedication = (id: string) => {
    onMedicationsChange({
      items: medications.items.filter(item => item.id !== id)
    });
  };

  return (
    <Card className="col-span-2 row-span-2 col-start-3 row-start-6 p-2">
      <div className="space-y-1">
        <div className="flex gap-4">
          <Label className="text-xs font-semibold mb-0.5 block">จำนวนยาเหลือ</Label>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={medications.medicationStatus === 'NO_REMAINING'}
              onCheckedChange={(checked) => onMedicationsChange({ 
                medicationStatus: checked ? 'NO_REMAINING' : '' 
              })}
              id="no-remain"
            />
            <Label htmlFor="no-remain" className="text-xs">ไม่เหลือยา</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <Checkbox
              checked={medications.medicationStatus === 'HAS_REMAINING'}
              onCheckedChange={(checked) => onMedicationsChange({ 
                medicationStatus: checked ? 'HAS_REMAINING' : '' 
              })}
              id="has-remain"
            />
            <Label htmlFor="has-remain" className="text-xs">เหลือยาที่ยังไม่เปิดกล่อง</Label>
          </div>
        </div>

        {/* Add Medication Form */}
        <div className="flex gap-1 items-start">
          <div className="flex-1">
            <Select value={selectedMed} onValueChange={setSelectedMed}>
              <SelectTrigger className="h-6 text-xs">
                <SelectValue placeholder="เลือกยา..." />
              </SelectTrigger>
              <SelectContent>
                {MEDICATION_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Custom medication name input */}
            {selectedMed === 'other' && (
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="ระบุชื่อยา"
                className="h-6 text-xs mt-1"
              />
            )}
          </div>

          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="จำนวน"
            className="h-6 text-xs w-16"
            min="1"
          />

          <Button
            type="button"
            size="sm"
            onClick={handleAddMedication}
            className="h-6 px-2"
            disabled={!selectedMed || !quantity}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Medication Tags */}
        {medications.items && medications.items.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {medications.items.map((item) => (
              <div
                key={item.id}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
              >
                <span className="font-medium">{item.name}</span>
                <span className="text-blue-600">×{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMedication(item.id)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}