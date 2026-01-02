import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useCompanies } from '../hooks/useCompanies';
import type { Company, CompanyFilters as CompanyFiltersType, CompanyStatus } from '../types/company';
import { SummaryCard } from '../components/common/SummaryCard';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { SortControls, type SortOption } from '../components/common/SortControls';
import { CompanyCard, CompanyDetailModal, CompanyFilters } from '../components/pages/companies';
import { showSuccess, showError } from '../utils/toast';

export function CompaniesPage() {
  const {
    companies,
    loading,
    error,
    stats,
    statsLoading,
    pagination,
    filters,
    sortBy,
    sortOrder,
    setFilters,
    setPage,
    setPageSize,
    setSortBy,
    setSortOrder,
    updateStatus,
    deleteCompany,
    refetch,
  } = useCompanies();

  // Modal states
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  // Loading states
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sort options for companies
  const sortOptions: SortOption[] = [
    { label: 'Company Name', value: 'name' },
    { label: 'Registration Number', value: 'registration_number' },
    { label: 'Status', value: 'status' },
    { label: 'Created Date', value: 'created_at' },
    { label: 'Updated Date', value: 'updated_at' },
    { label: 'Approved Date', value: 'approved_at' },
  ];

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: CompanyFiltersType) => {
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle view company
  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company);
    setShowDetailModal(true);
  };

  // Handle status change
  const handleStatusChange = async (company: Company, status: string) => {
    setUpdatingStatus(company.id);
    
    try {
      const success = await updateStatus(company.id, status as CompanyStatus);
      
      if (success) {
        const statusLabels = {
          approved: 'approved',
          rejected: 'rejected',
          suspended: 'suspended',
          pending: 'set to pending'
        };
        showSuccess(`Company ${statusLabels[status as keyof typeof statusLabels] || 'updated'} successfully`);
      } else {
        showError('Failed to update company status');
      }
    } catch (err) {
      showError('An error occurred while updating company status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle delete company
  const handleDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!companyToDelete) return;

    setDeleting(true);
    
    try {
      const success = await deleteCompany(companyToDelete.id);
      
      if (success) {
        showSuccess('Company deleted successfully');
        setShowDeleteModal(false);
        setCompanyToDelete(null);
      } else {
        showError('Failed to delete company');
      }
    } catch (err) {
      showError('An error occurred while deleting company');
    } finally {
      setDeleting(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-default-900">Company Management</h1>
          <p className="text-default-600">Manage registered companies and their approval status</p>
        </div>
        <Button
          color="primary"
          variant="flat"
          onPress={handleRefresh}
          isLoading={loading}
          startContent={
            !loading && (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )
          }
        >
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          title="Total Companies"
          value={stats?.total ?? null}
          loading={statsLoading}
          color="secondary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Pending Approval"
          value={stats?.pending ?? null}
          loading={statsLoading}
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Approved"
          value={stats?.approved ?? null}
          loading={statsLoading}
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Rejected"
          value={stats?.rejected ?? null}
          loading={statsLoading}
          color="danger"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Suspended"
          value={stats?.suspended ?? null}
          loading={statsLoading}
          color="default"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
            </svg>
          }
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search companies by name, registration number, or email..."
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <CompanyFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            // TODO: Add categories when available
            categories={[]}
          />
          
          <SortControls
            sortOptions={sortOptions}
            currentSortBy={sortBy}
            currentSortOrder={sortOrder}
            onSortChange={handleSortChange}
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-danger-700 font-medium">Error loading companies</span>
          </div>
          <p className="text-danger-600 mt-1">{error.message}</p>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={handleRefresh}
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      )}

      {/* Companies Grid */}
      {!loading && !error && (
        <>
          {companies.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-default-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-lg font-medium text-default-600 mb-2">No companies found</h3>
              <p className="text-default-500">
                {filters.search || filters.status || filters.categoryId
                  ? 'Try adjusting your search or filters'
                  : 'No companies have been registered yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {companies.map((company) => (
                <div key={company.id} className="relative">
                  {updatingStatus === company.id && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Spinner size="sm" color="primary" />
                    </div>
                  )}
                  <CompanyCard
                    company={company}
                    onView={handleViewCompany}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteCompany}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {companies.length > 0 && (
            <Pagination
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      {/* Company Detail Modal */}
      <CompanyDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedCompany(null);
        }}
        company={selectedCompany}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setCompanyToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Company"
        message={`Are you sure you want to delete "${companyToDelete?.name}"? This action cannot be undone and will also delete all associated businesses and services.`}
        confirmLabel="Delete"
        confirmColor="danger"
        loading={deleting}
      />
    </div>
  );
}

export default CompaniesPage;