'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function DateField({
  label,
  value,
  onChange,
  error,
  required,
  disabled,
  placeholder = 'Datum auswählen',
}: DateFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-white flex items-center gap-1">
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal bg-[#1A1A1A] border-white/10 hover:bg-[#1A1A1A] hover:border-white/20',
              !value && 'text-gray-500',
              error && 'border-red-500'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
            {value ? (
              <span className="text-white">{format(value, 'PPP', { locale: de })}</span>
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#141414] border-white/10" align="start">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={(date) => {
              onChange(date || null);
              setOpen(false);
            }}
            locale={de}
            initialFocus
            className="bg-[#141414]"
          />
        </PopoverContent>
      </Popover>
      
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

