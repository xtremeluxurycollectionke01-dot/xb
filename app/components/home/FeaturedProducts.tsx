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

        {/* Tabs *
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

        {/* Products Grid *
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
}*/

/*'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  FiShoppingCart, 
  FiHeart, 
  FiEye, 
  FiStar,
  FiChevronRight,
  FiTrendingUp,
  FiClock,
  FiGift
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Container from '../layout/Container'
import SectionHeading from '../ui/SectionHeading'
import Button from '../ui/Button'
import { useCart } from '@/app/context/CartContext'
import { toast } from 'react-hot-toast' 

type Product = {
  id: number
  name: string
  price: number
  image: string
  rating: number
  reviewCount: number
  originalPrice?: number
  badge?: 'new' | 'sale' | 'trending'
  inStock: boolean
}

type TabType = 'new' | 'best' | 'sale'

const products: Record<TabType, Product[]> = {
  new: [
    { 
      id: 1, 
      name: 'Digital Microscope 2000x', 
      price: 45000, 
      originalPrice: 52000,
      image: 'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 
      rating: 4.5,
      reviewCount: 128,
      badge: 'new',
      inStock: true
    },
    { 
      id: 2, 
      name: 'Analytical Balance 220g', 
      price: 32000, 
      image: 'https://images.nsplash.com/photo-1581091226033-d5c48150dbaa?w=400', 
      rating: 5,
      reviewCount: 89,
      inStock: true
    },
    { 
      id: 3, 
      name: 'Refrigerated Centrifuge', 
      price: 89000, 
      image: 'https://images.nsplash.com/photo-1581093588401-fbb62a02f120?w=400', 
      rating: 4,
      reviewCount: 42,
      badge: 'trending',
      inStock: true
    },
  ],
  best: [
    { 
      id: 4, 
      name: 'Laboratory Oven 50L', 
      price: 125000, 
      originalPrice: 140000,
      image: 'https://images.nsplash.com/photo-1532094349884-543bc11b234d?w=400', 
      rating: 4.8,
      reviewCount: 256,
      badge: 'trending',
      inStock: true
    },
    { 
      id: 5, 
      name: 'Professional pH Meter', 
      price: 15000, 
      image: 'https://images.nsplash.com/photo-1576086213360-ff97d0d37d2b?w=400', 
      rating: 4.3,
      reviewCount: 167,
      inStock: true
    },
    { 
      id: 6, 
      name: 'Borosilicate Glass Beakers', 
      price: 5500, 
      image: 'https://images.nsplash.com/photo-1497032628192-86f99bcd76bc?w=400', 
      rating: 4.7,
      reviewCount: 312,
      inStock: true
    },
  ],
  sale: [
    { 
      id: 7, 
      name: 'Safety Goggles Anti-Fog', 
      price: 1200, 
      originalPrice: 1800, 
      image: 'https://images.nsplash.com/photo-1532094349884-543bc11b234d?w=400', 
      rating: 4.2,
      reviewCount: 94,
      badge: 'sale',
      inStock: true
    },
    { 
      id: 8, 
      name: 'Premium Lab Coats', 
      price: 2500, 
      originalPrice: 3500, 
      image: 'https://images.nsplash.com/photo-1581091226033-d5c48150dbaa?w=400', 
      rating: 4.6,
      reviewCount: 178,
      badge: 'sale',
      inStock: false
    },
    { 
      id: 9, 
      name: 'Microscope Slides (100pcs)', 
      price: 800, 
      originalPrice: 1200, 
      image: 'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400', 
      rating: 4.4,
      reviewCount: 203,
      badge: 'sale',
      inStock: true
    },
  ],
}

const tabIcons = {
  new: FiClock,
  best: FiTrendingUp,
  sale: FiGift
}

// Product Card Component with its own error state
function ProductCard({ 
  product, 
  hoveredId, 
  setHoveredId, 
  placeholderImage 
}: { 
  product: Product
  hoveredId: number | null
  setHoveredId: (id: number | null) => void
  placeholderImage: string
}) {
  // Track image error state per product
  const [imgError, setImgError] = useState(false)
  
  // Use placeholder if error occurred
  const imageSrc = imgError ? placeholderImage : product.image

  const getBadgeStyles = (badge?: string) => {
    switch(badge) {
      case 'new':
        return 'bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] text-white'
      case 'sale':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white'
      case 'trending':
        return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
      default:
        return ''
    }
  }

  const getBadgeIcon = (badge?: string) => {
    switch(badge) {
      case 'new':
        return <FiClock className="w-3 h-3" />
      case 'sale':
        return <FiGift className="w-3 h-3" />
      case 'trending':
        return <FiTrendingUp className="w-3 h-3" />
      default:
        return null
    }
  }


  const { addToCart } = useCart()

  const handleAddToCart = () => {
  addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    maxStock: product.inStock ? 10 : 0 // Example max stock
  })
  
  // Show success toast
  toast.success(`${product.name} added to cart!`, {
    duration: 3000,
    position: 'top-right',
    icon: '🛒',
    style: {
      background: 'var(--brand-500)',
      color: 'white',
      borderRadius: '12px',
    }
  })
}

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Card Container with Glow Effect *
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
      
      {/* Main Card *
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[var(--card-border)] hover:border-[var(--brand-200)] dark:hover:border-[var(--brand-700)]">
        
        {/* Image Container *
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={cn(
              "object-cover transition-transform duration-700 group-hover:scale-110",
              hoveredId === product.id && "scale-110",
              imgError && "object-contain p-8 opacity-50" // Style placeholder differently
            )}
            onError={() => {
              console.log(`Image failed for ${product.name}, switching to placeholder`)
              setImgError(true)
            }}
            unoptimized={imgError} // Disable optimization for placeholder
          />

          {/* Overlay Gradient *
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges *
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5",
                getBadgeStyles(product.badge)
              )}>
                {getBadgeIcon(product.badge)}
                {product.badge === 'new' && 'New Arrival'}
                {product.badge === 'sale' && `Save ${Math.round((1 - product.price / (product.originalPrice || product.price)) * 100)}%`}
                {product.badge === 'trending' && 'Trending'}
              </span>
            )}
            
            {!product.inStock && (
              <span className="px-3 py-1.5 bg-gray-900/90 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Quick Action Buttons *
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn">
              <FiHeart className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-[var(--brand-500)] transition-colors" />
            </button>
            <button className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn">
              <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-[var(--brand-500)] transition-colors" />
            </button>
          </div>

          {/* Quick View - Appears on Hover *
          <div className={cn(
            "absolute inset-x-4 bottom-4 transition-all duration-500 transform",
            hoveredId === product.id
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          )}>
            <button className="w-full py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[var(--brand-500)] hover:text-white transition-all duration-300 border border-[var(--card-border)]">
              Quick View
            </button>
          </div>
        </div>

        {/* Content *
        <div className="p-5">
          {/* Product Name *
          <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2 line-clamp-1">
            {product.name}
          </h3>

          {/* Rating *
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={cn(
                    "w-4 h-4",
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price *
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                KES {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through dark:text-gray-500">
                  KES {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            {/* Stock Status *
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              product.inStock
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            )}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button *
          {/*<Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={!product.inStock}
            className={cn(
              "group/btn relative overflow-hidden transition-all duration-300",
              product.inStock && "hover:shadow-lg transform hover:-translate-y-0.5"
            )}
          >
            <span className="relative z-10 flex items-center justify-center">
              <FiShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </span>
            {product.inStock && (
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            )}
          </Button>*
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className={cn(
              "group/btn relative overflow-hidden transition-all duration-300",
              product.inStock && "hover:shadow-lg transform hover:-translate-y-0.5"
            )}
          >
            <span className="relative z-10 flex items-center justify-center">
              <FiShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </span>
            {product.inStock && (
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            )}
          </Button>
        </div>

        {/* Decorative Corner *
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] w-28 h-28 -top-14 -right-14 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabType>('new')
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  const placeholderImage = '/images/placeholder.png'

  const tabs = [
    { id: 'new', label: 'New Arrivals', icon: tabIcons.new },
    { id: 'best', label: 'Best Sellers', icon: tabIcons.best },
    { id: 'sale', label: 'Special Offers', icon: tabIcons.sale },
  ]

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-[var(--white)]">

      {/* Grid Pattern Overlay *
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--brand-500) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <Container className="relative z-10">
        {/* Header with Decorative Line *
        <div className="text-center mb-12">
          <div className="inline-block relative">
            {/* Glow Effect *
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-2xl opacity-30"></div>
            
            {/* Badge *
            <div className="relative mb-4 inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-full border border-[var(--brand-200)] dark:border-[var(--brand-700)] shadow-sm">
              <span className="text-sm font-medium text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                Scientific Excellence
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
              Featured
            </span>
            <span className="text-[var(--dark-text)] dark:text-[var(--light-text)]"> Products</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular laboratory supplies and equipment, 
            trusted by researchers and institutions across East Africa
          </p>

          {/* Decorative Line *
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Tabs *
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)]">
            {/* Animated Background *
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-2xl opacity-50"></div>
            
            {/* Tabs *
            <div className="relative flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={cn(
                      'group relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 flex items-center gap-2',
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)]'
                    )}
                  >
                    {/* Active Background *
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] rounded-xl shadow-lg animate-gradient"></span>
                    )}
                    
                    {/* Content *
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isActive ? "animate-pulse" : "group-hover:scale-110"
                      )} />
                      {tab.label}
                    </span>

                    {/* Glow Effect on Hover *
                    <span className={cn(
                      "absolute inset-0 rounded-xl transition-opacity duration-300",
                      !isActive && "opacity-0 group-hover:opacity-100 bg-[var(--brand-50)] dark:bg-[var(--brand-900)]"
                    )}></span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Products Grid - 6 products total *
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products[activeTab].map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
              placeholderImage={placeholderImage}
            />
          ))}
        </div>

        {/* View All Link *
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>View All Products</span>
            <FiChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            
            {/* Glow Effect *
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          </Link>
        </div>

        {/* Trust Badges *
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Free Shipping', desc: 'On orders over KES 50,000' },
            { label: '100% Authentic', desc: 'Genuine products guaranteed' },
            { label: 'Secure Payment', desc: 'Multiple payment options' },
            { label: '24/7 Support', desc: 'Dedicated customer service' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-[var(--card-border)] text-center">
                <p className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}*/


'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  FiShoppingCart, 
  FiHeart, 
  FiEye, 
  FiStar,
  FiChevronRight,
  FiTrendingUp,
  FiClock,
  FiGift
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import Container from '../layout/Container'
import Button from '../ui/Button'
import { useCart } from '@/app/context/CartContext'
import { toast } from 'react-hot-toast'
import { featuredProductsService, FeaturedTabType } from '@/app/lib/buiness/featured-products.service'
import { type Product } from '@/app/lib/models/product.model'
import { productService } from '@/app/lib/buiness/product.service'

type TabConfig = {
  id: FeaturedTabType
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const tabs: TabConfig[] = [
  { id: 'new', label: 'New Arrivals', icon: FiClock },
  { id: 'best', label: 'Best Sellers', icon: FiTrendingUp },
  { id: 'sale', label: 'Special Offers', icon: FiGift },
]

// Product Card Component
function FeaturedProductCard({ 
  product, 
  hoveredId, 
  setHoveredId, 
  placeholderImage 
}: { 
  product: Product
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
  placeholderImage: string
}) {
  const [imgError, setImgError] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { addToCart } = useCart()
  
  const imageSrc = imgError || !product.images?.length 
    ? placeholderImage 
    : product.images[0]

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0

  const getBadgeInfo = () => {
    if (product.isNewArrival) {
      return { label: 'New Arrival', icon: FiClock, styles: 'bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] text-white' }
    }
    if (product.isBestSeller) {
      return { label: 'Best Seller', icon: FiTrendingUp, styles: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' }
    }
    if (product.isSpecialOffer || discountPercentage > 0) {
      return { label: `${discountPercentage}% OFF`, icon: FiGift, styles: 'bg-gradient-to-r from-red-500 to-red-600 text-white' }
    }
    return null
  }

  const badgeInfo = getBadgeInfo()
  const BadgeIcon = badgeInfo?.icon

  /*const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (product.stockStatus === 'out-of-stock') {
      toast.error(`${product.name} is out of stock`, {
        duration: 3000,
        position: 'top-right',
      })
      return
    }
    
    addToCart({
      id: parseInt(product.id) || 0,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || placeholderImage,
      maxStock: product.stockQuantity,
      sku: product.sku
    })
    
    toast.success(`${product.name} added to cart!`, {
      duration: 3000,
      position: 'top-right',
      icon: '🛒',
      style: {
        background: 'var(--brand-500)',
        color: 'white',
        borderRadius: '12px',
      }
    })
  }*/

    // In FeaturedProducts component, update the handleAddToCart function:
const handleAddToCart = (e: React.MouseEvent) => {
  e.preventDefault()
  
  if (product.stockStatus === 'out-of-stock') {
    toast.error(`${product.name} is out of stock`, {
      duration: 3000,
      position: 'top-right',
    })
    return
  }
  
  // Fix: Pass ID as string consistently
  addToCart({
    id: product.id,  // Use string directly, don't parse to number
    name: product.name,
    price: product.price,
    image: product.images?.[0] || placeholderImage,
    maxStock: product.stockQuantity,
    sku: product.sku
  })
  
  toast.success(`${product.name} added to cart!`, {
    duration: 3000,
    position: 'top-right',
    icon: '🛒',
    style: {
      background: 'var(--brand-500)',
      color: 'white',
      borderRadius: '12px',
    }
  })
}

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    // Implement quick view modal here
    console.log('Quick view:', product.id)
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 2000,
      position: 'top-right',
    })
  }

  const handleAddToRecentlyViewed = () => {
    productService.addToRecentlyViewed(product.id)
  }

  return (
    <div
      className="group relative"
      onMouseEnter={() => setHoveredId(product.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Card Container with Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-2xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
      
      {/* Main Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-[var(--card-border)] hover:border-[var(--brand-200)] dark:hover:border-[var(--brand-700)]">
        
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          <Link href={`/products/${product.id}`} onClick={handleAddToRecentlyViewed}>
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={cn(
                "object-cover transition-transform duration-700 group-hover:scale-110",
                hoveredId === product.id && "scale-110",
                imgError && "object-contain p-8 opacity-50"
              )}
              onError={() => setImgError(true)}
              unoptimized={imgError}
            />
          </Link>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {badgeInfo && (
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1.5",
                badgeInfo.styles
              )}>
                {BadgeIcon && <BadgeIcon className="w-3 h-3" />}
                {badgeInfo.label}
              </span>
            )}
            
            {product.stockStatus === 'out-of-stock' && (
              <span className="px-3 py-1.5 bg-gray-900/90 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                Out of Stock
              </span>
            )}
            
            {product.stockStatus === 'low-stock' && (
              <span className="px-3 py-1.5 bg-yellow-500/90 text-white rounded-full text-xs font-medium backdrop-blur-sm">
                Low Stock ({product.stockQuantity} left)
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button 
              onClick={handleAddToWishlist}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn"
            >
              <FiHeart className={cn(
                "w-4 h-4 transition-colors",
                isLiked 
                  ? "fill-red-500 text-red-500" 
                  : "text-gray-600 dark:text-gray-400 group-hover/btn:text-[var(--brand-500)]"
              )} />
            </button>
            <button 
              onClick={handleQuickView}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group/btn"
            >
              <FiEye className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover/btn:text-[var(--brand-500)] transition-colors" />
            </button>
          </div>

          {/* Quick View - Appears on Hover */}
          <div className={cn(
            "absolute inset-x-4 bottom-4 transition-all duration-500 transform",
            hoveredId === product.id
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          )}>
            <button 
              onClick={handleQuickView}
              className="w-full py-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-[var(--brand-500)] hover:text-white transition-all duration-300 border border-[var(--card-border)]"
            >
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* SKU */}
          <p className="text-xs text-gray-500 mb-1">SKU: {product.sku}</p>

          {/* Product Name */}
          <Link href={`/products/${product.id}`} onClick={handleAddToRecentlyViewed}>
            <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2 line-clamp-2 hover:text-[var(--brand-600)] transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating !== undefined && product.reviewCount !== undefined && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                KES {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-400 line-through dark:text-gray-500">
                  KES {product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-gray-500 ml-1">/{product.unit || 'piece'}</span>
            </div>
            
            {/* Stock Status Badge */}
            <span className={cn(
              "text-xs px-2 py-1 rounded-full",
              product.stockStatus === 'in-stock'
                ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                : product.stockStatus === 'low-stock'
                ? "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            )}>
              {product.stockStatus === 'in-stock' && 'In Stock'}
              {product.stockStatus === 'low-stock' && 'Low Stock'}
              {product.stockStatus === 'out-of-stock' && 'Out of Stock'}
            </span>
          </div>

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="sm"
            fullWidth
            disabled={product.stockStatus === 'out-of-stock'}
            onClick={handleAddToCart}
            className={cn(
              "group/btn relative overflow-hidden transition-all duration-300",
              product.stockStatus !== 'out-of-stock' && "hover:shadow-lg transform hover:-translate-y-0.5"
            )}
          >
            <span className="relative z-10 flex items-center justify-center">
              <FiShoppingCart className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
              {product.stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
            </span>
            {product.stockStatus !== 'out-of-stock' && (
              <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            )}
          </Button>
          
          {/* Request Quote Link */}
          <div className="text-center mt-3">
            <Link
              href={`/products/${product.id}#quote`}
              className="text-xs text-[var(--brand-600)] hover:text-[var(--brand-700)] dark:text-[var(--brand-400)]"
            >
              Request Quote for Bulk Order
            </Link>
          </div>
        </div>

        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] w-28 h-28 -top-14 -right-14 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<FeaturedTabType>('new')
  const [products, setProducts] = useState<Product[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const placeholderImage = '/images/placeholder.png'

  const fetchProducts = useCallback(async (tab: FeaturedTabType) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await featuredProductsService.getFeaturedProducts(tab, 6)
      setProducts(data)
    } catch (err) {
      console.error('Error fetching featured products:', err)
      setError('Failed to load products. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts(activeTab)
  }, [activeTab, fetchProducts])

  const handleTabChange = (tab: FeaturedTabType) => {
    setActiveTab(tab)
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-[var(--white)]">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--brand-500) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <Container className="relative z-10">
        {/* Header with Decorative Line */}
        <div className="text-center mb-12">
          <div className="inline-block relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-2xl opacity-30"></div>
            
            {/* Badge */}
            <div className="relative mb-4 inline-flex items-center px-4 py-1.5 bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-full border border-[var(--brand-200)] dark:border-[var(--brand-700)] shadow-sm">
              <span className="text-sm font-medium text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                Scientific Excellence
              </span>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
              Featured
            </span>
            <span className="text-[var(--dark-text)] dark:text-[var(--light-text)]"> Products</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our most popular laboratory supplies and equipment, 
            trusted by researchers and institutions across East Africa
          </p>

          {/* Decorative Line */}
          <div className="flex justify-center mt-6">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex justify-center mb-12">
          <div className="relative inline-flex p-1.5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)]">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-2xl opacity-50"></div>
            
            {/* Tabs */}
            <div className="relative flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    disabled={isLoading}
                    className={cn(
                      'group relative px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 flex items-center gap-2',
                      isActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)]',
                      isLoading && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {/* Active Background */}
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] rounded-xl shadow-lg animate-gradient"></span>
                    )}
                    
                    {/* Content */}
                    <span className="relative z-10 flex items-center gap-2">
                      <Icon className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        isActive ? "animate-pulse" : "group-hover:scale-110"
                      )} />
                      {tab.label}
                    </span>

                    {/* Glow Effect on Hover */}
                    <span className={cn(
                      "absolute inset-0 rounded-xl transition-opacity duration-300",
                      !isActive && "opacity-0 group-hover:opacity-100 bg-[var(--brand-50)] dark:bg-[var(--brand-900)]"
                    )}></span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-96">
            <div className="relative">
              {/* Background spinner */}
              <div className="w-16 h-16 rounded-full border-4 border-gray-200"></div>
              {/* Foreground spinner */}
              <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md mx-auto">
              <p className="text-lg font-semibold mb-2">Oops! Something went wrong</p>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={() => fetchProducts(activeTab)} 
                variant="primary"
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <FeaturedProductCard
                    key={product.id}
                    product={product}
                    hoveredId={hoveredId}
                    setHoveredId={setHoveredId}
                    placeholderImage={placeholderImage}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link 
            href="/products" 
            className="group relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>View All Products</span>
            <FiChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-500)] rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { label: 'Free Shipping', desc: 'On orders over KES 50,000' },
            { label: '100% Authentic', desc: 'Genuine products guaranteed' },
            { label: 'Secure Payment', desc: 'Multiple payment options' },
            { label: '24/7 Support', desc: 'Dedicated customer service' }
          ].map((item, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
              <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg border border-[var(--card-border)] text-center">
                <p className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">{item.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}