'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiShoppingCart, FiFileText, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/products-data'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(product?.minOrderQuantity || 1)

  if (!product) return null

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % product.images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + product.images.length) % product.images.length)
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl z-50">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-soft-gray">
              <Image
                src={product.images[currentImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.isNew && <Badge variant="success">New</Badge>}
                {product.discount && <Badge variant="warning">{product.discount}% OFF</Badge>}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={cn(
                      'relative w-20 h-20 rounded-md overflow-hidden border-2 transition-colors',
                      currentImage === index ? 'border-brand-500' : 'border-transparent'
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* SKU & Categories */}
            <div>
              <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                <Link 
                  href={`/products/category/${product.categorySlug}`}
                  className="text-xs bg-soft-gray px-2 py-1 rounded hover:bg-brand-100 transition-colors"
                >
                  {product.category}
                </Link>
                <span className="text-xs bg-soft-gray px-2 py-1 rounded">
                  {product.subcategory}
                </span>
                <span className="text-xs bg-soft-gray px-2 py-1 rounded">
                  {product.brand}
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-dark-text">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={cn(
                      'w-5 h-5',
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    )}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} out of 5 ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div>
              {discountedPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-brand-600">
                    KES {discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    KES {product.price.toLocaleString()}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-dark-text">
                  KES {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>
            </div>

            {/* Stock Status */}
            <div className={cn(
              'inline-block px-3 py-1 rounded text-sm font-medium',
              product.stockStatus === 'in-stock' ? 'bg-green-100 text-green-800' :
              product.stockStatus === 'low-stock' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            )}>
              {product.stockStatus === 'in-stock' ? '✓ In Stock' :
               product.stockStatus === 'low-stock' ? `⚠ Only ${product.stock} left` :
               '✗ Out of Stock'}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-medium text-dark-text mb-2">Description</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {product.description}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="font-medium text-dark-text mb-2">Specifications</h3>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="col-span-1">
                    <dt className="text-gray-500">{key}:</dt>
                    <dd className="text-dark-text font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Quantity (Min: {product.minOrderQuantity})
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity, quantity - 1))}
                    className="w-10 h-10 border border-card-border rounded-md hover:bg-soft-gray transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(product.minOrderQuantity, parseInt(e.target.value) || 1))}
                    className="w-20 h-10 text-center border border-card-border rounded-md"
                    min={product.minOrderQuantity}
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-card-border rounded-md hover:bg-soft-gray transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  disabled={product.stockStatus === 'out-of-stock'}
                  className="flex-1"
                >
                  <FiShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <FiFileText className="w-5 h-5 mr-2" />
                  Request Quote
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                Bulk discounts available. <Link href={`/products/${product.id}`} className="text-brand-600 hover:underline">View full details →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

