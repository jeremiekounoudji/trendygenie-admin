import { Spinner } from '@heroui/react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <Spinner size={size} color="primary" />
          {label && <p className="text-sm text-default-500">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={size} color="primary" />
        {label && <p className="text-sm text-default-500">{label}</p>}
      </div>
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="bg-content1 rounded-lg p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-default-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-default-200 rounded w-3/4" />
          <div className="h-3 bg-default-200 rounded w-1/2" />
        </div>
      </div>
      <div className="mt-3 flex gap-4">
        <div className="h-3 bg-default-200 rounded w-1/4" />
        <div className="h-3 bg-default-200 rounded w-1/4" />
      </div>
    </div>
  );
}

// Grid of skeleton cards
interface CardSkeletonGridProps {
  count?: number;
}

export function CardSkeletonGrid({ count = 6 }: CardSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export default LoadingSpinner;
