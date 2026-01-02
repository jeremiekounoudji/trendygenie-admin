import { DataCard, type DataCardAction } from '../../common/DataCard';
import type { Transaction } from '../../../types/transaction';
import { TRANSACTION_STATUS_LABELS, TRANSACTION_STATUS_COLORS, PAYMENT_PROVIDER_LABELS } from '../../../constants/status';

interface TransactionCardProps {
  transaction: Transaction;
  onView: (transaction: Transaction) => void;
}

export function TransactionCard({ transaction, onView }: TransactionCardProps) {
  const actions: DataCardAction[] = [
    {
      key: 'view',
      label: 'View Details',
      color: 'primary',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
  ];

  const handleAction = (action: string, transaction: Transaction) => {
    switch (action) {
      case 'view':
        onView(transaction);
        break;
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const metadata = [
    { label: 'Order ID', value: transaction.order_id },
    { label: 'Customer', value: transaction.customer?.full_name || 'Unknown' },
    { label: 'Business', value: transaction.business?.name || 'N/A' },
    { label: 'Amount', value: formatAmount(transaction.amount, transaction.currency) },
    { label: 'Payment Method', value: transaction.payment_method },
    { label: 'Provider', value: PAYMENT_PROVIDER_LABELS[transaction.payment_provider] },
    { label: 'Fee', value: formatAmount(transaction.transaction_fee, transaction.currency) },
    { label: 'Created', value: new Date(transaction.created_at).toLocaleDateString() },
  ];

  return (
    <DataCard
      item={transaction}
      title={`Transaction #${transaction.id.slice(-8)}`}
      subtitle={transaction.description || 'No description'}
      status={{
        label: TRANSACTION_STATUS_LABELS[transaction.status],
        color: TRANSACTION_STATUS_COLORS[transaction.status] as any,
      }}
      metadata={metadata}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default TransactionCard;