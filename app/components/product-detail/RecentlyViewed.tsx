'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiEye } from 'react-icons/fi'
import { type Product, getRecentlyViewed } from '@/app/lib/products-data'
import Card from '../ui/Card'

export default function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])

  useEffect(() => {
    setRecentProducts(getRecentlyViewed())
  }, [])

  if (recentProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-dark-text mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {recentProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card hoverable className="h-full">
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="text-xs font-medium text-dark-text line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-xs text-brand-600 mt-1">
                  KES {product.price.toLocaleString()}
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}