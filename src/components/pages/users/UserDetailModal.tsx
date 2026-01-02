import { Chip, Avatar } from '@heroui/react';
import type { User, UserType } from '../../../types/user';
import { DetailModal, DetailSection, DetailRow } from '../../common/DetailModal';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
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
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatUserType = (userType: UserType): string => {
  return userType.charAt(0).toUpperCase() + userType.slice(1);
};

export function UserDetailModal({ isOpen, onClose, user }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title="User Details"
      size="xl"
    >
      <div className="space-y-6">
        {/* User Header */}
        <div className="flex items-center gap-4 p-4 bg-default-50 rounded-lg">
          <Avatar
            src={user.profile_image || undefined}
            name={user.full_name}
            size="lg"
            className="shrink-0"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-default-900">{user.full_name}</h3>
            <p className="text-default-600">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <Chip
                size="sm"
                color={getUserTypeColor(user.user_type)}
                variant="flat"
              >
                {formatUserType(user.user_type)}
              </Chip>
              <Chip
                size="sm"
                color={getStatusColor(user.is_active)}
                variant="flat"
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </Chip>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <DetailSection title="Basic Information">
          <DetailRow label="Full Name" value={user.full_name} />
          <DetailRow label="Email" value={user.email} />
          <DetailRow label="Phone Number" value={user.phone_number} />
          <DetailRow 
            label="User Type" 
            value={
              <Chip
                size="sm"
                color={getUserTypeColor(user.user_type)}
                variant="flat"
              >
                {formatUserType(user.user_type)}
              </Chip>
            } 
          />
        </DetailSection>

        {/* Account Status */}
        <DetailSection title="Account Status">
          <DetailRow 
            label="Status" 
            value={
              <Chip
                size="sm"
                color={getStatusColor(user.is_active)}
                variant="flat"
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </Chip>
            } 
          />
          <DetailRow 
            label="Email Verified" 
            value={
              <Chip
                size="sm"
                color={user.is_email_verified ? 'success' : 'warning'}
                variant="flat"
              >
                {user.is_email_verified ? 'Verified' : 'Not Verified'}
              </Chip>
            } 
          />
          <DetailRow 
            label="Phone Verified" 
            value={
              <Chip
                size="sm"
                color={user.is_phone_verified ? 'success' : 'warning'}
                variant="flat"
              >
                {user.is_phone_verified ? 'Verified' : 'Not Verified'}
              </Chip>
            } 
          />
        </DetailSection>

        {/* Profile Information */}
        <DetailSection title="Profile Information">
          <DetailRow 
            label="Profile Image" 
            value={
              user.profile_image ? (
                <div className="flex items-center gap-2">
                  <Avatar
                    src={user.profile_image}
                    name={user.full_name}
                    size="sm"
                  />
                  <span className="text-xs text-default-500">Image uploaded</span>
                </div>
              ) : (
                <span className="text-default-400">No image uploaded</span>
              )
            } 
          />
        </DetailSection>

        {/* Timestamps */}
        <DetailSection title="Account History">
          <DetailRow label="Created At" value={formatDate(user.created_at)} />
          <DetailRow label="Last Updated" value={formatDate(user.updated_at)} />
          <DetailRow label="User ID" value={user.id} />
        </DetailSection>
      </div>
    </DetailModal>
  );
}

export default UserDetailModal;