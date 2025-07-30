import React from 'react';
import { useController, Control } from 'react-hook-form';
import { GlobalSelect, SelectOption } from './global-select';

interface FormGlobalSelectProps {
  name: string;
  control: Control<any>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  required?: boolean;
  formItemClassName?: string;
}

export const FormGlobalSelect = ({
  name,
  control,
  options,
  label,
  placeholder,
  isLoading,
  disabled,
  className,
  emptyMessage,
  required,
  formItemClassName,
}: FormGlobalSelectProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <GlobalSelect
      options={options}
      label={label}
      placeholder={placeholder}
      value={field.value}
      onChange={field.onChange}
      isLoading={isLoading}
      disabled={disabled}
      error={error?.message}
      className={className}
      emptyMessage={emptyMessage}
      name={field.name}
      required={required}
      formItemClassName={formItemClassName}
    />
  );
};
