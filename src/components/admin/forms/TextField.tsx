'use client';

import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  className?: string;
  description?: string;
}

const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  ({ label, name, value, onChange, placeholder, error, required, multiline, rows = 3, disabled, className, description }, ref) => {
    const inputClasses = cn(
      'bg-[#1A1A1A] border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37] focus:ring-[#D4AF37]',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
      className
    );

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-white flex items-center gap-1">
          {label}
          {required && <span className="text-red-400">*</span>}
        </Label>
        
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        
        {multiline ? (
          <Textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
          />
        ) : (
          <Input
            ref={ref as React.Ref<HTMLInputElement>}
            id={name}
            name={name}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
          />
        )}
        
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';

export default TextField;



