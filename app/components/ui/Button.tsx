/*import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        secondary: 'bg-white text-dark-text border-2 border-brand-500 hover:bg-brand-50',
        outline: 'border-2 border-brand-500 text-brand-600 hover:bg-brand-50',
        ghost: 'text-brand-600 hover:bg-brand-50',
        danger: 'bg-danger text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-9 px-4 py-2',
        md: 'h-11 px-6 py-3',
        lg: 'h-14 px-8 py-4 text-base',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button*/
'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/app/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--brand-500)] text-white hover:bg-[var(--brand-600)] shadow-md hover:shadow-lg transform hover:-translate-y-0.5',
        secondary:
          'bg-white dark:bg-[var(--dark-text)] text-[var(--dark-text)] dark:text-[var(--light-text)] border-2 border-[var(--brand-500)] hover:bg-[var(--brand-50)]',
        outline: 'border-2 border-[var(--brand-500)] text-[var(--brand-500)] hover:bg-[var(--brand-50)]',
        ghost: 'text-[var(--brand-500)] hover:bg-[var(--brand-50)]',
        danger: 'bg-red-500 text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button