/*'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiX, FiShoppingCart, FiFileText, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/lib/models/product.model'
import { productService } from '@/lib/business/product.service'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface QuickViewModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart?: (product: Product, quantity: number) => void
  onRequestQuote?: (product: Product, quantity: number) => void
}

export default function QuickViewModal({ 
  product, 
  onClose,
  onAddToCart,
  onRequestQuote 
}: QuickViewModalProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isRequestingQuote, setIsRequestingQuote] = useState(false)

  // Update quantity when product changes
  useEffect(() => {
    if (product) {
      setQuantity(product.minOrderQuantity || 1)
      setCurrentImage(0)
      setImageError({})
    }
  }, [product])

  if (!product) return null

  const placeholderImage = '/images/placeholder.png'

  const discountedPrice = product.originalPrice && product.originalPrice > product.price
    ? product.price
    : null

  const originalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : product.discount || 0

  const images = product.images?.length ? product.images : [placeholderImage]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }))
  }

  const getImageSrc = (index: number) => {
    return imageError[index] ? placeholderImage : images[index]
  }

  const handleAddToCart = async () => {
    if (!onAddToCart) return
    
    setIsAddingToCart(true)
    try {
      await onAddToCart(product, quantity)
      // Add to recently viewed
      productService.addToRecentlyViewed(product.id)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleRequestQuote = async () => {
    if (!onRequestQuote) return
    
    setIsRequestingQuote(true)
    try {
      await onRequestQuote(product, quantity)
    } catch (error) {
      console.error('Error requesting quote:', error)
    } finally {
      setIsRequestingQuote(false)
    }
  }

  const getStockStatusDisplay = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return { text: '✓ In Stock', className: 'bg-green-100 text-green-800' }
      case 'low-stock':
        return { 
          text: `⚠ Only ${product.stockQuantity} left`, 
          className: 'bg-yellow-100 text-yellow-800' 
        }
      case 'out-of-stock':
        return { text: '✗ Out of Stock', className: 'bg-red-100 text-red-800' }
      default:
        return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' }
    }
  }

  const stockStatus = getStockStatusDisplay()

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  return (
    <>
      {/* Overlay *
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-label="Close modal"
      />

      {/* Modal *
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-2xl z-50 animate-slideIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        {/* Close Button *
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
          aria-label="Close quick view"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Image Gallery *
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-soft-gray">
              <Image
                src={getImageSrc(currentImage)}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                onError={() => handleImageError(currentImage)}
                priority
              />
              
              {/* Image Navigation *
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-all hover:scale-110"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-all hover:scale-110"
                    aria-label="Next image"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Badges *
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.badge && <Badge variant="info">{product.badge}</Badge>}
                {product.isFeatured && <Badge variant="success">Featured</Badge>}
                {discountPercentage > 0 && (
                  <Badge variant="warning">{discountPercentage}% OFF</Badge>
                )}
              </div>

              {/* Image Counter *
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {currentImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails *
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={cn(
                      'relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all',
                      currentImage === index 
                        ? 'border-brand-500 ring-2 ring-brand-200' 
                        : 'border-transparent hover:border-gray-300'
                    )}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image
                      src={getImageSrc(index)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info *
          <div className="space-y-6">
            {/* SKU & Categories *
            <div>
              <p className="text-sm text-gray-500 mb-1">SKU: {product.sku}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {product.category && (
                  <Link 
                    href={`/products?category=${encodeURIComponent(product.category)}`}
                    className="text-xs bg-soft-gray px-2 py-1 rounded hover:bg-brand-100 transition-colors"
                  >
                    {product.category}
                  </Link>
                )}
                {product.subcategory && (
                  <span className="text-xs bg-soft-gray px-2 py-1 rounded">
                    {product.subcategory}
                  </span>
                )}
                {product.brand && (
                  <Link 
                    href={`/products?brand=${encodeURIComponent(product.brand)}`}
                    className="text-xs bg-soft-gray px-2 py-1 rounded hover:bg-brand-100 transition-colors"
                  >
                    {product.brand}
                  </Link>
                )}
              </div>
            </div>

            {/* Title *
            <h2 id="quick-view-title" className="text-2xl font-bold text-dark-text">
              {product.name}
            </h2>

            {/* Rating *
            {product.rating !== undefined && product.reviewCount !== undefined && (
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={cn(
                        'w-5 h-5',
                        i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      )}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating?.toFixed(1) || '0.0'} out of 5 ({product.reviewCount} reviews)
                </span>
              </div>
            )}

            {/* Price *
            <div>
              {originalPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-brand-600">
                    KES {product.price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    KES {originalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    Save {discountPercentage}%
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-dark-text">
                  KES {product.price.toLocaleString()}
                </span>
              )}
              <span className="text-sm text-gray-500 ml-1">/{product.unit || 'piece'}</span>
            </div>

            {/* Stock Status *
            <div className={cn(
              'inline-block px-3 py-1 rounded text-sm font-medium',
              stockStatus.className
            )}>
              {stockStatus.text}
            </div>

            {/* Description *
            {product.description && (
              <div>
                <h3 className="font-medium text-dark-text mb-2">Description</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
            )}

            {/* Specifications *
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-medium text-dark-text mb-2">Specifications</h3>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="col-span-1">
                      <dt className="text-gray-500">{key}:</dt>
                      <dd className="text-dark-text font-medium">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity & Actions *
            <div className="space-y-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-dark-text mb-2">
                  Quantity (Min: {product.minOrderQuantity || 1})
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(product.minOrderQuantity || 1, quantity - 1))}
                    className="w-10 h-10 border border-card-border rounded-md hover:bg-soft-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= (product.minOrderQuantity || 1)}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value)
                      if (!isNaN(value)) {
                        setQuantity(Math.max(product.minOrderQuantity || 1, value))
                      }
                    }}
                    className="w-20 h-10 text-center border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                    min={product.minOrderQuantity || 1}
                    aria-label="Quantity"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-card-border rounded-md hover:bg-soft-gray transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  disabled={product.stockStatus === 'out-of-stock' || isAddingToCart}
                  onClick={handleAddToCart}
                  className="flex-1 relative"
                  aria-label="Add to cart"
                >
                  {isAddingToCart ? (
                    <>
                      <span className="opacity-0">Add to Cart</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleRequestQuote}
                  disabled={isRequestingQuote}
                  className="flex-1 relative"
                  aria-label="Request quote"
                >
                  {isRequestingQuote ? (
                    <>
                      <span className="opacity-0">Request Quote</span>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <FiFileText className="w-5 h-5 mr-2" />
                      Request Quote
                    </>
                  )}
                </Button>
              </div>

              {/* Bulk Pricing Info *
              {product.wholesalePrice && product.wholesalePrice < product.price && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 Bulk pricing available from KES {product.wholesalePrice.toLocaleString()} per unit
                  </p>
                </div>
              )}

              <p className="text-xs text-center text-gray-500">
                Bulk discounts available. {' '}
                <Link 
                  href={`/products/${product.id}`} 
                  className="text-brand-600 hover:underline font-medium"
                  onClick={() => {
                    productService.addToRecentlyViewed(product.id)
                    onClose()
                  }}
                >
                  View full details →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -40%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}*/