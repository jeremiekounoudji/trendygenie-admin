import { Card, CardBody, CardFooter, Button, Chip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Divider } from '@heroui/react';

export interface DataCardAction {
  label: string;
  key: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

interface DataCardProps<T> {
  item: T;
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  metadata?: Array<{ label: string; value: string | number | React.ReactNode | null }>;
  image?: string | null;
  actions?: DataCardAction[];
  onAction?: (action: string, item: T) => void;
  onClick?: (item: T) => void;
}

export function DataCard<T>({
  item,
  title,
  subtitle,
  status,
  metadata = [],
  image,
  actions = [],
  onAction,
  onClick,
}: DataCardProps<T>) {
  const handleAction = (key: string) => {
    onAction?.(key, item);
  };

  // Don't make the card pressable if it has actions to avoid nested buttons
  const isPressable = !!onClick && actions.length === 0;

  return (
    <Card
      isPressable={isPressable}
      onPress={isPressable ? () => onClick?.(item) : undefined}
      className="card-hover shadow-sm hover:shadow-md transition-shadow"
    >
      <CardBody className="p-0">
        {/* Header Section with Image and Title */}
        <div className="flex gap-4 p-4">
          {/* Image/Avatar */}
          {image !== undefined && (
            <div className="shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="w-16 h-16 rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {title.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Title and Status */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-default-900 text-base truncate">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-default-500 line-clamp-2 mt-0.5">{subtitle}</p>
                )}
              </div>
              {status && (
                <Chip 
                  size="sm" 
                  color={status.color} 
                  variant="flat"
                  className="shrink-0"
                >
                  {status.label}
                </Chip>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        {metadata.length > 0 && (
          <>
            <Divider className="my-0" />
            <div className="px-4 py-3 bg-default-50/50">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {metadata.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-xs text-default-400 font-medium uppercase tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-sm text-default-700 font-medium truncate">
                      {item.value ?? '—'}
                    </span>
                  </div>
                ))}
              </div>
              {metadata.length > 6 && (
                <div className="mt-2 pt-2 border-t border-default-100">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {metadata.slice(6).map((item, index) => (
                      <div key={index + 6} className="flex flex-col">
                        <span className="text-xs text-default-400 font-medium uppercase tracking-wide">
                          {item.label}
                        </span>
                        <span className="text-sm text-default-700 font-medium truncate">
                          {item.value ?? '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardBody>

      {/* Actions */}
      {actions.length > 0 && (
        <CardFooter className="px-4 py-3 bg-default-50/30 border-t border-default-100">
          <div className="flex justify-between items-center w-full">
            {/* Quick action button for view */}
            {onClick && (
              <Button 
                size="sm" 
                variant="light" 
                color="primary"
                onPress={() => onClick(item)}
                startContent={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                }
              >
                View
              </Button>
            )}
            {!onClick && <div />}
            
            <Dropdown>
              <DropdownTrigger>
                <Button size="sm" variant="flat" color="default">
                  Actions
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Card actions">
                {actions.map((action) => (
                  <DropdownItem
                    key={action.key}
                    color={action.color}
                    startContent={action.icon}
                    onPress={() => handleAction(action.key)}
                  >
                    {action.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}

export default DataCard;
