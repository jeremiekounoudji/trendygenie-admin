import { FilterDropdown, type FilterOption } from '../../common/FilterDropdown';
import { SearchInput } from '../../common/SearchInput';
import type { ServiceFilters } from '../../../types/service';
import { SERVICE_STATUS_LABELS } from '../../../constants/status';

interface ServiceFiltersProps {
  filters: ServiceFilters;
  onFiltersChange: (filters: ServiceFilters) => void;
  categories?: Array<{ id: string; name: string }>;
  businesses?: Array<{ id: string; name: string }>;
}

export function ServiceFilters({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  businesses = [] 
}: ServiceFiltersProps) {
  const statusOptions: FilterOption[] = Object.entries(SERVICE_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const categoryOptions: FilterOption[] = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const businessOptions: FilterOption[] = businesses.map(business => ({
    value: business.id,
    label: business.name,
  }));

  const handleStatusChange = (status: string | undefined) => {
    onFiltersChange({
      ...filters,
      status: status as ServiceFilters['status'],
    });
  };

  const handleCategoryChange = (categoryId: string | undefined) => {
    onFiltersChange({
      ...filters,
      categoryId,
    });
  };

  const handleBusinessChange = (businessId: string | undefined) => {
    onFiltersChange({
      ...filters,
      businessId,
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
          placeholder="Search services by title, description, or provider..."
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

        {/* Business Filter */}
        {businesses.length > 0 && (
          <div className="flex-1 min-w-0">
            <FilterDropdown
              label="Business"
              options={businessOptions}
              value={filters.businessId}
              onChange={handleBusinessChange}
              placeholder="All Businesses"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ServiceFilters;