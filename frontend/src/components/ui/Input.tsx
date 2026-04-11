import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-apple-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-4 py-2.5 bg-white border rounded-xl text-apple-text placeholder:text-apple-text-secondary/50 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue',
            error ? 'border-apple-error' : 'border-apple-border',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-apple-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
