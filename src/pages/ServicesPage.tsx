import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useServices } from '../hooks/useServices';
import type { Service, ServiceFilters as ServiceFiltersType, ServiceStatus } from '../types/service';
import { SummaryCard } from '../components/common/SummaryCard';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SortControls, type SortOption } from '../components/common/SortControls';
import { ServiceCard, ServiceDetailModal } from '../components/pages/services';
import { ServiceFilters } from '../components/pages/services/ServiceFilters';
import { showSuccess, showError } from '../utils/toast';

export function ServicesPage() {
  const {
    services,
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
    deleteService,
    refetch,
  } = useServices();

  // Modal states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Loading states
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sort options for services
  const sortOptions: SortOption[] = [
    { label: 'Service Title', value: 'title' },
    { label: 'Status', value: 'status' },
    { label: 'Price', value: 'normal_price' },
    { label: 'Rating', value: 'rating' },
    { label: 'View Count', value: 'view_count' },
    { label: 'Created Date', value: 'created_at' },
    { label: 'Updated Date', value: 'updated_at' },
  ];

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: ServiceFiltersType) => {
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle view service
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  // Handle status change
  const handleStatusChange = async (service: Service, status: string) => {
    setUpdatingStatus(service.id);
    
    try {
      const success = await updateStatus(service.id, status as ServiceStatus);
      
      if (success) {
        const statusLabels = {
          active: 'activated',
          rejected: 'rejected',
          suspended: 'suspended',
          pending: 'set to pending'
        };
        showSuccess(`Service ${statusLabels[status as keyof typeof statusLabels] || 'updated'} successfully`);
      } else {
        showError('Failed to update service status');
      }
    } catch (err) {
      showError('An error occurred while updating service status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle delete service
  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    setDeleting(true);
    
    try {
      const success = await deleteService(serviceToDelete.id);
      
      if (success) {
        showSuccess('Service deleted successfully');
        setShowDeleteModal(false);
        setServiceToDelete(null);
      } else {
        showError('Failed to delete service');
      }
    } catch (err) {
      showError('An error occurred while deleting service');
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
          <h1 className="text-2xl font-bold text-default-900">Service Management</h1>
          <p className="text-default-600">Manage service listings and moderate content quality</p>
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
          title="Total Services"
          value={stats?.total ?? null}
          loading={statsLoading}
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Active"
          value={stats?.active ?? null}
          loading={statsLoading}
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Pending"
          value={stats?.pending ?? null}
          loading={statsLoading}
          color="secondary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        
        <SummaryCard
          title="Rejected"
          value={stats?.rejected ?? null}
          loading={statsLoading}
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <SummaryCard
          title="Deletion Requested"
          value={stats?.requestDeletion ?? null}
          loading={statsLoading}
          color="danger"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
            placeholder="Search services by title, description, or provider..."
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <ServiceFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            // TODO: Add categories and businesses when available
            categories={[]}
            businesses={[]}
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
            <span className="text-danger-700 font-medium">Error loading services</span>
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

      {/* Services Grid */}
      {!loading && !error && (
        <>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-default-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3 className="text-lg font-medium text-default-600 mb-2">No services found</h3>
              <p className="text-default-500">
                {filters.search || filters.status || filters.categoryId || filters.businessId
                  ? 'Try adjusting your search or filters'
                  : 'No services have been listed yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {services.map((service) => (
                <div key={service.id} className="relative">
                  {updatingStatus === service.id && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Spinner size="sm" color="primary" />
                    </div>
                  )}
                  <ServiceCard
                    service={service}
                    onView={handleViewService}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteService}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {services.length > 0 && (
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

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedService(null);
        }}
        service={selectedService}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setServiceToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Service"
        message={`Are you sure you want to delete "${serviceToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        isLoading={deleting}
      />
    </div>
  );
}

export default ServicesPage;