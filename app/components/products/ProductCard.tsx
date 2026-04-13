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


/*'use client'

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

        {/* Placeholder Fallback UI - shows when imageError is true *
        {/*{imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <FiImage className="w-12 h-12 text-[var(--card-border)] mb-2" />
            <span className="text-sm text-[var(--card-border)]">No image available</span>
          </div>
        )}*

        {/* Quick View Overlay - only show when not in error state *
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

/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiShoppingCart, FiFileText, FiEye, FiHeart, FiStar } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/models/product.model'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { productService } from '@/app/lib/buiness/product.service'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError || !product.images?.length 
    ? placeholderImage 
    : product.images[0]

  const discountedPrice = product.originalPrice && product.originalPrice > product.price
    ? product.price
    : null

  const originalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : product.discount || 0

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
        return `Low Stock (${product.stockQuantity} left)`
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    onQuickView(product)
  }

  const handleAddToRecentlyViewed = () => {
    productService.addToRecentlyViewed(product.id)
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
        {product.badge && (
          <Badge variant="info">{product.badge}</Badge>
        )}
        {product.isFeatured && (
          <Badge variant="success">Featured</Badge>
        )}
        {discountPercentage > 0 && (
          <Badge variant="warning">{discountPercentage}% OFF</Badge>
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
      <Link 
        href={`/products/${product.id}`} 
        className="block relative aspect-square overflow-hidden bg-[var(--soft-gray)]"
        onClick={handleAddToRecentlyViewed}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            'transition-transform duration-500 object-cover',
            isHovered && !imageError ? 'scale-110' : 'scale-100'
          )}
          onError={() => setImageError(true)}
        />

        {/* Quick View Overlay *
        {!imageError && (
          <div
            className={cn(
              'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <button
              onClick={handleQuickView}
              className="bg-white text-dark-text px-4 py-2 rounded-full font-medium text-sm hover:bg-brand-500 hover:text-white transition-colors flex items-center"
            >
              <FiEye className="w-4 h-4 mr-2" />
              Quick View
            </button>
          </div>
        )}
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
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(product.rating || 0)
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
        )}

        {/* Price *
        <div className="mb-3">
          {originalPrice ? (
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-brand-600">
                KES {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through">
                KES {originalPrice.toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-lg font-bold text-dark-text">
              KES {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-gray-500 ml-1">/{product.unit || 'piece'}</span>
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


/*'use client'

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

        {/* Placeholder Fallback UI - shows when imageError is true *
        {/*{imageError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <FiImage className="w-12 h-12 text-[var(--card-border)] mb-2" />
            <span className="text-sm text-[var(--card-border)]">No image available</span>
          </div>
        )}*

        {/* Quick View Overlay - only show when not in error state *
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
import { FiShoppingCart, FiFileText, FiEye, FiHeart, FiStar } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/models/product.model'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { productService } from '@/app/lib/buiness/product.service'
import { useCart } from '@/app/context/CartContext'
import { toast } from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  onQuickView: (product: Product) => void
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCart()

  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError || !product.images?.length 
    ? placeholderImage 
    : product.images[0]

  const discountedPrice = product.originalPrice && product.originalPrice > product.price
    ? product.price
    : null

  const originalPrice = product.originalPrice && product.originalPrice > product.price
    ? product.originalPrice
    : null

  const discountPercentage = originalPrice
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : product.discount || 0

  const getStockStatusColor = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'out-of-stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
    }
  }

  const getStockStatusText = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return 'In Stock'
      case 'low-stock':
        return `Low Stock (${product.stockQuantity} left)`
      case 'out-of-stock':
        return 'Out of Stock'
      default:
        return 'Unknown'
    }
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    onQuickView(product)
  }

  const handleAddToRecentlyViewed = () => {
    productService.addToRecentlyViewed(product.id)
  }

  /*const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Check if product is in stock
    if (product.stockStatus === 'out-of-stock') {
      toast.error(`${product.name} is out of stock`, {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          borderRadius: '12px',
        }
      })
      return
    }
    
    // Check if product is low stock and warn
    if (product.stockStatus === 'low-stock') {
      toast.custom((t) => (
        <div className={`bg-yellow-500 text-white rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ${t.visible ? 'translate-y-0' : 'translate-y-2'}`}>
          <p className="font-semibold">Limited Stock!</p>
          <p className="text-sm">Only {product.stockQuantity} units left. Order soon!</p>
        </div>
      ), {
        duration: 3000,
        position: 'top-right',
      })
    }
    
    // Add to cart
    addToCart({
      id: parseInt(product.id) || product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || placeholderImage,
      maxStock: product.stockQuantity,
      sku: product.sku
    })
    
    // Show success toast with product image
    toast.success(
      (t) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
            <Image
              src={product.images[0] || placeholderImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm opacity-90">Added to cart</p>
          </div>
        </div>
      ),
      {
        duration: 3000,
        position: 'top-right',
        icon: '🛒',
        style: {
          background: 'var(--brand-500)',
          color: 'white',
          borderRadius: '12px',
          padding: '12px',
        }
      }
    )
  }*/

    // In ProductCard component, update the handleAddToCart function:
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault()
  
  // Check if product is in stock
  if (product.stockStatus === 'out-of-stock') {
    toast.error(`${product.name} is out of stock`, {
      duration: 3000,
      position: 'top-right',
      style: {
        background: '#EF4444',
        color: 'white',
        borderRadius: '12px',
      }
    })
    return
  }
  
  // Check if product is low stock and warn
  if (product.stockStatus === 'low-stock') {
    toast.custom((t) => (
      <div className={`bg-yellow-500 text-white rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ${t.visible ? 'translate-y-0' : 'translate-y-2'}`}>
        <p className="font-semibold">Limited Stock!</p>
        <p className="text-sm">Only {product.stockQuantity} units left. Order soon!</p>
      </div>
    ), {
      duration: 3000,
      position: 'top-right',
    })
  }
  
  // Fix: Pass ID as string consistently
  addToCart({
    id: product.id,  // Use string directly
    name: product.name,
    price: product.price,
    image: product.images?.[0] || placeholderImage,
    maxStock: product.stockQuantity,
    sku: product.sku
  })
  
  // Show success toast with product image
  toast.success(
    (t) => (
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || placeholderImage}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm opacity-90">Added to cart</p>
        </div>
      </div>
    ),
    {
      duration: 3000,
      position: 'top-right',
      icon: '🛒',
      style: {
        background: 'var(--brand-500)',
        color: 'white',
        borderRadius: '12px',
        padding: '12px',
      }
    }
  )
}

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 2000,
      position: 'top-right',
      icon: isLiked ? '💔' : '❤️',
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '12px',
      }
    })
  }

  const handleRequestQuote = (e: React.MouseEvent) => {
    e.preventDefault()
    toast.custom((t) => (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-md border border-gray-200 dark:border-gray-700">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Request Bulk Quote</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Interested in bulk pricing for {product.name}?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              window.location.href = `/products/${product.id}#quote`
              toast.dismiss(t.id)
            }}
            className="flex-1 px-3 py-1.5 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 transition-colors"
          >
            Get Quote
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    })
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
        {product.isNewArrival && (
          <Badge variant="success">New Arrival</Badge>
        )}
        {product.isBestSeller && (
          <Badge variant="info">Best Seller</Badge>
        )}
        {product.isSpecialOffer && discountPercentage > 0 && (
          <Badge variant="warning">{discountPercentage}% OFF</Badge>
        )}
        {product.badge && !product.isNewArrival && !product.isBestSeller && !product.isSpecialOffer && (
          <Badge variant="info">{product.badge}</Badge>
        )}
        {product.isFeatured && (
          <Badge variant="info">Featured</Badge>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleAddToWishlist}
        className="absolute top-2 right-2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:shadow-lg transition-all"
      >
        <FiHeart
          className={cn(
            'w-4 h-4 transition-colors',
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
          )}
        />
      </button>

      {/* Image */}
      <Link 
        href={`/products/${product.id}`} 
        className="block relative aspect-square overflow-hidden bg-[var(--soft-gray)] dark:bg-gray-800"
        onClick={handleAddToRecentlyViewed}
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={cn(
            'transition-transform duration-500 object-cover',
            isHovered && !imageError ? 'scale-110' : 'scale-100'
          )}
          onError={() => setImageError(true)}
          unoptimized={imageError}
        />

        {/* Quick View Overlay */}
        {!imageError && (
          <div
            className={cn(
              'absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            <button
              onClick={handleQuickView}
              className="bg-white dark:bg-gray-800 text-dark-text dark:text-light-text px-4 py-2 rounded-full font-medium text-sm hover:bg-brand-500 hover:text-white transition-colors flex items-center"
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">SKU: {product.sku}</p>

        {/* Product Name */}
        <Link href={`/products/${product.id}`} onClick={handleAddToRecentlyViewed}>
          <h3 className="font-semibold text-dark-text dark:text-light-text mb-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={cn(
                    'w-4 h-4',
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              ({product.reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-3">
          {originalPrice ? (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                KES {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-400 line-through dark:text-gray-500">
                KES {originalPrice.toLocaleString()}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded">
                  Save {discountPercentage}%
                </span>
              )}
            </div>
          ) : (
            <span className="text-lg font-bold text-dark-text dark:text-light-text">
              KES {product.price.toLocaleString()}
            </span>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/{product.unit || 'piece'}</span>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <span className={cn(
            'inline-block px-2 py-1 text-xs rounded font-medium',
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
            onClick={handleAddToCart}
            className="flex-1 group/btn relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              <FiShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
              {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </span>
            {product.stockStatus !== 'out-of-stock' && (
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRequestQuote}
            className="px-3 group/quote"
            title="Request bulk quote"
          >
            <FiFileText className="w-4 h-4 transition-transform duration-300 group-hover/quote:scale-110" />
          </Button>
        </div>
        
        {/* Bulk Order Link */}
        <div className="text-center mt-2">
          <Link
            href={`/products/${product.id}#quote`}
            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors inline-flex items-center gap-1"
          >
            Request Quote for Bulk Order
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </Card>
  )
}