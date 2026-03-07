'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { type Product } from '@/app/lib/products-data'
import { addToRecentlyViewed } from '@/app/lib/products-data'
import Container from '../layout/Container'
import ProductBreadcrumb from './ProductBreadcrumb'
import ProductImages from './ProductImages'
import ProductInfo from './ProductInfo'
import ProductTabs from './ProductTabs'
import StaffActionsBar from './StaffActionsBar'
import RelatedProducts from './RelatedProducts'
import RecentlyViewed from './RecentlyViewed'
import { ToastContainer, type ToastType } from '../ui/Toast'

interface ProductDetailClientProps {
  product: Product
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(product.minOrderQuantity)
  const [isSaved, setIsSaved] = useState(false)
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])

  // Add to recently viewed on mount
  useEffect(() => {
    addToRecentlyViewed(product.id)
  }, [product.id])

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString()
    setToasts(prev => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const handleAddToCart = () => {
    // Here you would integrate with your cart state management
    addToast(`${quantity} × ${product.name} added to cart`, 'success')
  }

  const handleRequestQuote = () => {
    // Here you would open quote modal or navigate to quote page
    addToast('Quote request sent to our sales team', 'info')
    // Scroll to quote section or open modal
  }

  const handleSaveToList = () => {
    setIsSaved(!isSaved)
    addToast(
      isSaved ? 'Removed from wishlist' : 'Added to wishlist',
      'success'
    )
  }

  return (
    <>
      <Container className="py-8">
        {/* Breadcrumb */}
        <ProductBreadcrumb
          category={product.category}
          categorySlug={product.categorySlug}
          productName={product.name}
        />

        {/* Staff Actions Bar (conditionally rendered) */}
        <StaffActionsBar product={product} isStaff={true} /> {/* TODO: Replace with actual auth check */}

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Images */}
          <div>
            <ProductImages images={product.images} productName={product.name} />
          </div>

          {/* Right Column - Product Info */}
          <div>
            <ProductInfo
              product={product}
              quantity={quantity}
              onQuantityChange={setQuantity}
              onAddToCart={handleAddToCart}
              onRequestQuote={handleRequestQuote}
              onSaveToList={handleSaveToList}
              isSaved={isSaved}
            />
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 lg:mt-16">
          <ProductTabs product={product} />
        </div>

        {/* Related Products */}
        <RelatedProducts
          currentProductId={product.id}
          category={product.category}
        />

        {/* Recently Viewed */}
        <RecentlyViewed />
      </Container>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  )
}