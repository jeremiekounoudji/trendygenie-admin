import { DataCard, type DataCardAction } from '../../common/DataCard';
import type { Service } from '../../../types/service';
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from '../../../constants/status';

interface ServiceCardProps {
  service: Service;
  onView: (service: Service) => void;
  onStatusChange: (service: Service, status: string) => void;
  onDelete: (service: Service) => void;
}

export function ServiceCard({ service, onView, onStatusChange, onDelete }: ServiceCardProps) {
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
  if (service.status === 'pending') {
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
  } else if (service.status === 'active') {
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
  } else if (service.status === 'suspended' || service.status === 'rejected') {
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
  } else if (service.status === 'requestDeletion') {
    // Provider requested deletion - show prominent delete action
    actions.push(
      {
        key: 'delete',
        label: '🗑️ Confirm Permanent Delete',
        color: 'danger',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        ),
      },
      {
        key: 'active',
        label: 'Reject Deletion & Reactivate',
        color: 'success',
        icon: (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
      }
    );
  }

  // Add delete action (only for non-deleted and non-requestDeletion services)
  if (service.status !== 'deleted' && service.status !== 'requestDeletion') {
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

  const handleAction = (action: string, service: Service) => {
    switch (action) {
      case 'view':
        onView(service);
        break;
      case 'active':
        onStatusChange(service, 'active');
        break;
      case 'rejected':
        onStatusChange(service, 'rejected');
        break;
      case 'suspended':
        onStatusChange(service, 'suspended');
        break;
      case 'delete':
        onDelete(service);
        break;
    }
  };

  // Format price display
  const formatPrice = () => {
    const hasPromo = service.promotional_price > 0 && service.promotional_price < service.normal_price;
    if (hasPromo) {
      return (
        <span className="flex items-center gap-2">
          <span className="text-danger font-semibold">{service.currency} {service.promotional_price.toFixed(2)}</span>
          <span className="text-default-400 line-through text-sm">{service.currency} {service.normal_price.toFixed(2)}</span>
        </span>
      );
    }
    return `${service.currency} ${service.normal_price.toFixed(2)}`;
  };

  const metadata = [
    { label: 'Business', value: service.business?.name || 'No business' },
    { label: 'Category', value: service.category?.name || 'Uncategorized' },
    { label: 'Provider', value: service.provider?.full_name || 'Unknown' },
    { label: 'Price', value: formatPrice() },
    { label: 'Rating', value: service.rating > 0 ? `${service.rating.toFixed(1)} ⭐` : 'No rating' },
    { label: 'Views', value: service.view_count.toLocaleString() },
    { label: 'Active', value: service.is_active ? 'Yes' : 'No' },
    { label: 'Created', value: new Date(service.created_at).toLocaleDateString() },
  ];

  // Use first image as thumbnail
  const thumbnailImage = service.images && service.images.length > 0 ? service.images[0] : undefined;

  return (
    <DataCard
      item={service}
      title={service.title}
      subtitle={service.description || 'No description'}
      status={{
        label: SERVICE_STATUS_LABELS[service.status],
        color: SERVICE_STATUS_COLORS[service.status] as any,
      }}
      metadata={metadata}
      image={thumbnailImage}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default ServiceCard;