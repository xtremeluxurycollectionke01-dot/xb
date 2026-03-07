import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <input
          type="radio"
          id={id}
          ref={ref}
          className={cn(
            'w-4 h-4 text-brand-600 bg-white border-card-border focus:ring-brand-500 focus:ring-2',
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

Radio.displayName = 'Radio'

export default Radio