import { Chip } from '@heroui/react';
import type { LegalPage, LegalPageType } from '../../../types/legalPage';
import { DataCard, type DataCardAction } from '../../common/DataCard';

interface LegalPageCardProps {
  legalPage: LegalPage;
  onView: (legalPage: LegalPage) => void;
  onEdit: (legalPage: LegalPage) => void;
  onDelete: (legalPage: LegalPage) => void;
}

const getPageTypeColor = (pageType: LegalPageType): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  switch (pageType) {
    case 'terms':
      return 'primary';
    case 'privacy':
      return 'success';
    case 'refund':
      return 'warning';
    case 'cookie':
      return 'secondary';
    case 'other':
      return 'default';
    default:
      return 'default';
  }
};

const getStatusColor = (isActive: boolean): 'success' | 'danger' => {
  return isActive ? 'success' : 'danger';
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatPageType = (pageType: LegalPageType): string => {
  switch (pageType) {
    case 'terms':
      return 'Terms of Service';
    case 'privacy':
      return 'Privacy Policy';
    case 'refund':
      return 'Refund Policy';
    case 'cookie':
      return 'Cookie Policy';
    case 'other':
      return 'Other';
    default:
      return 'Unknown';
  }
};

const truncateContent = (content: string, maxLength: number = 100): string => {
  // Strip HTML tags for preview
  const textContent = content.replace(/<[^>]*>/g, '');
  if (textContent.length <= maxLength) return textContent;
  return textContent.substring(0, maxLength) + '...';
};

export function LegalPageCard({ legalPage, onView, onEdit, onDelete }: LegalPageCardProps) {
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
    {
      key: 'edit',
      label: 'Edit',
      color: 'warning',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      key: 'delete',
      label: 'Delete',
      color: 'danger',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
    },
  ];

  const handleAction = (action: string, legalPage: LegalPage) => {
    switch (action) {
      case 'view':
        onView(legalPage);
        break;
      case 'edit':
        onEdit(legalPage);
        break;
      case 'delete':
        onDelete(legalPage);
        break;
    }
  };

  const metadata = [
    { label: 'Slug', value: legalPage.slug },
    { label: 'Type', value: (
      <Chip size="sm" color={getPageTypeColor(legalPage.page_type)} variant="flat">
        {formatPageType(legalPage.page_type)}
      </Chip>
    )},
    { label: 'Created', value: formatDate(legalPage.created_at) },
    { label: 'Updated', value: formatDate(legalPage.updated_at) },
    { label: 'Content Preview', value: truncateContent(legalPage.content) },
  ];

  return (
    <DataCard
      item={legalPage}
      title={legalPage.title}
      subtitle={`/${legalPage.slug}`}
      status={{
        label: legalPage.is_active ? 'Active' : 'Inactive',
        color: getStatusColor(legalPage.is_active),
      }}
      metadata={metadata}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default LegalPageCard;