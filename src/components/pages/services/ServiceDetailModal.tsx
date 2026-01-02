import { DetailModal, DetailSection, DetailRow } from '../../common/DetailModal';
import { Chip, Image } from '@heroui/react';
import type { Service } from '../../../types/service';
import { SERVICE_STATUS_LABELS, SERVICE_STATUS_COLORS } from '../../../constants/status';

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export function ServiceDetailModal({ isOpen, onClose, service }: ServiceDetailModalProps) {
  if (!service) return null;

  const formatPrice = () => {
    const hasPromo = service.promotional_price > 0 && service.promotional_price < service.normal_price;
    if (hasPromo) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-danger font-semibold text-lg">{service.currency} {service.promotional_price.toFixed(2)}</span>
          <span className="text-default-400 line-through">{service.currency} {service.normal_price.toFixed(2)}</span>
          <Chip size="sm" color="danger" variant="flat">PROMO</Chip>
        </div>
      );
    }
    return `${service.currency} ${service.normal_price.toFixed(2)}`;
  };

  const formatCharacteristics = (characteristics: Record<string, unknown> | null) => {
    if (!characteristics || Object.keys(characteristics).length === 0) {
      return 'No characteristics specified';
    }

    return (
      <div className="space-y-2">
        {Object.entries(characteristics).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
            <span className="text-default-600">
              {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const formatMetadata = (metadata: Record<string, unknown> | null) => {
    if (!metadata || Object.keys(metadata).length === 0) {
      return 'No metadata available';
    }

    return (
      <div className="space-y-2">
        {Object.entries(metadata).map(([key, value]) => (
          <div key={key} className="flex justify-between items-start text-sm">
            <span className="font-medium capitalize">{key.replace(/_/g, ' ')}</span>
            <span className="text-default-600 text-right max-w-xs">
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
      title={`Service Details: ${service.title}`}
      size="3xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <DetailSection title="Basic Information">
          <DetailRow label="Service Title" value={service.title} />
          <DetailRow label="Description" value={service.description || 'No description'} />
          <DetailRow 
            label="Status" 
            value={
              <Chip 
                size="sm" 
                color={SERVICE_STATUS_COLORS[service.status] as any}
                variant="flat"
              >
                {SERVICE_STATUS_LABELS[service.status]}
              </Chip>
            } 
          />
          <DetailRow label="Category" value={service.category?.name || 'Uncategorized'} />
          <DetailRow label="Price" value={formatPrice()} />
          <DetailRow label="Currency" value={service.currency} />
          <DetailRow 
            label="Active" 
            value={
              <Chip 
                size="sm" 
                color={service.is_active ? 'success' : 'danger'}
                variant="flat"
              >
                {service.is_active ? 'Active' : 'Inactive'}
              </Chip>
            } 
          />
        </DetailSection>

        {/* Business & Provider Information */}
        <DetailSection title="Business & Provider">
          <DetailRow label="Business" value={service.business?.name || 'No business assigned'} />
          <DetailRow label="Business Status" value={service.business?.status ? SERVICE_STATUS_LABELS[service.business.status as keyof typeof SERVICE_STATUS_LABELS] || service.business.status : 'Unknown'} />
          <DetailRow label="Provider" value={service.provider?.full_name || 'Unknown provider'} />
          <DetailRow label="Provider Email" value={service.provider?.email} />
          <DetailRow label="Created By" value={service.created_by || 'System'} />
        </DetailSection>

        {/* Property Details (if applicable) */}
        {(service.bedroom_count || service.bathroom_count || service.has_kitchen !== null || service.property_type) && (
          <DetailSection title="Property Details">
            {service.bedroom_count && (
              <DetailRow label="Bedrooms" value={service.bedroom_count.toString()} />
            )}
            {service.bathroom_count && (
              <DetailRow label="Bathrooms" value={service.bathroom_count.toString()} />
            )}
            {service.has_kitchen !== null && (
              <DetailRow label="Has Kitchen" value={service.has_kitchen ? 'Yes' : 'No'} />
            )}
            {service.property_type && (
              <DetailRow label="Property Type" value={service.property_type} />
            )}
          </DetailSection>
        )}

        {/* Food Service Details (if applicable) */}
        {(service.cuisine || service.is_delivery_available !== null || service.food_category) && (
          <DetailSection title="Food Service Details">
            {service.cuisine && (
              <DetailRow label="Cuisine" value={service.cuisine} />
            )}
            {service.is_delivery_available !== null && (
              <DetailRow label="Delivery Available" value={service.is_delivery_available ? 'Yes' : 'No'} />
            )}
            {service.food_category && (
              <DetailRow label="Food Category" value={service.food_category} />
            )}
          </DetailSection>
        )}

        {/* Service Images */}
        {service.images && service.images.length > 0 && (
          <DetailSection title="Service Images">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {service.images.map((imageUrl, index) => (
                <div key={index} className="aspect-square">
                  <Image
                    src={imageUrl}
                    alt={`${service.title} image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    fallbackSrc="/placeholder-image.png"
                  />
                </div>
              ))}
            </div>
          </DetailSection>
        )}

        {/* Characteristics */}
        {service.caracteristics && (
          <DetailSection title="Service Characteristics">
            <DetailRow 
              label="Characteristics" 
              value={formatCharacteristics(service.caracteristics)} 
            />
          </DetailSection>
        )}

        {/* Performance Metrics */}
        <DetailSection title="Performance Metrics">
          <DetailRow 
            label="Rating" 
            value={service.rating > 0 ? `${service.rating.toFixed(1)} / 5.0 ⭐` : 'No rating'} 
          />
          <DetailRow label="View Count" value={service.view_count.toLocaleString()} />
          <DetailRow label="Distance" value={`${service.distance.toFixed(2)} km`} />
        </DetailSection>

        {/* Metadata */}
        {service.metadata && (
          <DetailSection title="Additional Metadata">
            <DetailRow 
              label="Metadata" 
              value={formatMetadata(service.metadata)} 
            />
          </DetailSection>
        )}

        {/* Timestamps */}
        <DetailSection title="Timeline">
          <DetailRow 
            label="Created" 
            value={new Date(service.created_at).toLocaleString()} 
          />
          <DetailRow 
            label="Last Updated" 
            value={new Date(service.updated_at).toLocaleString()} 
          />
        </DetailSection>
      </div>
    </DetailModal>
  );
}

export default ServiceDetailModal;