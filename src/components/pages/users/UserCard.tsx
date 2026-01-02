import { Chip } from '@heroui/react';
import type { User, UserType } from '../../../types/user';
import { DataCard, type DataCardAction } from '../../common/DataCard';

interface UserCardProps {
  user: User;
  onView: (user: User) => void;
  onStatusChange: (user: User, isActive: boolean) => void;
  onDelete: (user: User) => void;
}

const getUserTypeColor = (userType: UserType): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  switch (userType) {
    case 'admin':
      return 'danger';
    case 'provider':
      return 'primary';
    case 'customer':
      return 'success';
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

export function UserCard({ user, onView, onStatusChange, onDelete }: UserCardProps) {
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
      key: 'toggle-status',
      label: user.is_active ? 'Deactivate' : 'Activate',
      color: user.is_active ? 'warning' : 'success',
      icon: user.is_active ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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

  const handleAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        onView(user);
        break;
      case 'toggle-status':
        onStatusChange(user, !user.is_active);
        break;
      case 'delete':
        onDelete(user);
        break;
    }
  };

  const metadata = [
    { label: 'Email', value: user.email },
    { label: 'Phone', value: user.phone_number },
    { label: 'Type', value: (
      <Chip size="sm" color={getUserTypeColor(user.user_type)} variant="flat">
        {user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1)}
      </Chip>
    )},
    { label: 'Created', value: formatDate(user.created_at) },
    { label: 'Email Verified', value: user.is_email_verified ? 'Yes' : 'No' },
    { label: 'Phone Verified', value: user.is_phone_verified ? 'Yes' : 'No' },
  ];

  return (
    <DataCard
      item={user}
      title={user.full_name}
      subtitle={user.email}
      status={{
        label: user.is_active ? 'Active' : 'Inactive',
        color: getStatusColor(user.is_active),
      }}
      metadata={metadata}
      image={user.profile_image}
      actions={actions}
      onAction={handleAction}
      onClick={onView}
    />
  );
}

export default UserCard;