'use client'

import { SelectHTMLAttributes, forwardRef } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--dark-text)]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={cn(
              'w-full px-3 py-2 bg-white border rounded-md shadow-sm appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
              error ? 'border-[var(--danger)]' : 'border-[var(--card-border)]',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select