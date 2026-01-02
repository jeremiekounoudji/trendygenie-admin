import { FilterDropdown, type FilterOption } from '../../common/FilterDropdown';
import { SearchInput } from '../../common/SearchInput';
import { Input } from '@heroui/react';
import type { TransactionFilters } from '../../../types/transaction';
import { TRANSACTION_STATUS_LABELS, PAYMENT_PROVIDER_LABELS } from '../../../constants/status';

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
}

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const statusOptions: FilterOption[] = Object.entries(TRANSACTION_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const providerOptions: FilterOption[] = Object.entries(PAYMENT_PROVIDER_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const handleStatusChange = (status: string | undefined) => {
    onFiltersChange({
      ...filters,
      status: status as TransactionFilters['status'],
    });
  };

  const handleProviderChange = (paymentProvider: string | undefined) => {
    onFiltersChange({
      ...filters,
      paymentProvider: paymentProvider as TransactionFilters['paymentProvider'],
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined,
    });
  };

  const handleDateFromChange = (dateFrom: string) => {
    onFiltersChange({
      ...filters,
      dateFrom: dateFrom || undefined,
    });
  };

  const handleDateToChange = (dateTo: string) => {
    onFiltersChange({
      ...filters,
      dateTo: dateTo || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-default-50 rounded-lg">
      {/* Search */}
      <div className="w-full">
        <SearchInput
          placeholder="Search transactions by order ID, description, or payment ID..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters Row 1 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex-1 min-w-0">
          <FilterDropdown
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={handleStatusChange}
            placeholder="All Statuses"
          />
        </div>

        {/* Payment Provider Filter */}
        <div className="flex-1 min-w-0">
          <FilterDropdown
            label="Payment Provider"
            options={providerOptions}
            value={filters.paymentProvider}
            onChange={handleProviderChange}
            placeholder="All Providers"
          />
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <Input
            type="date"
            label="From Date"
            placeholder="Select start date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleDateFromChange(e.target.value)}
            variant="bordered"
            size="sm"
            classNames={{
              label: "text-default-600 text-sm font-medium",
              input: "text-sm",
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <Input
            type="date"
            label="To Date"
            placeholder="Select end date"
            value={filters.dateTo || ''}
            onChange={(e) => handleDateToChange(e.target.value)}
            variant="bordered"
            size="sm"
            classNames={{
              label: "text-default-600 text-sm font-medium",
              input: "text-sm",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default TransactionFilters;