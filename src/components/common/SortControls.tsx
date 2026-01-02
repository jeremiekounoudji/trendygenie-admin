import { Select, SelectItem } from '@heroui/react';

export interface SortOption {
  label: string;
  value: string;
  defaultOrder?: 'asc' | 'desc';
}

interface SortControlsProps {
  sortOptions: SortOption[];
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

export function SortControls({
  sortOptions,
  currentSortBy = 'created_at',
  currentSortOrder = 'desc',
  onSortChange,
  className = '',
}: SortControlsProps) {
  const currentSortValue = `${currentSortBy}_${currentSortOrder}`;

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('_') as [string, 'asc' | 'desc'];
    onSortChange(sortBy, sortOrder);
  };

  // Generate sort options with both asc and desc variants
  const allSortOptions = sortOptions.flatMap((option) => [
    {
      label: `${option.label} (A-Z)`,
      value: `${option.value}_asc`,
    },
    {
      label: `${option.label} (Z-A)`,
      value: `${option.value}_desc`,
    },
  ]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-default-600 whitespace-nowrap">Sort by:</span>
      <Select
        size="sm"
        selectedKeys={[currentSortValue]}
        onChange={(e) => handleSortChange(e.target.value)}
        className="w-48"
        aria-label="Sort options"
      >
        {allSortOptions.map((option) => (
          <SelectItem key={option.value} textValue={option.label}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}

export default SortControls;