/*'use client'

import { useState } from 'react'
import { type Product } from '@/app/lib/products-data'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'
import Button from '../ui/Button'

interface ProductGridProps {
  products: Product[]
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export default function ProductGrid({ 
  products, 
  hasMore, 
  onLoadMore,
  isLoading = false 
}: ProductGridProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={setSelectedProduct}
          />
        ))}
      </div>

      {/* Load More / Pagination *
      {hasMore && (
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Load More Products'}
          </Button>
        </div>
      )}

      {/* Pagination Numbers *
      <div className="flex justify-center mt-8">
        <nav className="flex items-center space-x-2">
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">
            Previous
          </button>
          <button className="px-3 py-2 bg-brand-500 text-white rounded-md text-sm">1</button>
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">2</button>
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">3</button>
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">4</button>
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">5</button>
          <span className="px-2">...</span>
          <button className="px-3 py-2 border border-card-border rounded-md text-sm hover:bg-soft-gray transition-colors">
            Next
          </button>
        </nav>
      </div>

      {/* Quick View Modal *
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}*/

'use client'

import { type Product } from '@/app/lib/models/product.model'
import ProductCard from './ProductCard'
import Button from '../ui/Button'

interface ProductGridProps {
  products: Product[]
  hasMore: boolean
  onLoadMore: () => void
  isLoading?: boolean
}

export default function ProductGrid({ 
  products, 
  hasMore, 
  onLoadMore,
  isLoading = false 
}: ProductGridProps) {
  if (products.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onQuickView={() => {}} 
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      )}
      
      {hasMore && !isLoading && (
        <div className="text-center mt-8">
          <Button onClick={onLoadMore} variant="outline">
            Load More Products
          </Button>
        </div>
      )}
    </div>
  )
}