// app/cart/page.tsx
/*'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiArrowLeft,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiPercent,
  FiGift,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { useCart } from '@/app/context/CartContext'
import Container from '@/app/components/layout/Container'
import Button from '@/app/components/ui/Button'

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    shipping, 
    total,
    totalItems,
    clearCart
  } = useCart()
  
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [savingForLater, setSavingForLater] = useState<number[]>([])

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  const handleSaveForLater = (id: number) => {
    setSavingForLater([...savingForLater, id])
    removeFromCart(id)
    // In a real app, you'd move to a saved items list
  }

  // Calculate savings if promo applied
  const discount = promoApplied ? subtotal * 0.1 : 0
  const finalTotal = total - discount

  // Group items by category or supplier (example)
  const groupedItems = items.reduce((groups, item) => {
    // This is just a simulation - in real app you'd have categories
    const category = item.id % 2 === 0 ? 'Laboratory Equipment' : 'Consumables'
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
    return groups
  }, {} as Record<string, typeof items>)

  return (
    <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-[var(--white)]">
      
      {/* Decorative Elements *
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--brand-200)] dark:bg-[var(--brand-800)] rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--brand-300)] dark:bg-[var(--brand-700)] rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <Container className="relative z-10">
        {/* Header *
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Continue Shopping</span>
            </Link>
            <div className="w-px h-6 bg-[var(--card-border)]"></div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
                Your
              </span>
              <span className="text-[var(--dark-text)] dark:text-[var(--light-text)]"> Cart</span>
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-3xl opacity-20"></div>
              <div className="relative p-12 bg-white dark:bg-gray-800 rounded-full shadow-2xl">
                <FiShoppingCart className="w-24 h-24 text-[var(--brand-500)] dark:text-[var(--brand-400)]" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
              Your cart is empty
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
              Looks like you haven't added any items to your cart yet. 
              Browse our catalog and discover amazing laboratory supplies!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="px-8">
                  Browse Products
                </Button>
              </Link>
              <Link href="/catalogue">
                <Button variant="outline" size="lg" className="px-8">
                  View Catalogue
                </Button>
              </Link>
            </div>

            {/* Featured Categories *
            <div className="mt-16">
              <h3 className="text-lg font-semibold text-center mb-6">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Lab Equipment', 'Chemicals', 'Glassware', 'Safety Gear'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300 text-center"
                  >
                    <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] group-hover:text-[var(--brand-600)]">
                      {cat}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column *
            <div className="lg:col-span-2 space-y-6">
              {/* Grouped Items *
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  {/* Category Header *
                  <div className="px-6 py-4 bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30 border-b border-[var(--card-border)]">
                    <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                      {category}
                    </h3>
                  </div>

                  {/* Items *
                  <div className="divide-y divide-[var(--card-border)]">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="relative p-6 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300">
                        <div className="flex gap-6">
                          {/* Product Image *
                          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 shadow-md">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          {/* Product Details *
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <h4 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                {item.name}
                              </h4>
                              <p className="text-xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                                KES {item.price.toLocaleString()}
                              </p>
                            </div>

                            {/* Stock Status *
                            <div className="flex items-center gap-2 mb-4">
                              {item.maxStock ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                  <FiCheckCircle className="w-3 h-3" />
                                  In Stock
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                                  <FiClock className="w-3 h-3" />
                                  Low Stock
                                </span>
                              )}
                            </div>

                            {/* Actions *
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls *
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-900)] transition-all duration-300 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium text-lg">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-900)] transition-all duration-300"
                                  disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleSaveForLater(item.id)}
                                  className="text-sm text-gray-500 hover:text-[var(--brand-600)] dark:text-gray-400 dark:hover:text-[var(--brand-400)] transition-colors duration-300"
                                >
                                  Save for later
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item Total *
                        <div className="absolute top-6 right-6 text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Item Total</p>
                          <p className="text-lg font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Promo Code Section *
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FiPercent className="w-5 h-5 text-[var(--brand-500)]" />
                  Have a promo code?
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (try WELCOME10)"
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                  />
                  <Button
                    variant="primary"
                    onClick={handleApplyPromo}
                    className="px-6"
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="mt-2 text-sm text-red-500">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
                    <FiCheckCircle className="w-4 h-4" />
                    10% discount applied!
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary - Right Column *
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card *
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Subtotal *
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">KES {subtotal.toLocaleString()}</span>
                    </div>

                    {/* Discount if applied *
                    {promoApplied && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Discount (10%)</span>
                        <span className="text-green-600 font-medium">-KES {discount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Tax *
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (16% VAT)</span>
                      <span className="font-medium">KES {tax.toLocaleString()}</span>
                    </div>

                    {/* Shipping *
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className={cn(
                        "font-medium",
                        shipping === 0 ? "text-green-600" : ""
                      )}>
                        {shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    {/* Free shipping progress *
                    {subtotal < 50000 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTruck className="w-4 h-4 text-[var(--brand-500)]" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Add KES {(50000 - subtotal).toLocaleString()} more for free shipping
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 50000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Total *
                    <div className="border-t border-[var(--card-border)] pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold">Total</span>
                        <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                          KES {(promoApplied ? finalTotal : total).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        Inclusive of all taxes
                      </p>
                    </div>

                    {/* Checkout Button *
                    <Link href="/checkout">
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        className="mt-4 group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </Link>

                    {/* Payment Methods *
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                          <span className="text-white text-xs font-bold">MP</span>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                          <span className="text-white text-xs font-bold">VS</span>
                        </div>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">+ more</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges *
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                  <h4 className="font-semibold mb-4">Why shop with us?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiTruck className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium">Free Shipping</p>
                        <p className="text-xs text-gray-500">On orders over KES 50,000</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiShield className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium">Secure Payments</p>
                        <p className="text-xs text-gray-500">256-bit SSL encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiCreditCard className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium">Easy Returns</p>
                        <p className="text-xs text-gray-500">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved for Later *
                {savingForLater.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <FiGift className="w-5 h-5 text-[var(--brand-500)]" />
                      Saved for Later ({savingForLater.length})
                    </h4>
                    {/* In a real app, you'd show saved items here *
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}*/

