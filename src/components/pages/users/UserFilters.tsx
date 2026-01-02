import type { UserFilters as UserFiltersType, UserType } from '../../../types/user';
import { FilterDropdown, type FilterOption } from '../../common/FilterDropdown';

interface UserFiltersProps {
  filters: UserFiltersType;
  onChange: (filters: UserFiltersType) => void;
  className?: string;
}

const userTypeOptions: FilterOption[] = [
  { label: 'Customer', value: 'customer' },
  { label: 'Provider', value: 'provider' },
  { label: 'Admin', value: 'admin' },
];

const statusOptions: FilterOption[] = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];

export function UserFilters({ filters, onChange, className = '' }: UserFiltersProps) {
  const handleUserTypeChange = (value: string | undefined) => {
    onChange({
      ...filters,
      userType: value as UserType | undefined,
    });
  };

  const handleStatusChange = (value: string | undefined) => {
    onChange({
      ...filters,
      isActive: value ? value === 'true' : undefined,
    });
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="w-full sm:w-48">
        <FilterDropdown
          label="User Type"
          options={userTypeOptions}
          value={filters.userType}
          onChange={handleUserTypeChange}
          placeholder="All Types"
        />
      </div>
      
      <div className="w-full sm:w-48">
        <FilterDropdown
          label="Status"
          options={statusOptions}
          value={filters.isActive?.toString()}
          onChange={handleStatusChange}
          placeholder="All Status"
        />
      </div>
    </div>
  );
}

export default UserFilters;