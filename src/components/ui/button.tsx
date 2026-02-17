import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import './button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const classes = `btn btn-${variant} btn-${size} ${className}`;
    return <button className={classes} ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';
