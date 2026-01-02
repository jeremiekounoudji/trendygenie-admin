import { Select, SelectItem } from '@heroui/react';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  allowClear?: boolean;
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'All',
  className = '',
  allowClear = true,
}: FilterDropdownProps) {
  const allOptions = allowClear
    ? [{ label: placeholder, value: '' }, ...options]
    : options;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue === '' ? undefined : newValue);
  };

  return (
    <Select
      label={label}
      selectedKeys={value ? [value] : ['']}
      onChange={handleChange}
      className={className}
      size="sm"
    >
      {allOptions.map((option) => (
        <SelectItem key={option.value} textValue={option.label}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
}

export default FilterDropdown;
