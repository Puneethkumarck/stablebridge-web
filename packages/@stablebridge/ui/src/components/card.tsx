'use client';

import type { HTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '../lib/utils';

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('rounded-xl border border-zinc-200 bg-white shadow-sm', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col space-y-1.5 p-6', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('text-xl font-semibold tracking-tight text-zinc-950', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('text-sm text-zinc-500', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('p-6 pt-0', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('flex items-center p-6 pt-0', className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
