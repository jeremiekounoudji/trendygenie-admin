import { Card, CardBody, Skeleton } from '@heroui/react';

type ColorVariant = 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'default';

interface SummaryCardProps {
  title: string;
  value: number | null;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  loading?: boolean;
  color?: ColorVariant;
}

// Strong, vibrant colors for summary cards
const colorClasses: Record<ColorVariant, { bg: string; text: string; iconBg: string }> = {
  primary: { bg: 'bg-primary', text: 'text-white', iconBg: 'bg-white/20' },
  success: { bg: 'bg-success', text: 'text-white', iconBg: 'bg-white/20' },
  warning: { bg: 'bg-warning', text: 'text-white', iconBg: 'bg-white/20' },
  danger: { bg: 'bg-danger', text: 'text-white', iconBg: 'bg-white/20' },
  secondary: { bg: 'bg-secondary', text: 'text-white', iconBg: 'bg-white/20' },
  default: { bg: 'bg-default-700', text: 'text-white', iconBg: 'bg-white/20' },
};

export function SummaryCard({ 
  title, 
  value, 
  icon, 
  trend, 
  onClick, 
  loading = false,
  color = 'primary',
}: SummaryCardProps) {
  const colors = colorClasses[color];
  
  return (
    <Card
      isPressable={!!onClick}
      onPress={onClick}
      className={`card-hover ${colors.bg} shadow-lg`}
    >
      <CardBody className="flex flex-row items-center gap-4 p-5">
        {/* Icon */}
        <div className={`shrink-0 w-14 h-14 rounded-xl ${colors.iconBg} flex items-center justify-center ${colors.text}`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${colors.text} opacity-80 truncate`}>{title}</p>
          {loading ? (
            <Skeleton className="h-8 w-20 rounded-lg mt-1 bg-white/20" />
          ) : (
            <p className={`text-3xl font-bold ${colors.text}`}>
              {value?.toLocaleString() ?? '—'}
            </p>
          )}
        </div>

        {/* Trend indicator */}
        {trend && !loading && (
          <div className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${trend.isPositive ? 'bg-white/20 text-white' : 'bg-white/20 text-white'}`}>
            <svg
              className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default SummaryCard;
