import { DetailModal, DetailSection, DetailRow } from '../../common/DetailModal';
import { Chip, Link } from '@heroui/react';
import type { Transaction } from '../../../types/transaction';
import { TRANSACTION_STATUS_LABELS, TRANSACTION_STATUS_COLORS, PAYMENT_PROVIDER_LABELS } from '../../../constants/status';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  if (!transaction) return null;

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatMetadata = (metadata: Record<string, unknown> | null) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return 'No metadata';
    }

    return (
      <div className="space-y-2">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start text-sm">
            <span className="font-medium capitalize text-default-700">
              {key.replace(/_/g, ' ')}:
            </span>
            <span className="text-default-600 text-right max-w-xs wrap-break-word">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Transaction Details: #${transaction.id.slice(-8)}`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Transaction Information */}
        <DetailSection title="Transaction Information">
          <DetailRow label="Transaction ID" value={transaction.id} />
          <DetailRow label="Order ID" value={transaction.order_id} />
          <DetailRow 
            label="Status" 
            value={
              <Chip 
                size="sm" 
                color={TRANSACTION_STATUS_COLORS[transaction.status] as any}
                variant="flat"
              >
                {TRANSACTION_STATUS_LABELS[transaction.status]}
              </Chip>
            } 
          />
          <DetailRow label="Description" value={transaction.description || 'No description'} />
          <DetailRow label="Provider Payment ID" value={transaction.provider_payment_id || 'N/A'} />
        </DetailSection>

        {/* Payment Information */}
        <DetailSection title="Payment Information">
          <DetailRow 
            label="Amount" 
            value={
              <span className="font-semibold text-lg">
                {formatAmount(transaction.amount, transaction.currency)}
              </span>
            } 
          />
          <DetailRow 
            label="Transaction Fee" 
            value={formatAmount(transaction.transaction_fee, transaction.currency)} 
          />
          <DetailRow label="Currency" value={transaction.currency.toUpperCase()} />
          <DetailRow label="Payment Method" value={transaction.payment_method} />
          <DetailRow 
            label="Payment Provider" 
            value={PAYMENT_PROVIDER_LABELS[transaction.payment_provider]} 
          />
          {transaction.receipt_url && (
            <DetailRow 
              label="Receipt" 
              value={
                <Link 
                  href={transaction.receipt_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-600"
                >
                  View Receipt
                </Link>
              } 
            />
          )}
        </DetailSection>

        {/* Customer Information */}
        <DetailSection title="Customer Information">
          <DetailRow label="Customer Name" value={transaction.customer?.full_name || 'Unknown'} />
          <DetailRow label="Customer Email" value={transaction.customer?.email || 'N/A'} />
          <DetailRow label="Customer ID" value={transaction.customer_id} />
        </DetailSection>

        {/* Business Information */}
        {transaction.business && (
          <DetailSection title="Business Information">
            <DetailRow label="Business Name" value={transaction.business.name} />
            <DetailRow label="Business Email" value={transaction.business.contact_email} />
            <DetailRow label="Business ID" value={transaction.business_id || 'N/A'} />
            <DetailRow label="Company ID" value={transaction.company_id || 'N/A'} />
          </DetailSection>
        )}

        {/* Order Information */}
        {transaction.order && (
          <DetailSection title="Order Information">
            <DetailRow label="Order Number" value={transaction.order.order_number} />
            <DetailRow label="Order Status" value={transaction.order.status} />
            <DetailRow 
              label="Order Total" 
              value={formatAmount(transaction.order.total_amount, transaction.currency)} 
            />
            <DetailRow 
              label="Order Created" 
              value={new Date(transaction.order.created_at).toLocaleString()} 
            />
          </DetailSection>
        )}

        {/* Metadata */}
        {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
          <DetailSection title="Metadata">
            <DetailRow 
              label="Additional Data" 
              value={formatMetadata(transaction.metadata)} 
            />
          </DetailSection>
        )}

        {/* Timestamps */}
        <DetailSection title="Timeline">
          <DetailRow 
            label="Created" 
            value={new Date(transaction.created_at).toLocaleString()} 
          />
          <DetailRow 
            label="Last Updated" 
            value={new Date(transaction.updated_at).toLocaleString()} 
          />
        </DetailSection>
      </div>
    </DetailModal>
  );
}

export default TransactionDetailModal;