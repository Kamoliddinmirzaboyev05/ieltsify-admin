import { forwardRef } from 'react';
import type { LabelHTMLAttributes } from 'react';
import './label.css';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = '', ...props }, ref) => (
    <label ref={ref} className={`label ${className}`} {...props} />
  )
);

Label.displayName = 'Label';
