'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi'
import { type Product, products } from '@/app/lib/products-data'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

interface RelatedProductsProps {
  currentProductId: string
  category: string
}

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [startIndex, setStartIndex] = useState(0)
  
  const relatedProducts = products
    .filter(p => p.category === category && p.id !== currentProductId)
    .slice(0, 8)

  const visibleCount = 4
  const maxStartIndex = Math.max(0, relatedProducts.length - visibleCount)

  const nextSlide = () => {
    setStartIndex(prev => Math.min(prev + 1, maxStartIndex))
  }

  const prevSlide = () => {
    setStartIndex(prev => Math.max(prev - 1, 0))
  }

  if (relatedProducts.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-dark-text">Customers also bought</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={startIndex === 0}
            className="p-2 border border-card-border rounded-full hover:bg-soft-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={startIndex >= maxStartIndex}
            className="p-2 border border-card-border rounded-full hover:bg-soft-gray transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${startIndex * (100 / visibleCount)}%)` }}
        >
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="w-1/4 flex-shrink-0 px-2"
            >
              <Link href={`/products/${product.id}`}>
                <Card hoverable className="h-full">
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                    {product.discount && (
                      <Badge variant="warning" className="absolute top-2 left-2">
                        {product.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-dark-text text-sm mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">SKU: {product.sku}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-brand-600">
                          KES {product.price.toLocaleString()}
                        </span>
                        {product.discount && (
                          <span className="ml-1 text-xs text-gray-400 line-through">
                            KES {(product.price * (1 + product.discount/100)).toFixed(0)}
                          </span>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1"
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to cart logic
                        }}
                      >
                        <FiShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}