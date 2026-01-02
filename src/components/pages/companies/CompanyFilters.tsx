import { FilterDropdown, type FilterOption } from '../../common/FilterDropdown';
import { SearchInput } from '../../common/SearchInput';
import type { CompanyFilters } from '../../../types/company';
import { COMPANY_STATUS_LABELS } from '../../../constants/status';

interface CompanyFiltersProps {
  filters: CompanyFilters;
  onFiltersChange: (filters: CompanyFilters) => void;
  categories?: Array<{ id: string; name: string }>;
}

export function CompanyFilters({ filters, onFiltersChange, categories = [] }: CompanyFiltersProps) {
  const statusOptions: FilterOption[] = Object.entries(COMPANY_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions: FilterOption[] = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const handleStatusChange = (status: string | undefined) => {
    onFiltersChange({
      ...filters,
      status: status as CompanyFilters['status'],
    });
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    onFiltersChange({
      ...filters,
      categoryId,
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined,
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-default-50 rounded-lg">
      {/* Search */}
      <div className="flex-1">
        <SearchInput
          placeholder="Search companies by name, registration number, or email..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      {/* Status Filter */}
      <div className="w-full sm:w-48">
        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.status}
          onChange={handleStatusChange}
          placeholder="All Statuses"
        />
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="w-full sm:w-48">
          <FilterDropdown
            label="Category"
            options={categoryOptions}
            value={filters.categoryId}
            onChange={handleCategoryChange}
            placeholder="All Categories"
          />
        </div>
      )}
    </div>
  );
}

export default CompanyFilters;