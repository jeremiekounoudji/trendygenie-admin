import { DetailModal, DetailSection, DetailRow } from '../../common/DetailModal';
import { Chip, Image, Button } from '@heroui/react';
import type { Company } from '../../../types/company';
import { COMPANY_STATUS_LABELS, COMPANY_STATUS_COLORS } from '../../../constants/status';

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
}

export function CompanyDetailModal({ isOpen, onClose, company }: CompanyDetailModalProps) {
  if (!company) return null;

  const handleImageView = (imageUrl: string) => {
    // Open image in new tab for better viewing
    window.open(imageUrl, '_blank');
  };

  return (
    <DetailModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Company Details: ${company.name}`}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <DetailSection title="Basic Information">
          <DetailRow label="Company Name" value={company.name} />
          <DetailRow label="Registration Number" value={company.registration_number} />
          <DetailRow 
            label="Status" 
            value={
              <Chip 
                size="sm" 
                color={COMPANY_STATUS_COLORS[company.status] as any}
                variant="flat"
              >
                {COMPANY_STATUS_LABELS[company.status]}
              </Chip>
            } 
          />
          <DetailRow label="Category" value={company.category?.name || 'Uncategorized'} />
          <DetailRow label="Description" value={company.description} />
          <DetailRow label="Website" value={company.website} />
          <DetailRow 
            label="Verified" 
            value={
              <Chip 
                size="sm" 
                color={company.is_verified ? 'success' : 'danger'}
                variant="flat"
              >
                {company.is_verified ? 'Verified' : 'Not Verified'}
              </Chip>
            } 
          />
        </DetailSection>

        {/* Owner Information */}
        <DetailSection title="Owner Information">
          <DetailRow label="Owner Name" value={company.owner?.full_name || 'Unknown'} />
          <DetailRow label="Owner Email" value={company.owner?.email || 'Unknown'} />
          <DetailRow label="Owner Phone" value={company.owner?.phone_number} />
          <DetailRow 
            label="Owner Type" 
            value={company.owner?.user_type ? company.owner.user_type.charAt(0).toUpperCase() + company.owner.user_type.slice(1) : 'Unknown'} 
          />
        </DetailSection>

        {/* Contact Information */}
        <DetailSection title="Contact Information">
          <DetailRow label="Email" value={company.email} />
          <DetailRow label="Phone" value={company.phone} />
          <DetailRow label="Address" value={company.address} />
          <DetailRow label="City" value={company.city} />
          <DetailRow label="Country" value={company.country} />
          <DetailRow label="Postal Code" value={company.postal_code} />
          {(company.latitude && company.longitude) && (
            <DetailRow 
              label="Coordinates" 
              value={`${company.latitude.toFixed(6)}, ${company.longitude.toFixed(6)}`} 
            />
          )}
        </DetailSection>

        {/* Verification Documents */}
        <DetailSection title="Verification Documents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Company Logo */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-default-700">Company Logo</h5>
              {company.company_logo ? (
                <div className="relative">
                  <Image
                    src={company.company_logo}
                    alt="Company Logo"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageView(company.company_logo!)}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageView(company.company_logo!)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="w-full h-32 bg-default-100 rounded-lg flex items-center justify-center">
                  <span className="text-default-400">No logo uploaded</span>
                </div>
              )}
            </div>

            {/* Owner ID Image */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-default-700">Owner ID Document</h5>
              {company.owner_id_image ? (
                <div className="relative">
                  <Image
                    src={company.owner_id_image}
                    alt="Owner ID"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageView(company.owner_id_image!)}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageView(company.owner_id_image!)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="w-full h-32 bg-default-100 rounded-lg flex items-center justify-center">
                  <span className="text-default-400">No ID document</span>
                </div>
              )}
            </div>

            {/* Selfie Image */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-default-700">Owner Selfie</h5>
              {company.selfie_image ? (
                <div className="relative">
                  <Image
                    src={company.selfie_image}
                    alt="Owner Selfie"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => handleImageView(company.selfie_image!)}
                  />
                  <Button
                    size="sm"
                    variant="flat"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageView(company.selfie_image!)}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </Button>
                </div>
              ) : (
                <div className="w-full h-32 bg-default-100 rounded-lg flex items-center justify-center">
                  <span className="text-default-400">No selfie uploaded</span>
                </div>
              )}
            </div>
          </div>
        </DetailSection>

        {/* Statistics */}
        <DetailSection title="Statistics">
          <DetailRow label="Total Orders" value={company.total_orders} />
          <DetailRow 
            label="Rating" 
            value={company.rating > 0 ? `${company.rating.toFixed(1)} / 5.0` : 'No rating'} 
          />
          <DetailRow label="Review Count" value={company.review_count} />
        </DetailSection>

        {/* Timestamps */}
        <DetailSection title="Timeline">
          <DetailRow 
            label="Created" 
            value={new Date(company.created_at).toLocaleString()} 
          />
          <DetailRow 
            label="Last Updated" 
            value={new Date(company.updated_at).toLocaleString()} 
          />
          {company.approved_at && (
            <DetailRow 
              label="Approved" 
              value={new Date(company.approved_at).toLocaleString()} 
            />
          )}
        </DetailSection>
      </div>
    </DetailModal>
  );
}

export default CompanyDetailModal;