// app/cart/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiArrowLeft,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiPercent,
  FiGift,
  FiCheckCircle,
  FiClock,
  FiImage
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { useCart } from '@/app/context/CartContext'
import Container from '@/app/components/layout/Container'
import Button from '@/app/components/ui/Button'

// Cart item image component with error handling
function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError ? placeholderImage : src

  return (
    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[var(--soft-gray)] shadow-md">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="96px"
        className={cn(
          'transition-all duration-300',
          imageError ? 'object-contain p-4 opacity-60' : 'object-cover'
        )}
        onError={() => {
          console.log(`Cart page image failed: ${alt}, switching to placeholder`)
          setImageError(true)
        }}
        unoptimized={imageError}
      />
      
      {/* Placeholder icon overlay */}
      {/*{imageError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FiImage className="w-8 h-8 text-[var(--card-border)]" />
        </div>
      )}*/}
    </div>
  )
}

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    shipping, 
    total,
    totalItems,
    clearCart
  } = useCart()
  
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [savingForLater, setSavingForLater] = useState<number[]>([])

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true)
      setPromoError('')
    } else {
      setPromoError('Invalid promo code')
    }
  }

  const handleSaveForLater = (id: number) => {
    setSavingForLater([...savingForLater, id])
    removeFromCart(id)
    // In a real app, you'd move to a saved items list
  }

  // Calculate savings if promo applied
  const discount = promoApplied ? subtotal * 0.1 : 0
  const finalTotal = total - discount

  // Group items by category or supplier (example)
  const groupedItems = items.reduce((groups, item) => {
    // This is just a simulation - in real app you'd have categories
    const category = item.id % 2 === 0 ? 'Laboratory Equipment' : 'Consumables'
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
    return groups
  }, {} as Record<string, typeof items>)

  return (
    <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-[var(--soft-gray)] to-[var(--white)] dark:from-[var(--dark-text)] dark:to-[var(--white)]">
      


      <Container className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="group flex items-center gap-2 text-[var(--card-border)] hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
            >
              <FiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Continue Shopping</span>
            </Link>
            <div className="w-px h-6 bg-[var(--card-border)]"></div>
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
                Your
              </span>
              <span className="text-[var(--dark-text)] dark:text-[var(--light-text)]"> Cart</span>
            </h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300"
            >
              <FiTrash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {items.length === 0 ? (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-3xl opacity-20"></div>
              <div className="relative p-12 bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-full shadow-2xl">
                <FiShoppingCart className="w-24 h-24 text-[var(--brand-500)] dark:text-[var(--brand-400)]" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-4">
              Your cart is empty
            </h2>
            
            <p className="text-[var(--card-border)] dark:text-[var(--card-border)] text-center max-w-md mb-8">
              Looks like you haven't added any items to your cart yet. 
              Browse our catalog and discover amazing laboratory supplies!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button variant="primary" size="lg" className="px-8">
                  Browse Products
                </Button>
              </Link>
              <Link href="/catalogue">
                <Button variant="outline" size="lg" className="px-8">
                  View Catalogue
                </Button>
              </Link>
            </div>

            {/* Featured Categories */}
            <div className="mt-16">
              <h3 className="text-lg font-semibold text-center mb-6 text-[var(--dark-text)] dark:text-[var(--light-text)]">Popular Categories</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Lab Equipment', 'Chemicals', 'Glassware', 'Safety Gear'].map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${cat.toLowerCase()}`}
                    className="group p-4 bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-xl border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300 text-center"
                  >
                    <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)] group-hover:text-[var(--brand-600)]">
                      {cat}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Grouped Items */}
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category} className="bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  {/* Category Header */}
                  <div className="px-6 py-4 bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30 border-b border-[var(--card-border)]">
                    <h3 className="font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                      {category}
                    </h3>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-[var(--card-border)]">
                    {categoryItems.map((item) => (
                      <div key={item.id} className="relative p-6 group hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-800)]/50 transition-all duration-300">
                        <div className="flex gap-6">
                          {/* Product Image */}
                          <CartItemImage src={item.image} alt={item.name} />

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <h4 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                {item.name}
                              </h4>
                              <p className="text-xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                                KES {item.price.toLocaleString()}
                              </p>
                            </div>

                            {/* Stock Status */}
                            <div className="flex items-center gap-2 mb-4">
                              {item.maxStock ? (
                                <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                                  <FiCheckCircle className="w-3 h-3" />
                                  In Stock
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
                                  <FiClock className="w-3 h-3" />
                                  Low Stock
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-700)] rounded-lg hover:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-900)] transition-all duration-300 disabled:opacity-50"
                                  disabled={item.quantity <= 1}
                                >
                                  <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-12 text-center font-medium text-lg text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-700)] rounded-lg hover:bg-[var(--brand-100)] dark:hover:bg-[var(--brand-900)] transition-all duration-300"
                                  disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                                >
                                  <FiPlus className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleSaveForLater(item.id)}
                                  className="text-sm text-[var(--card-border)] hover:text-[var(--brand-600)] dark:text-[var(--card-border)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
                                >
                                  Save for later
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-2 text-[var(--card-border)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="absolute top-6 right-6 text-right">
                          <p className="text-sm text-[var(--card-border)] mb-1">Item Total</p>
                          <p className="text-lg font-bold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                            KES {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Promo Code Section */}
              <div className="bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-[var(--dark-text)] dark:text-[var(--light-text)]">
                  <FiPercent className="w-5 h-5 text-[var(--brand-500)]" />
                  Have a promo code?
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code (try WELCOME10)"
                    className="flex-1 px-4 py-3 bg-[var(--soft-gray)] dark:bg-[var(--brand-700)] border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300 text-[var(--dark-text)] dark:text-[var(--light-text)] placeholder-[var(--card-border)]"
                  />
                  <Button
                    variant="primary"
                    onClick={handleApplyPromo}
                    className="px-6"
                  >
                    Apply
                  </Button>
                </div>
                {promoError && (
                  <p className="mt-2 text-sm text-red-500">{promoError}</p>
                )}
                {promoApplied && (
                  <p className="mt-2 text-sm text-green-500 flex items-center gap-1">
                    <FiCheckCircle className="w-4 h-4" />
                    10% discount applied!
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card */}
                <div className="bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h3 className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">Order Summary</h3>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--card-border)]">Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">KES {subtotal.toLocaleString()}</span>
                    </div>

                    {/* Discount if applied */}
                    {promoApplied && (
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--card-border)]">Discount (10%)</span>
                        <span className="text-green-600 font-medium">-KES {discount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* Tax */}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--card-border)]">Tax (16% VAT)</span>
                      <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">KES {tax.toLocaleString()}</span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--card-border)]">Shipping</span>
                      <span className={cn(
                        "font-medium",
                        shipping === 0 ? "text-green-600" : "text-[var(--dark-text)] dark:text-[var(--light-text)]"
                      )}>
                        {shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}
                      </span>
                    </div>

                    {/* Free shipping progress */}
                    {subtotal < 50000 && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <FiTruck className="w-4 h-4 text-[var(--brand-500)]" />
                          <span className="text-xs text-[var(--card-border)]">
                            Add KES {(50000 - subtotal).toLocaleString()} more for free shipping
                          </span>
                        </div>
                        <div className="h-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-700)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((subtotal / 50000) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Total */}
                    <div className="border-t border-[var(--card-border)] pt-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">Total</span>
                        <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                          KES {(promoApplied ? finalTotal : total).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--card-border)] mt-1 text-right">
                        Inclusive of all taxes
                      </p>
                    </div>

                    {/* Checkout Button */}
                    <Link href="/checkout">
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        className="mt-4 group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Proceed to Checkout
                          <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </Button>
                    </Link>

                    {/* Payment Methods */}
                    <div className="flex items-center justify-center gap-3 pt-4">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ring-2 ring-[var(--white)] dark:ring-[var(--brand-800)]">
                          <span className="text-white text-xs font-bold">MP</span>
                        </div>
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center ring-2 ring-[var(--white)] dark:ring-[var(--brand-800)]">
                          <span className="text-white text-xs font-bold">VS</span>
                        </div>
                        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-[var(--white)] dark:ring-[var(--brand-800)]">
                          <span className="text-white text-xs font-bold">MC</span>
                        </div>
                      </div>
                      <span className="text-xs text-[var(--card-border)]">+ more</span>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                  <h4 className="font-semibold mb-4 text-[var(--dark-text)] dark:text-[var(--light-text)]">Why shop with us?</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiTruck className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">Free Shipping</p>
                        <p className="text-xs text-[var(--card-border)]">On orders over KES 50,000</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiShield className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">Secure Payments</p>
                        <p className="text-xs text-[var(--card-border)]">256-bit SSL encrypted</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                        <FiCreditCard className="w-4 h-4 text-[var(--brand-600)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">Easy Returns</p>
                        <p className="text-xs text-[var(--card-border)]">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved for Later */}
                {savingForLater.length > 0 && (
                  <div className="bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                    <h4 className="font-semibold mb-4 flex items-center gap-2 text-[var(--dark-text)] dark:text-[var(--light-text)]">
                      <FiGift className="w-5 h-5 text-[var(--brand-500)]" />
                      Saved for Later ({savingForLater.length})
                    </h4>
                    {/* In a real app, you'd show saved items here */}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </main>
  )
}