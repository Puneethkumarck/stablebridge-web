'use client';

import type { LabelHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { cn } from '../lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label className={cn('text-sm font-medium text-zinc-700', className)} ref={ref} {...props} />;
});
Label.displayName = 'Label';

export { Label };
