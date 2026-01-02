import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useUsers } from '../hooks/useUsers';
import type { User, UserFilters as UserFiltersType } from '../types/user';
import { SummaryCard } from '../components/common/SummaryCard';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SortControls, type SortOption } from '../components/common/SortControls';
import { UserCard, UserDetailModal, UserFilters } from '../components/pages/users';
import { showSuccess, showError } from '../utils/toast';

export function UsersPage() {
  const {
    users,
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
    deleteUser,
    refetch,
  } = useUsers();

  // Modal states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [userToChangeStatus, setUserToChangeStatus] = useState<{ user: User; isActive: boolean } | null>(null);

  // Loading states
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Sort options for users
  const sortOptions: SortOption[] = [
    { label: 'Name', value: 'full_name' },
    { label: 'Email', value: 'email' },
    { label: 'User Type', value: 'user_type' },
    { label: 'Status', value: 'is_active' },
    { label: 'Created Date', value: 'created_at' },
    { label: 'Updated Date', value: 'updated_at' },
  ];

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: UserFiltersType) => {
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle view user
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  // Handle status change - show confirmation first
  const handleStatusChange = (user: User, isActive: boolean) => {
    setUserToChangeStatus({ user, isActive });
    setShowStatusModal(true);
  };

  // Confirm status change
  const confirmStatusChange = async () => {
    if (!userToChangeStatus) return;

    const { user, isActive } = userToChangeStatus;
    setUpdatingStatus(user.id);
    
    try {
      const success = await updateStatus(user.id, isActive);
      
      if (success) {
        showSuccess(`User ${isActive ? 'activated' : 'deactivated'} successfully`);
        setShowStatusModal(false);
        setUserToChangeStatus(null);
      } else {
        showError('Failed to update user status');
      }
    } catch (err) {
      showError('An error occurred while updating user status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // Handle delete user
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    
    try {
      const success = await deleteUser(userToDelete.id);
      
      if (success) {
        showSuccess('User deleted successfully');
        setShowDeleteModal(false);
        setUserToDelete(null);
      } else {
        showError('Failed to delete user');
      }
    } catch (err) {
      showError('An error occurred while deleting user');
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
          <h1 className="text-2xl font-bold text-default-900">User Management</h1>
          <p className="text-default-600">Manage platform users and their permissions</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Users"
          value={stats?.total ?? null}
          loading={statsLoading}
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Active Users"
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
          title="Customers"
          value={stats?.customers ?? null}
          loading={statsLoading}
          color="secondary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Providers"
          value={stats?.providers ?? null}
          loading={statsLoading}
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
            placeholder="Search users by name or email..."
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <UserFilters
            filters={filters}
            onChange={handleFiltersChange}
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
            <span className="text-danger-700 font-medium">Error loading users</span>
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

      {/* Users Grid */}
      {!loading && !error && (
        <>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-default-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="text-lg font-medium text-default-600 mb-2">No users found</h3>
              <p className="text-default-500">
                {filters.search || filters.userType || filters.isActive !== undefined
                  ? 'Try adjusting your search or filters'
                  : 'No users have been registered yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {users.map((user) => (
                <div key={user.id} className="relative">
                  {updatingStatus === user.id && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Spinner size="sm" color="primary" />
                    </div>
                  )}
                  <UserCard
                    user={user}
                    onView={handleViewUser}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDeleteUser}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {users.length > 0 && (
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

      {/* User Detail Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
      />

      {/* Status Change Confirmation Modal */}
      <ConfirmationModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setUserToChangeStatus(null);
        }}
        onConfirm={confirmStatusChange}
        title={`${userToChangeStatus?.isActive ? 'Activate' : 'Deactivate'} User`}
        message={`Are you sure you want to ${userToChangeStatus?.isActive ? 'activate' : 'deactivate'} "${userToChangeStatus?.user.full_name}"?`}
        confirmText={userToChangeStatus?.isActive ? 'Activate' : 'Deactivate'}
        confirmColor={userToChangeStatus?.isActive ? 'success' : 'warning'}
        isLoading={!!updatingStatus}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${userToDelete?.full_name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="danger"
        isLoading={deleting}
      />
    </div>
  );
}

export default UsersPage;