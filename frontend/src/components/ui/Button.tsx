import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 ease-out rounded-full focus:outline-none focus:ring-2 focus:ring-apple-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-apple-blue text-white hover:bg-apple-blue-hover active:scale-[0.98]': variant === 'primary',
            'border border-apple-border text-apple-text hover:bg-gray-50 active:bg-gray-100': variant === 'secondary',
            'text-apple-text-secondary hover:text-apple-text hover:bg-gray-50': variant === 'ghost',
            'bg-apple-error text-white hover:bg-red-600 active:scale-[0.98]': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-sm': size === 'md',
            'px-8 py-3 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
