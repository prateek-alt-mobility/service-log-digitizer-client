import React from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export interface SelectOption {
  value: string;
  label: string;
}

interface GlobalSelectProps {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  emptyMessage?: string;
  name?: string;
  required?: boolean;
  formItemClassName?: string;
  formControl?: React.ReactNode;
}

export const GlobalSelect = ({
  options,
  label,
  placeholder = 'Select an option',
  value,
  onChange,
  isLoading = false,
  disabled = false,
  error,
  className = '',
  emptyMessage = 'No options available',
  name,
  required = false,
  formItemClassName = '',
  formControl,
}: GlobalSelectProps) => {
  return (
    <FormItem className={formItemClassName}>
      {label && (
        <FormLabel>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </FormLabel>
      )}
      {formControl ? (
        formControl
      ) : (
        <FormControl>
          <Select
            onValueChange={onChange}
            value={value}
            disabled={disabled || isLoading}
            name={name}
          >
            <SelectTrigger className={className}>
              <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>
                  <Loader2 className="h-4 w-4 animate-spin mr-2 inline" />
                  Loading...
                </SelectItem>
              ) : options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  {emptyMessage}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </FormControl>
      )}
      {error && <FormMessage>{error}</FormMessage>}
    </FormItem>
  );
};
