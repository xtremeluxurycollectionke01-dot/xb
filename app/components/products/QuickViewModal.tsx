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