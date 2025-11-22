

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  className,
  label
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  const colorClasses = {
    primary: 'border-primary/30 border-t-primary',
    secondary: 'border-secondary/30 border-t-secondary',
    white: 'border-white/30 border-t-white',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {label && (
        <span className="mt-2 text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}

export default LoadingSpinner;

