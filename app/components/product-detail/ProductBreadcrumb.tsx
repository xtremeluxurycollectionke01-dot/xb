'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FiChevronLeft, FiChevronRight, FiHome } from 'react-icons/fi'

interface ProductBreadcrumbProps {
  category: string
  categorySlug: string
  productName: string
}

export default function ProductBreadcrumb({ category, categorySlug, productName }: ProductBreadcrumbProps) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      <nav className="flex items-center space-x-2 text-sm">
        <Link 
          href="/" 
          className="flex items-center text-gray-600 hover:text-brand-600 transition-colors"
        >
          <FiHome className="w-4 h-4" />
        </Link>
        <FiChevronRight className="w-4 h-4 text-gray-400" />
        <Link 
          href="/products" 
          className="text-gray-600 hover:text-brand-600 transition-colors"
        >
          Products
        </Link>
        <FiChevronRight className="w-4 h-4 text-gray-400" />
        <Link 
          href={`/products?category=${categorySlug}`}
          className="text-gray-600 hover:text-brand-600 transition-colors"
        >
          {category}
        </Link>
        <FiChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-dark-text font-medium line-clamp-1">
          {productName}
        </span>
      </nav>

      <button
        onClick={() => router.back()}
        className="flex items-center text-sm text-gray-600 hover:text-brand-600 transition-colors"
      >
        <FiChevronLeft className="w-4 h-4 mr-1" />
        Back
      </button>
    </div>
  )
}