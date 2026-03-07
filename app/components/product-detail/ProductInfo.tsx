'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiStar, FiHeart, FiShare2, FiCheck, FiXCircle } from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { type Product } from '@/app/lib/products-data'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface ProductInfoProps {
  product: Product
  onQuantityChange: (quantity: number) => void
  quantity: number
  onAddToCart: () => void
  onRequestQuote: () => void
  onSaveToList: () => void
  isSaved?: boolean
}

export default function ProductInfo({
  product,
  onQuantityChange,
  quantity,
  onAddToCart,
  onRequestQuote,
  onSaveToList,
  isSaved = false,
}: ProductInfoProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : null

  const getStockStatus = () => {
    switch (product.stockStatus) {
      case 'in-stock':
        return {
          icon: FiCheck,
          text: 'In Stock',
          color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
        }
      case 'low-stock':
        return {
          icon: FiCheck,
          text: `Low Stock (${product.stock} left)`,
          color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
        }
      case 'out-of-stock':
        return {
          icon: FiXCircle,
          text: 'Out of Stock',
          color: 'text-red-600 bg-red-50 dark:bg-red-900/20',
        }
      default:
        return {
          icon: FiCheck,
          text: 'Unknown',
          color: 'text-gray-600 bg-gray-50',
        }
    }
  }

  const stockStatus = getStockStatus()
  const StockIcon = stockStatus.icon

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Title & SKU */}
      <div>
        <h1 className="text-3xl font-bold text-dark-text mb-2">{product.name}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-500">SKU: {product.sku}</span>
          <span className="text-gray-300">|</span>
          <Link 
            href={`/products?category=${product.categorySlug}`}
            className="text-brand-600 hover:text-brand-700"
          >
            {product.category}
          </Link>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
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
        <Link href="#reviews" className="text-sm text-gray-600 hover:text-brand-600">
          {product.reviewCount} reviews
        </Link>
      </div>

      {/* Price */}
      <div className="py-4 border-y border-card-border">
        {discountedPrice ? (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-600">
              KES {discountedPrice.toLocaleString()}
            </span>
            <span className="text-xl text-gray-400 line-through">
              KES {product.price.toLocaleString()}
            </span>
            <Badge variant="warning">{product.discount}% OFF</Badge>
          </div>
        ) : (
          <span className="text-3xl font-bold text-dark-text">
            KES {product.price.toLocaleString()}
          </span>
        )}
        <span className="text-sm text-gray-500 ml-1">/{product.unit}</span>

        {/* Wholesale price hint */}
        {product.wholesalePrice && (
          <p className="mt-2 text-sm text-brand-600">
            Bulk pricing available for quantities over {product.minOrderQuantity}+
          </p>
        )}
      </div>

      {/* Stock Status */}
      <div className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        stockStatus.color
      )}>
        <StockIcon className="w-5 h-5" />
        <span className="font-medium">{stockStatus.text}</span>
      </div>

      {/* Short Description */}
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {product.description}
      </p>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">
          Quantity (Min: {product.minOrderQuantity})
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onQuantityChange(Math.max(product.minOrderQuantity, quantity - 1))}
            disabled={quantity <= product.minOrderQuantity}
            className="w-12 h-12 border border-card-border rounded-md hover:bg-soft-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => onQuantityChange(Math.max(product.minOrderQuantity, parseInt(e.target.value) || product.minOrderQuantity))}
            className="w-20 h-12 text-center border border-card-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
            min={product.minOrderQuantity}
          />
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="w-12 h-12 border border-card-border rounded-md hover:bg-soft-gray transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          disabled={product.stockStatus === 'out-of-stock'}
          onClick={onAddToCart}
          className="flex-1"
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={onRequestQuote}
          className="flex-1"
        >
          Request Quote
        </Button>
      </div>

      {/* Secondary Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-card-border">
        <button
          onClick={onSaveToList}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors"
        >
          <FiHeart className={cn('w-5 h-5', isSaved && 'fill-red-500 text-red-500')} />
          {isSaved ? 'Saved to List' : 'Save to List'}
        </button>
        <span className="text-gray-300">|</span>
        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-600 transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
            Share
          </button>

          {/* Share Options Dropdown */}
          {showShareOptions && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-card-border p-2 z-10">
              <button
                onClick={copyToClipboard}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-soft-gray rounded-md"
              >
                Copy Link
              </button>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-soft-gray rounded-md"
              >
                Share on Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-soft-gray rounded-md"
              >
                Share on Twitter
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(product.name + ' ' + window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-soft-gray rounded-md"
              >
                Share on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="bg-soft-gray rounded-lg p-4 space-y-2">
        <div className="flex items-center text-sm">
          <FiCheck className="w-4 h-4 text-green-600 mr-2" />
          <span>Free delivery for orders over KES 10,000</span>
        </div>
        <div className="flex items-center text-sm">
          <FiCheck className="w-4 h-4 text-green-600 mr-2" />
          <span>Same-day delivery within Nairobi</span>
        </div>
        <div className="flex items-center text-sm">
          <FiCheck className="w-4 h-4 text-green-600 mr-2" />
          <span>Secure payment with M-Pesa or card</span>
        </div>
      </div>
    </div>
  )
}