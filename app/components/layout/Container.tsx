/*import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[90rem]',
      full: 'max-w-full',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export default Container*/

'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/app/lib/utils'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', children, ...props }, ref) => {
    const sizeClasses: Record<string, string> = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[90rem]',
      full: 'max-w-full',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto px-4 sm:px-6 lg:px-8', // consistent padding for all screen sizes
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Container.displayName = 'Container'

export default Container