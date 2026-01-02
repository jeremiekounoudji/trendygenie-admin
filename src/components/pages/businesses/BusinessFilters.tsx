import { FilterDropdown, type FilterOption } from '../../common/FilterDropdown';
import { SearchInput } from '../../common/SearchInput';
import type { BusinessFilters } from '../../../types/business';
import { BUSINESS_STATUS_LABELS } from '../../../constants/status';

interface BusinessFiltersProps {
  filters: BusinessFilters;
  onFiltersChange: (filters: BusinessFilters) => void;
  categories?: Array<{ id: string; name: string }>;
  companies?: Array<{ id: string; name: string }>;
}

export function BusinessFilters({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  companies = [] 
}: BusinessFiltersProps) {
  const statusOptions: FilterOption[] = Object.entries(BUSINESS_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions: FilterOption[] = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const companyOptions: FilterOption[] = companies.map(company => ({
    value: company.id,
    label: company.name,
  }));

  const handleStatusChange = (status: string | undefined) => {
    onFiltersChange({
      ...filters,
      status: status as BusinessFilters['status'],
    });
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    onFiltersChange({
      ...filters,
      categoryId,
    });
  };

  const handleCompanyChange = (companyId: string | undefined) => {
    onFiltersChange({
      ...filters,
      companyId,
    });
  };

  const handleSearchChange = (search: string) => {
    onFiltersChange({
      ...filters,
      search: search || undefined,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-default-50 rounded-lg">
      {/* Search */}
      <div className="w-full">
        <SearchInput
          placeholder="Search businesses by name, email, or address..."
          value={filters.search || ''}
          onChange={handleSearchChange}
        />
      </div>

      {/* Filters Row */}
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

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex-1 min-w-0">
            <FilterDropdown
              label="Category"
              options={categoryOptions}
              value={filters.categoryId}
              onChange={handleCategoryChange}
              placeholder="All Categories"
            />
          </div>
        )}

        {/* Company Filter */}
        {companies.length > 0 && (
          <div className="flex-1 min-w-0">
            <FilterDropdown
              label="Company"
              options={companyOptions}
              value={filters.companyId}
              onChange={handleCompanyChange}
              placeholder="All Companies"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessFilters;