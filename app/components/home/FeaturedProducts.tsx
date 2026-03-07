/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '@/app/lib/utils'

type Product = {
  id: number
  name: string
  price: number
  image: string
  rating: number
  originalPrice?: number // 👈 optional
}
const products: Record<TabType, Product[]> = {
  new: [
    {
      id: 1,
      name: 'Digital Microscope',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      rating: 4.5,
    },
    {
      id: 2,
      name: 'Analytical Balance',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
      rating: 5,
    },
    {
      id: 3,
      name: 'Centrifuge Machine',
      price: 89000,
      image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400',
      rating: 4,
    },
  ],
  best: [
    {
      id: 4,
      name: 'Laboratory Oven',
      price: 125000,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      rating: 4.8,
    },
    {
      id: 5,
      name: 'pH Meter',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
      rating: 4.3,
    },
    {
      id: 6,
      name: 'Glass Beakers Set',
      price: 5500,
      image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
      rating: 4.7,
    },
  ],
  sale: [
    {
      id: 7,
      name: 'Safety Goggles',
      price: 1200,
      originalPrice: 1800,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
      rating: 4.2,
    },
    {
      id: 8,
      name: 'Lab Coats',
      price: 2500,
      originalPrice: 3500,
      image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
      rating: 4.6,
    },
    {
      id: 9,
      name: 'Microscope Slides',
      price: 800,
      originalPrice: 1200,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      rating: 4.4,
    },
  ],
}

type TabType = 'new' | 'best' | 'sale'

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('new')

  const tabs = [
    { id: 'new', label: 'New Arrivals' },
    { id: 'best', label: 'Best Sellers' },
    { id: 'sale', label: 'On Sale' },
  ]

  return (
    <section className="section-padding bg-soft-gray">
      <Container>
        <SectionHeading
          title="Featured Products"
          subtitle="Discover our most popular laboratory supplies"
        />

        {/* Tabs *
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-card-border p-1 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'px-6 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-500 text-white'
                    : 'text-gray-600 hover:text-brand-600'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products[activeTab].map((product) => (
            <Card key={product.id} hoverable className="group">
              <div className="relative aspect-square">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-danger text-white text-xs px-2 py-1 rounded">
                    Sale
                  </span>
                )}
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiHeart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-dark-text mb-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-brand-600">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        KES {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                
                <Button variant="primary" size="sm" fullWidth>
                  <FiShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}*/

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FiShoppingCart, FiHeart } from 'react-icons/fi'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { cn } from '@/app/lib/utils'

type Product = {
  id: number
  name: string
  price: number
  image: string
  rating: number
  originalPrice?: number
}

type TabType = 'new' | 'best' | 'sale'

const products: Record<TabType, Product[]> = {
  new: [
    { id: 1, name: 'Digital Microscope', price: 45000, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.5 },
    { id: 2, name: 'Analytical Balance', price: 32000, image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400', rating: 5 },
    { id: 3, name: 'Centrifuge Machine', price: 89000, image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400', rating: 4 },
  ],
  best: [
    { id: 4, name: 'Laboratory Oven', price: 125000, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', rating: 4.8 },
    { id: 5, name: 'pH Meter', price: 15000, image: 'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400', rating: 4.3 },
    { id: 6, name: 'Glass Beakers Set', price: 5500, image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400', rating: 4.7 },
  ],
  sale: [
    { id: 7, name: 'Safety Goggles', price: 1200, originalPrice: 1800, image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400', rating: 4.2 },
    { id: 8, name: 'Lab Coats', price: 2500, originalPrice: 3500, image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400', rating: 4.6 },
    { id: 9, name: 'Microscope Slides', price: 800, originalPrice: 1200, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400', rating: 4.4 },
  ],
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('new')

  const tabs = [
    { id: 'new', label: 'New Arrivals' },
    { id: 'best', label: 'Best Sellers' },
    { id: 'sale', label: 'On Sale' },
  ]

  return (
    <section className="section-padding bg-[var(--soft-gray)] dark:bg-[var(--dark-text)]">
      <Container>
        <SectionHeading
          title="Featured Products"
          subtitle="Discover our most popular laboratory supplies"
        />

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-card-border p-1 bg-white dark:bg-slate-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={cn(
                  'px-6 py-2 text-sm font-medium rounded-md transition-all',
                  activeTab === tab.id
                    ? 'bg-[var(--brand-500)] text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-[var(--brand-600)]'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products[activeTab].map((product) => (
            <Card key={product.id} hoverable className="group">
              <div className="relative aspect-square">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
                
                {product.originalPrice && (
                  <span className="absolute top-2 left-2 bg-[var(--danger)] text-white text-xs px-2 py-1 rounded">
                    Sale
                  </span>
                )}

                <button className="absolute top-2 right-2 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity dark:bg-slate-700">
                  <FiHeart className="w-4 h-4 text-[var(--brand-600)]" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-lg font-bold text-[var(--brand-600)]">
                      KES {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through dark:text-gray-500">
                        KES {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-500'
                        )}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <Button variant="primary" size="sm" fullWidth>
                  <FiShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  )
}