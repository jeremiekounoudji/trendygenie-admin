import { useState } from 'react';
import { Button, Spinner } from '@heroui/react';
import { useTransactions } from '../hooks/useTransactions';
import type { Transaction, TransactionFilters as TransactionFiltersType } from '../types/transaction';
import { SummaryCard } from '../components/common/SummaryCard';
import { SearchInput } from '../components/common/SearchInput';
import { Pagination } from '../components/common/Pagination';
import { SortControls, type SortOption } from '../components/common/SortControls';
import { TransactionCard, TransactionDetailModal } from '../components/pages/transactions';
import { TransactionFilters } from '../components/pages/transactions/TransactionFilters';

export function TransactionsPage() {
  const {
    transactions,
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
    getTransactionById,
    refetch,
  } = useTransactions();

  // Modal states
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingTransaction, setLoadingTransaction] = useState(false);

  // Sort options for transactions
  const sortOptions: SortOption[] = [
    { label: 'Transaction Date', value: 'created_at' },
    { label: 'Amount', value: 'amount' },
    { label: 'Status', value: 'status' },
    { label: 'Payment Method', value: 'payment_method' },
    { label: 'Payment Provider', value: 'payment_provider' },
    { label: 'Updated Date', value: 'updated_at' },
  ];

  // Handle search
  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  // Handle filters change
  const handleFiltersChange = (newFilters: TransactionFiltersType) => {
    setFilters(newFilters);
  };

  // Handle sort change
  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  // Handle view transaction
  const handleViewTransaction = async (transaction: Transaction) => {
    setLoadingTransaction(true);
    
    try {
      // Get full transaction details with joined data
      const fullTransaction = await getTransactionById(transaction.id);
      
      if (fullTransaction) {
        setSelectedTransaction(fullTransaction);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error('Failed to load transaction details:', err);
      // Fallback to the transaction data we already have
      setSelectedTransaction(transaction);
      setShowDetailModal(true);
    } finally {
      setLoadingTransaction(false);
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
          <h1 className="text-2xl font-bold text-default-900">Transaction Management</h1>
          <p className="text-default-600">Monitor platform transactions and payment activity</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <SummaryCard
          title="Total Transactions"
          value={stats?.total ?? null}
          loading={statsLoading}
          color="danger"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Total Revenue"
          value={stats?.totalRevenue ?? null}
          loading={statsLoading}
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Pending"
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
          title="Completed"
          value={stats?.completed ?? null}
          loading={statsLoading}
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Failed"
          value={stats?.failed ?? null}
          loading={statsLoading}
          color="secondary"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        
        <SummaryCard
          title="Refunded"
          value={stats?.refunded ?? null}
          loading={statsLoading}
          color="default"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
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
            placeholder="Search transactions by order ID, description, or payment ID..."
            className="w-full"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
          <TransactionFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
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
            <span className="text-danger-700 font-medium">Error loading transactions</span>
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

      {/* Transactions Grid */}
      {!loading && !error && (
        <>
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-default-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-default-600 mb-2">No transactions found</h3>
              <p className="text-default-500">
                {filters.search || filters.status || filters.paymentProvider || filters.dateFrom || filters.dateTo
                  ? 'Try adjusting your search or filters'
                  : 'No transactions have been processed yet'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="relative">
                  {loadingTransaction && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-10">
                      <Spinner size="sm" color="primary" />
                    </div>
                  )}
                  <TransactionCard
                    transaction={transaction}
                    onView={handleViewTransaction}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
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

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
}

export default TransactionsPage;