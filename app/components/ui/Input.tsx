/*import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-dark-text">
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 bg-white border border-card-border rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'placeholder:text-gray-400',
            error && 'border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input*/

import { InputHTMLAttributes, JSX, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

/*interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}*/

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: JSX.Element
}

/*const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-md shadow-sm',
            'bg-[var(--white)] dark:bg-[var(--dark-text)]',
            'border border-[var(--card-border)] dark:border-[var(--soft-gray)]',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
            error &&
              'border-[var(--danger)] focus:ring-[var(--danger)] dark:border-[var(--danger)] dark:focus:ring-[var(--danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    )
  }
)*/

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, leftIcon, ...props }, ref) => {
    return (
      <div className="relative space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]"
          >
            {label}
          </label>
        )}

        {/* Left icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={id}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 rounded-md shadow-sm',
            leftIcon ? 'pl-10' : 'pl-3', // add padding if leftIcon exists
            'bg-[var(--white)] dark:bg-[var(--dark-text)]',
            'border border-[var(--card-border)] dark:border-[var(--soft-gray)]',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
            error &&
              'border-[var(--danger)] focus:ring-[var(--danger)] dark:border-[var(--danger)] dark:focus:ring-[var(--danger)]',
            className
          )}
          {...props} // now leftIcon is removed
        />

        {error && <p className="text-sm text-[var(--danger)] mt-1">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input