/*import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-slate-800 rounded-lg border border-card-border shadow-sm overflow-hidden',
          hoverable && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card*/

'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-[var(--dark-text)] rounded-lg border border-[var(--card-border)] shadow-sm overflow-hidden',
          hoverable && 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card