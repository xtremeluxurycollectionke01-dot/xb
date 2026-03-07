/*import { HTMLAttributes } from 'react'
import { cn } from '@/app/lib/utils'

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  align = 'center',
  className,
  ...props 
}: SectionHeadingProps) {
  return (
    <div 
      className={cn(
        'space-y-2 mb-12',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-dark-text">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}*/

'use client'

import { HTMLAttributes } from 'react'
import { cn } from '@/app/lib/utils'

interface SectionHeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export default function SectionHeading({ 
  title, 
  subtitle, 
  align = 'center',
  className,
  ...props 
}: SectionHeadingProps) {
  return (
    <div 
      className={cn(
        'space-y-2 mb-12',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
      {...props}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-[var(--brand-700)] dark:text-[var(--brand-400)]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}