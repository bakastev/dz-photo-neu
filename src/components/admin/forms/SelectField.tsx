'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Auswählen...',
  error,
  required,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          className={cn(
            'bg-[#1A1A1A] border-white/10 text-white focus:border-[#D4AF37] focus:ring-[#D4AF37]',
            !value && 'text-gray-500',
            error && 'border-red-500'
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#141414] border-white/10">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}



