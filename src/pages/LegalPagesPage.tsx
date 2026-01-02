import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useLegalPages } from '../hooks/useLegalPages';
import type { LegalPage, CreateLegalPageInput, UpdateLegalPageInput } from '../types/legalPage';
import { SearchInput } from '../components/common/SearchInput';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { LegalPageCard, LegalPageModal } from '../components/pages/legal';
import { showSuccess, showError } from '../utils/toast';

export function LegalPagesPage() {
  const {
    legalPages,
    loading,
    error,
    filters,
    setFilters,
    createLegalPage,
    updateLegalPage,
    deleteLegalPage,
    refetch,
  } = useLegalPages();

  // Modal states
  const [selectedLegalPage, setSelectedLegalPage] = useState<LegalPage | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [legalPageToDelete, setLegalPageToDelete] = useState<LegalPage | null>(null);

  // Loading states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  // Handle view legal page (same as edit for now)
  const handleViewLegalPage = (legalPage: LegalPage) => {
    setSelectedLegalPage(legalPage);
    setShowEditModal(true);
  };

  // Handle edit legal page
  const handleEditLegalPage = (legalPage: LegalPage) => {
    setSelectedLegalPage(legalPage);
    setShowEditModal(true);
  };

  // Handle create legal page
  const handleCreateLegalPage = () => {
    setSelectedLegalPage(null);
    setShowCreateModal(true);
  };

  // Handle save (create or update)
  const handleSave = async (data: CreateLegalPageInput | UpdateLegalPageInput) => {
    setSaving(true);
    
    try {
      let result: LegalPage | null = null;
      
      if (selectedLegalPage) {
        // Update existing legal page
        result = await updateLegalPage(selectedLegalPage.id, data as UpdateLegalPageInput);
        if (result) {
          showSuccess('Legal page updated successfully');
          setShowEditModal(false);
        }
      } else {
        // Create new legal page
        result = await createLegalPage(data as CreateLegalPageInput);
        if (result) {
          showSuccess('Legal page created successfully');
          setShowCreateModal(false);
        }
      }
      
      if (!result) {
        showError('Failed to save legal page');
      }
    } catch (err) {
      showError('An error occurred while saving legal page');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete legal page
  const handleDeleteLegalPage = (legalPage: LegalPage) => {
    setLegalPageToDelete(legalPage);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!legalPageToDelete) return;

    setDeleting(true);
    
    try {
      const success = await deleteLegalPage(legalPageToDelete.id);
      
      if (success) {
        showSuccess('Legal page deleted successfully');
        setShowDeleteModal(false);
        setLegalPageToDelete(null);
      } else {
        showError('Failed to delete legal page');
      }
    } catch (err) {
      showError('An error occurred while deleting legal page');
      console.error('Delete error:', err);
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
          <h1 className="text-2xl font-bold text-default-900">Legal Pages Management</h1>
          <p className="text-default-600">Manage legal documents and policies</p>
        </div>
        <div className="flex gap-2">
          <Button
            color="primary"
            onPress={handleCreateLegalPage}
            startContent={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Create Legal Page
          </Button>
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
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Search legal pages by title or slug..."
            className="w-full"
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
            <span className="text-danger-700 font-medium">Error loading legal pages</span>
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

      {/* Legal Pages Grid */}
      {!loading && !error && (
        <>
          {legalPages.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-default-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium text-default-600 mb-2">No legal pages found</h3>
              <p className="text-default-500 mb-4">
                {filters.search
                  ? 'Try adjusting your search terms'
                  : 'Create your first legal page to get started'}
              </p>
              {!filters.search && (
                <Button
                  color="primary"
                  onPress={handleCreateLegalPage}
                  startContent={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  }
                >
                  Create Legal Page
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {legalPages.map((legalPage) => (
                <LegalPageCard
                  key={legalPage.id}
                  legalPage={legalPage}
                  onView={handleViewLegalPage}
                  onEdit={handleEditLegalPage}
                  onDelete={handleDeleteLegalPage}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Legal Page Modal */}
      <LegalPageModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedLegalPage(null);
        }}
        onSave={handleSave}
        loading={saving}
      />

      {/* Edit Legal Page Modal */}
      <LegalPageModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedLegalPage(null);
        }}
        onSave={handleSave}
        legalPage={selectedLegalPage}
        loading={saving}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setLegalPageToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Legal Page"
        message={`Are you sure you want to delete "${legalPageToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="danger"
        loading={deleting}
      />
    </div>
  );
}

export default LegalPagesPage;