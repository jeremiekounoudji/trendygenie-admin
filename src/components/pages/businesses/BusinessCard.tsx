import { DataCard, type DataCardAction } from '../../common/DataCard';
import type { Business } from '../../../types/business';
import { BUSINESS_STATUS_LABELS, BUSINESS_STATUS_COLORS } from '../../../constants/status';

interface BusinessCardProps {
  business: Business;
  onView: (business: Business) => void;
  onStatusChange: (business: Business, status: string) => void;
  onDelete: (business: Business) => void;
}

export function BusinessCard({ business, onView, onStatusChange, onDelete }: BusinessCardProps) {
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

  // Add status change actions based on current status
  if (business.status === 'pending') {
    actions.push(
      {
        key: 'active',
        label: 'Activate',
        color: 'success',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      {
        key: 'rejected',
        label: 'Reject',
        color: 'danger',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      }
    );
  } else if (business.status === 'active') {
    actions.push({
      key: 'suspended',
      label: 'Suspend',
      color: 'warning',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
    });
  } else if (business.status === 'suspended' || business.status === 'rejected') {
    actions.push({
      key: 'active',
      label: 'Activate',
      color: 'success',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    });
  }

  // Add delete action (only for non-deleted businesses)
  if (business.status !== 'deleted') {
    actions.push({
      key: 'delete',
      label: 'Delete',
      color: 'danger',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    });
  }

  const handleAction = (action: string, business: Business) => {
    switch (action) {
      case 'view':
        onView(business);
        break;
      case 'active':
        onStatusChange(business, 'active');
        break;
      case 'rejected':
        onStatusChange(business, 'rejected');
        break;
      case 'suspended':
        onStatusChange(business, 'suspended');
        break;
      case 'delete':
        onDelete(business);
        break;
    }
  };

  const metadata = [
    { label: 'Company', value: business.company?.name || 'Unknown' },
    { label: 'Category', value: business.category?.name || 'Uncategorized' },
    { label: 'Email', value: business.contact_email },
    { label: 'Phone', value: business.contact_phone?.length > 0 ? business.contact_phone[0].number : 'No phone' },
    { label: 'Rating', value: business.rating > 0 ? `${business.rating.toFixed(1)} ⭐` : 'No rating' },
    { label: 'Currency', value: business.currency },
    { label: 'Created', value: new Date(business.created_at).toLocaleDateString() },
  ];

  return (
    <DataCard
      item={business}
      title={business.name}
      subtitle={business.address}
      status={{
        label: BUSINESS_STATUS_LABELS[business.status],
        color: BUSINESS_STATUS_COLORS[business.status] as any,
      }}
      metadata={metadata}
      image={business.logo_url}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default BusinessCard;