import React from 'react';
import { Input, Textarea, Select, SelectItem, Checkbox } from '@heroui/react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

export interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'textarea' | 'select' | 'checkbox';
  value: any;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: Array<{ label: string; value: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}

/**
 * Reusable form field component with validation error display
 */
export function FormField({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  options = [],
  rows = 4,
  min,
  max,
  step,
  description,
  startContent,
  endContent,
  className,
}: FormFieldProps) {
  const hasError = !!error;
  const isInvalid = hasError;

  const commonProps = {
    name,
    label,
    value: value || '',
    isRequired: required,
    isDisabled: disabled,
    isInvalid,
    errorMessage: error,
    description,
    placeholder,
    className,
  };

  switch (type) {
    case 'textarea':
      return (
        <Textarea
          {...commonProps}
          minRows={rows}
          onValueChange={onChange}
        />
      );

    case 'select':
      return (
        <Select
          {...commonProps}
          selectedKeys={value ? [value] : []}
          onSelectionChange={(keys) => {
            const selectedValue = Array.from(keys)[0] as string;
            onChange(selectedValue);
          }}
        >
          {options.map((option) => (
            <SelectItem key={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      );

    case 'checkbox':
      return (
        <Checkbox
          name={name}
          isSelected={!!value}
          onValueChange={onChange}
          isDisabled={disabled}
          className={className}
        >
          <div className="flex flex-col">
            <span className={`text-sm ${hasError ? 'text-danger' : 'text-foreground'}`}>
              {label}
              {required && <span className="text-danger ml-1">*</span>}
            </span>
            {description && (
              <span className="text-xs text-foreground-500 mt-1">
                {description}
              </span>
            )}
            {hasError && (
              <div className="flex items-center mt-1 text-danger text-xs">
                <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                {error}
              </div>
            )}
          </div>
        </Checkbox>
      );

    case 'number':
      return (
        <Input
          {...commonProps}
          type="number"
          min={min}
          max={max}
          step={step}
          startContent={startContent}
          endContent={endContent}
          onValueChange={onChange}
        />
      );

    case 'email':
    case 'password':
    case 'url':
    case 'text':
    default:
      return (
        <Input
          {...commonProps}
          type={type}
          startContent={startContent}
          endContent={endContent}
          onValueChange={onChange}
        />
      );
  }
}

export default FormField;