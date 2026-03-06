'use client';

import { type VariantProps, cva } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '../lib/utils';

const alertVariants = cva('relative w-full rounded-lg border p-4 text-sm', {
  variants: {
    variant: {
      default: 'border-zinc-200 bg-zinc-50 text-zinc-900',
      destructive: 'border-red-200 bg-red-50 text-red-900',
      success: 'border-green-200 bg-green-50 text-green-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const Alert = forwardRef<HTMLDivElement, AlertProps>(({ className, variant, ...props }, ref) => {
  return (
    <div
      className={cn(alertVariants({ variant, className }))}
      ref={ref}
      role="alert"
      {...props}
    />
  );
});
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return (
      <h5
        className={cn('font-medium leading-none tracking-tight', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('text-sm opacity-90 mt-1', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
