import { DetailModal, DetailSection, DetailRow } from '../../common/DetailModal';
import { Chip } from '@heroui/react';
import type { Business, BusinessHour, ContactPhone } from '../../../types/business';
import { BUSINESS_STATUS_LABELS, BUSINESS_STATUS_COLORS } from '../../../constants/status';

interface BusinessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business | null;
}

export function BusinessDetailModal({ isOpen, onClose, business }: BusinessDetailModalProps) {
  if (!business) return null;

  const formatBusinessHours = (hours: BusinessHour[]) => {
    if (!hours || hours.length === 0) {
      return 'No hours specified';
    }

    return (
      <div className="space-y-1">
        {hours.map((hour, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="font-medium capitalize">{hour.day}</span>
            <span className="text-default-600">
              {hour.is_closed ? 'Closed' : `${hour.open} - ${hour.close}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatContactPhones = (phones: ContactPhone[]) => {
    if (!phones || phones.length === 0) {
      return 'No phone numbers';
    }

    return (
      <div className="space-y-1">
        {phones.map((phone, index) => (
          <div key={index} className="text-sm">
            <span className="font-medium">{phone.number}</span>
            {phone.label && (
              <span className="text-default-500 ml-2">({phone.label})</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Business Details: ${business.name}`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <DetailSection title="Basic Information">
          <DetailRow label="Business Name" value={business.name} />
          <DetailRow label="Description" value={business.description} />
          <DetailRow 
            label="Status" 
            value={
              <Chip 
                size="sm" 
                color={BUSINESS_STATUS_COLORS[business.status] as any}
                variant="flat"
              >
                {BUSINESS_STATUS_LABELS[business.status]}
              </Chip>
            } 
          />
          <DetailRow label="Category" value={business.category?.name || 'Uncategorized'} />
          <DetailRow label="Subcategory" value={business.subcategory?.name} />
          <DetailRow label="Currency" value={business.currency} />
          <DetailRow 
            label="Rating" 
            value={business.rating > 0 ? `${business.rating.toFixed(1)} / 5.0 ⭐` : 'No rating'} 
          />
        </DetailSection>

        {/* Company Information */}
        <DetailSection title="Company Information">
          <DetailRow label="Company Name" value={business.company?.name || 'Unknown'} />
          <DetailRow label="Company Status" value={business.company?.status ? BUSINESS_STATUS_LABELS[business.company.status as keyof typeof BUSINESS_STATUS_LABELS] || business.company.status : 'Unknown'} />
          <DetailRow label="Company Registration" value={business.company?.registration_number} />
          <DetailRow label="Company Owner" value={business.company?.owner?.full_name} />
        </DetailSection>

        {/* Contact Information */}
        <DetailSection title="Contact Information">
          <DetailRow label="Email" value={business.contact_email} />
          <DetailRow 
            label="Phone Numbers" 
            value={formatContactPhones(business.contact_phone)} 
          />
          <DetailRow label="Address" value={business.address} />
          {(business.latitude && business.longitude) && (
            <DetailRow 
              label="Coordinates" 
              value={`${business.latitude.toFixed(6)}, ${business.longitude.toFixed(6)}`} 
            />
          )}
        </DetailSection>

        {/* Business Hours */}
        <DetailSection title="Business Hours">
          <DetailRow 
            label="Operating Hours" 
            value={formatBusinessHours(business.business_hours)} 
          />
        </DetailSection>

        {/* Logo */}
        {business.logo_url && (
          <DetailSection title="Business Logo">
            <div className="flex justify-center">
              <img
                src={business.logo_url}
                alt={`${business.name} logo`}
                className="max-w-xs max-h-32 object-contain rounded-lg border border-divider"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </DetailSection>
        )}

        {/* Timestamps */}
        <DetailSection title="Timeline">
          <DetailRow 
            label="Created" 
            value={new Date(business.created_at).toLocaleString()} 
          />
          <DetailRow 
            label="Last Updated" 
            value={new Date(business.updated_at).toLocaleString()} 
          />
        </DetailSection>
      </div>
    </DetailModal>
  );
}

export default BusinessDetailModal;