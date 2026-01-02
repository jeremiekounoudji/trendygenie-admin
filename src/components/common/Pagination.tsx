import { Button, Select, SelectItem } from '@heroui/react';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
}: PaginationProps) {
  const startItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    if (!isNaN(newSize) && onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      // Show pages around current
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push('ellipsis');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
      {/* Info */}
      <div className="text-sm text-default-500">
        Showing {startItem} to {endItem} of {total} results
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {onPageSizeChange && (
          <Select
            size="sm"
            selectedKeys={[pageSize.toString()]}
            onChange={(e) => handlePageSizeChange(e.target.value)}
            className="w-20"
            aria-label="Page size"
          >
            {pageSizeOptions.map((size) => (
              <SelectItem key={size.toString()} textValue={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </Select>
        )}

        {/* Previous button */}
        <Button
          size="sm"
          variant="flat"
          isIconOnly
          isDisabled={page <= 1}
          onPress={handlePrevious}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="px-2 text-default-400">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                size="sm"
                variant={pageNum === page ? 'solid' : 'flat'}
                color={pageNum === page ? 'primary' : 'default'}
                onPress={() => onPageChange(pageNum)}
                className="min-w-8"
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        {/* Mobile page indicator */}
        <span className="sm:hidden text-sm text-default-600">
          {page} / {totalPages}
        </span>

        {/* Next button */}
        <Button
          size="sm"
          variant="flat"
          isIconOnly
          isDisabled={page >= totalPages}
          onPress={handleNext}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
