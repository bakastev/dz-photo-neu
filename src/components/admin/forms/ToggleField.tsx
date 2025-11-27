'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ToggleFieldProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function ToggleField({
  label,
  description,
  value,
  onChange,
  disabled,
}: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <Label className="text-white">{label}</Label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        className={cn(
          'data-[state=checked]:bg-[#D4AF37]',
          disabled && 'opacity-50'
        )}
      />
    </div>
  );
}

