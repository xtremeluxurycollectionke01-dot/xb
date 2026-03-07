'use client'

import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiChevronRight, FiHome } from 'react-icons/fi'

interface BreadcrumbItem {
  label: string
  href: string
}

interface ProductBreadcrumbProps {
  items?: BreadcrumbItem[]
}

export default function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
  const pathname = usePathname()
  
  const defaultItems: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
  ]

  const breadcrumbItems = items || defaultItems

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <FiChevronRight className="w-4 h-4 text-gray-400 mx-2" />}
          {index === 0 ? (
            <Link 
              href={item.href}
              className="flex items-center text-gray-600 hover:text-brand-600 transition-colors"
            >
              <FiHome className="w-4 h-4 mr-1" />
              {item.label}
            </Link>
          ) : (
            <Link
              href={item.href}
              className={cn(
                'transition-colors',
                index === breadcrumbItems.length - 1
                  ? 'text-dark-text font-medium cursor-default pointer-events-none'
                  : 'text-gray-600 hover:text-brand-600'
              )}
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  )
}