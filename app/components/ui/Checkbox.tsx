/*'use client'

import { InputHTMLAttributes, forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/app/lib/utils'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, indeterminate, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null)

    // Handle indeterminate property via ref
    useEffect(() => {
      const checkbox = internalRef.current
      if (checkbox && indeterminate !== undefined) {
        checkbox.indeterminate = indeterminate
      }
    }, [indeterminate])

    // Merge refs
    const handleRef = (instance: HTMLInputElement | null) => {
      // Set internal ref
      ;(internalRef as React.MutableRefObject<HTMLInputElement | null>).current = instance
      
      // Forward ref
      if (typeof forwardedRef === 'function') {
        forwardedRef(instance)
      } else if (forwardedRef) {
        forwardedRef.current = instance
      }
    }

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          ref={handleRef}
          className={cn(
            'w-4 h-4 text-brand-600 bg-white border-card-border rounded focus:ring-brand-500 focus:ring-2',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="ml-2 text-sm text-dark-text">
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox*/

'use client'

import { InputHTMLAttributes, ReactNode, forwardRef, useEffect, useRef } from 'react'
import { cn } from '@/app/lib/utils'

/*interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  indeterminate?: boolean
}*/

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, indeterminate, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLInputElement>(null)

    // Handle indeterminate property via ref
    useEffect(() => {
      const checkbox = internalRef.current
      if (checkbox && indeterminate !== undefined) {
        checkbox.indeterminate = indeterminate
      }
    }, [indeterminate])

    // Merge refs
    const handleRef = (instance: HTMLInputElement | null) => {
      ;(internalRef as React.MutableRefObject<HTMLInputElement | null>).current = instance
      if (typeof forwardedRef === 'function') {
        forwardedRef(instance)
      } else if (forwardedRef) {
        forwardedRef.current = instance
      }
    }

    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          ref={handleRef}
          className={cn(
            'w-4 h-4 rounded border-[var(--card-border)] bg-[var(--white)] dark:bg-[var(--dark-text)] dark:border-[var(--soft-gray)] focus:ring-2 focus:ring-[var(--brand-500)]',
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className="ml-2 text-sm text-[var(--dark-text)] dark:text-[var(--light-text)]"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox