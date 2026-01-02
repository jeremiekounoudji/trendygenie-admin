import { Button } from '@heroui/react';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSortBy?: string;
  currentSortOrder?: 'asc' | 'desc';
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  className?: string;
}

export function SortableHeader({
  label,
  sortKey,
  currentSortBy,
  currentSortOrder,
  onSort,
  className = '',
}: SortableHeaderProps) {
  const isActive = currentSortBy === sortKey;
  const isAsc = isActive && currentSortOrder === 'asc';
  const isDesc = isActive && currentSortOrder === 'desc';

  const handleSort = () => {
    if (!isActive) {
      // First click - sort ascending
      onSort(sortKey, 'asc');
    } else if (isAsc) {
      // Second click - sort descending
      onSort(sortKey, 'desc');
    } else {
      // Third click - remove sort (default to created_at desc)
      onSort('created_at', 'desc');
    }
  };

  return (
    <Button
      variant="light"
      size="sm"
      onPress={handleSort}
      className={`justify-start h-auto p-2 font-medium text-left ${className}`}
      endContent={
        <div className="flex flex-col ml-1">
          <svg
            className={`w-3 h-3 transition-colors ${
              isAsc ? 'text-primary-500' : 'text-default-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <svg
            className={`w-3 h-3 -mt-1 transition-colors ${
              isDesc ? 'text-primary-500' : 'text-default-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      }
    >
      {label}
    </Button>
  );
}

export default SortableHeader;