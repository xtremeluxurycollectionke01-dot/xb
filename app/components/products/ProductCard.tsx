/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiFileText, FiEye, FiHeart, FiStar } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/products-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null

  const getStockStatusColor = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'bg-green-100 text-green-800'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatusText = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'In Stock'
      case 'low-stock':
        return `Low Stock (${product.stock} left)`
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card
      hoverable
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges *
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge variant="success">New</Badge>
        )}
        {product.discount && (
          <Badge variant="warning">{product.discount}% OFF</Badge>
        )}
        {product.isFeatured && (
          <Badge variant="info">Featured</Badge>
        )}
      </div>

      {/* Wishlist Button *
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <FiHeart
          className={cn(
            'w-4 h-4',
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
          )}
        />
      </button>

      {/* Image *
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
        {!imageError ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered ? 'scale-110' : 'scale-100'
            )}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-soft-gray flex items-center justify-center">
            <span className="text-gray-400">Image not available</span>
          </div>
        )}

        {/* Quick View Overlay *
        <div
          className={cn(
            'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <button
            onClick={(e) => {
              e.preventDefault()
              onQuickView(product)
            }}
            className="bg-white text-dark-text px-4 py-2 rounded-full font-medium text-sm hover:bg-brand-500 hover:text-white transition-colors flex items-center"
          >
            <FiEye className="w-4 h-4 mr-2" />
            Quick View
          </button>
        </div>
      </Link>

      {/* Content *
      <div className="p-4">
        {/* SKU *
        <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>

        {/* Product Name *
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark-text mb-2 hover:text-brand-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating *
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price *
        <div className="mb-3">
          {discountedPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-600">
                KES {discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                KES {product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-dark-text">
              KES {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
        </div>

        {/* Stock Status *
        <div className="mb-4">
          <span className={cn(
            'inline-block px-2 py-1 text-xs rounded',
            getStockStatusColor()
          )}>
            {getStockStatusText()}
          </span>
        </div>

        {/* Actions *
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={product.stockStatus === 'out-of-stock'}
            className="flex-1"
          >
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <FiFileText className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center mt-2">
          <Link
            href={`/products/${product.id}#quote`}
            className="text-xs text-brand-600 hover:text-brand-700"
          >
            Request Quote for Bulk Order
          </Link>
        </div>
      </div>
    </Card>
  )
}*/


'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiFileText, FiEye, FiHeart, FiStar, FiImage } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/products-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Placeholder image path - adjust to your actual placeholder location
  const placeholderImage = '/images/placeholder.png'

  // Use placeholder if image failed to load
  const imageSrc = imageError ? placeholderImage : product.images[0]

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null

  const getStockStatusColor = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'bg-green-100 text-green-800'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStockStatusText = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'In Stock'
      case 'low-stock':
        return `Low Stock (${product.stock} left)`
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card
      hoverable
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge variant="success">New</Badge>
        )}
        {product.discount && (
          <Badge variant="warning">{product.discount}% OFF</Badge>
        )}
        {product.isFeatured && (
          <Badge variant="info">Featured</Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <FiHeart
          className={cn(
            'w-4 h-4',
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
          )}
        />
      </button>

      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-[var(--soft-gray)]">
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            'transition-transform duration-500',
            imageError ? 'object-contain p-8 opacity-60' : 'object-cover',
            isHovered && !imageError ? 'scale-110' : 'scale-100'
          )}
          onError={() => {
            console.log(`Image failed for ${product.name}, switching to placeholder`)
            setImageError(true)
          }}
          unoptimized={imageError} // Disable optimization for placeholder
        />

        {/* Placeholder Fallback UI - shows when imageError is true */}
        {/*{imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <FiImage className="w-12 h-12 text-[var(--card-border)] mb-2" />
            <span className="text-sm text-[var(--card-border)]">No image available</span>
          </div>
        )}*/}

        {/* Quick View Overlay - only show when not in error state */}
        {!imageError && (
          <div
            className={cn(
              'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                onQuickView(product)
              }}
              className="bg-white text-dark-text px-4 py-2 rounded-full font-medium text-sm hover:bg-brand-500 hover:text-white transition-colors flex items-center"
            >
              <FiEye className="w-4 h-4 mr-2" />
              Quick View
            </button>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* SKU */}
        <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>

        {/* Product Name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark-text mb-2 hover:text-brand-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={cn(
                  'w-4 h-4',
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          {discountedPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-600">
                KES {discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                KES {product.price.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-dark-text">
              KES {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span className={cn(
            'inline-block px-2 py-1 text-xs rounded',
            getStockStatusColor()
          )}>
            {getStockStatusText()}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            disabled={product.stockStatus === 'out-of-stock'}
            className="flex-1"
          >
            <FiShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="px-3"
          >
            <FiFileText className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-center mt-2">
          <Link
            href={`/products/${product.id}#quote`}
            className="text-xs text-brand-600 hover:text-brand-700"
          >
            Request Quote for Bulk Order
          </Link>
        </div>
      </div>
    </Card>
  )
}