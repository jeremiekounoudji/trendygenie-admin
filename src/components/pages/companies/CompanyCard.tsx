import { DataCard, type DataCardAction } from '../../common/DataCard';
import type { Company } from '../../../types/company';
import { COMPANY_STATUS_LABELS, COMPANY_STATUS_COLORS } from '../../../constants/status';

interface CompanyCardProps {
  company: Company;
  onView: (company: Company) => void;
  onStatusChange: (company: Company, status: string) => void;
  onDelete: (company: Company) => void;
}

export function CompanyCard({ company, onView, onStatusChange, onDelete }: CompanyCardProps) {
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
  if (company.status === 'pending') {
    actions.push(
      {
        key: 'approve',
        label: 'Approve',
        color: 'success',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      },
      {
        key: 'reject',
        label: 'Reject',
        color: 'danger',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
      }
    );
  } else if (company.status === 'approved') {
    actions.push({
      key: 'suspend',
      label: 'Suspend',
      color: 'warning',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ),
    });
  } else if (company.status === 'suspended' || company.status === 'rejected') {
    actions.push({
      key: 'approve',
      label: 'Approve',
      color: 'success',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    });
  }

  // Add delete action
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

  const handleAction = (action: string, company: Company) => {
    switch (action) {
      case 'view':
        onView(company);
        break;
      case 'approve':
        onStatusChange(company, 'approved');
        break;
      case 'reject':
        onStatusChange(company, 'rejected');
        break;
      case 'suspend':
        onStatusChange(company, 'suspended');
        break;
      case 'delete':
        onDelete(company);
        break;
    }
  };

  const metadata = [
    { label: 'Owner', value: company.owner?.full_name || 'Unknown' },
    { label: 'Category', value: company.category?.name || 'Uncategorized' },
    { label: 'Registration', value: company.registration_number },
    { label: 'Rating', value: company.rating > 0 ? `${company.rating.toFixed(1)} (${company.review_count} reviews)` : 'No reviews' },
    { label: 'Orders', value: company.total_orders },
    { label: 'Created', value: new Date(company.created_at).toLocaleDateString() },
  ];

  if (company.approved_at) {
    metadata.push({
      label: 'Approved',
      value: new Date(company.approved_at).toLocaleDateString(),
    });
  }

  return (
    <DataCard
      item={company}
      title={company.name}
      subtitle={company.email || company.phone || company.address}
      status={{
        label: COMPANY_STATUS_LABELS[company.status],
        color: COMPANY_STATUS_COLORS[company.status] as any,
      }}
      metadata={metadata}
      image={company.company_logo}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default CompanyCard;