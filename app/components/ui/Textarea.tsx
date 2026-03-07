import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows = 4, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--dark-text)]">
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 bg-white border rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent',
            error ? 'border-[var(--danger)]' : 'border-[var(--card-border)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea