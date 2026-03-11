// app/components/cart/CartDrawer.tsx
/*'use client'

import { Fragment, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { 
  FiX, 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiCreditCard
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { useCart } from '@/app/context/CartContext'
import Button from '../ui/Button'

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    shipping, 
    total,
    totalItems
  } = useCart()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  return (
    <Transition show={isCartOpen} as={Fragment}>
      <Dialog onClose={() => setIsCartOpen(false)} className="relative z-[100]">
        {/* Backdrop *
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Cart Panel *
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white dark:bg-gray-900 shadow-2xl">
                    
                    {/* Header *
                    <div className="relative flex-1 overflow-y-auto">
                      <div className="sticky top-0 z-10 bg-gradient-to-b from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur opacity-30"></div>
                              <div className="relative p-2 bg-[var(--brand-100)] dark:bg-[var(--brand-800)] rounded-xl">
                                <FiShoppingCart className="w-5 h-5 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
                              </div>
                            </div>
                            <Dialog.Title className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              Shopping Cart
                            </Dialog.Title>
                          </div>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Cart Summary Badge *
                        {totalItems > 0 && (
                          <div className="px-6 pb-4">
                            <div className="bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-xl p-3 border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
                              <p className="text-sm text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                                You have <span className="font-bold">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in your cart
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cart Items *
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
                          <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-2xl opacity-20"></div>
                            <div className="relative p-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                              <FiShoppingBag className="w-16 h-16 text-[var(--brand-500)] dark:text-[var(--brand-400)]" />
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
                            Looks like you haven't added any items to your cart yet.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => setIsCartOpen(false)}
                            className="px-8"
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      ) : (
                        <div className="px-6 py-4 space-y-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="group relative bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-[var(--card-border)] hover:border-[var(--brand-200)] dark:hover:border-[var(--brand-700)] transition-all duration-300"
                            >
                              <div className="flex gap-4">
                                {/* Product Image *
                                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white dark:bg-gray-700">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>

                                {/* Product Details *
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-1 line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <p className="text-lg font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)] mb-2">
                                    KES {item.price.toLocaleString()}
                                  </p>

                                  {/* Quantity Controls *
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="p-1.5 bg-white dark:bg-gray-700 rounded-lg border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300 disabled:opacity-50"
                                      disabled={item.quantity <= 1}
                                    >
                                      <FiMinus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="p-1.5 bg-white dark:bg-gray-700 rounded-lg border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300"
                                      disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                                    >
                                      <FiPlus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Remove Button *
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer with Summary *
                    {items.length > 0 && (
                      <div className="border-t border-[var(--card-border)] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                        {/* Shipping Progress *
                        {subtotal < 50000 && (
                          <div className="px-6 pt-4">
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

                        {/* Price Breakdown *
                        <div className="px-6 py-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              KES {subtotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tax (16% VAT)</span>
                            <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              KES {tax.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                            <span className={cn(
                              "font-medium",
                              shipping === 0 ? "text-green-600" : "text-[var(--dark-text)] dark:text-[var(--light-text)]"
                            )}>
                              {shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="border-t border-[var(--card-border)] pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                Total
                              </span>
                              <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                                KES {total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Checkout Buttons *
                        <div className="px-6 pb-6 space-y-3">
                        {/* Cart Actions *
                        <div className="space-y-4">
                          {/* View Cart *
                          <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                            <Button
                              variant="outline"
                              fullWidth
                              size="lg"
                              className="group"
                            >
                              <span className="flex items-center justify-center gap-2">
                                View Cart
                                <FiShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              </span>
                            </Button>
                          </Link>

                          {/* Checkout *
                          <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                            <Button
                              variant="primary"
                              fullWidth
                              size="lg"
                              className="group relative overflow-hidden"
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                Proceed to Checkout
                                <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </span>
                            </Button>
                          </Link>
                        </div>

                        {/* Continue Shopping *
                        <div className="mt-4">
                            <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full py-3 text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
                            >
                            Continue Shopping
                            </button>
                        </div>
                          {/* Trust Badges *
                          <div className="flex items-center justify-center gap-4 pt-4">
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FiShield className="w-3 h-3" />
                              <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <FiCreditCard className="w-3 h-3" />
                              <span>SSL Encrypted</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}*/


// app/components/cart/CartDrawer.tsx
'use client'

import { Fragment, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Transition } from '@headlessui/react'
import { 
  FiX, 
  FiShoppingCart, 
  FiTrash2, 
  FiPlus, 
  FiMinus,
  FiArrowRight,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiCreditCard,
  FiImage
} from 'react-icons/fi'
import { cn } from '@/app/lib/utils'
import { useCart } from '@/app/context/CartContext'
import Button from '../ui/Button'

// Cart item image component with error handling
function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false)
  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError ? placeholderImage : src

  return (
    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[var(--soft-gray)]">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="80px"
        className={cn(
          'transition-all duration-300',
          imageError ? 'object-contain p-4 opacity-60' : 'object-cover'
        )}
        onError={() => {
          console.log(`Cart image failed: ${alt}, switching to placeholder`)
          setImageError(true)
        }}
        unoptimized={imageError}
      />
      
      {/* Placeholder icon overlay */}
      {/*{imageError && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FiImage className="w-6 h-6 text-[var(--card-border)]" />
        </div>
      )}*/}
    </div>
  )
}

export default function CartDrawer() {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    tax, 
    shipping, 
    total,
    totalItems
  } = useCart()

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen])

  return (
    <Transition show={isCartOpen} as={Fragment}>
      <Dialog onClose={() => setIsCartOpen(false)} className="relative z-[100]">
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        {/* Cart Panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-[var(--white)] dark:bg-[var(--brand-900)] shadow-2xl">
                    
                    {/* Header */}
                    <div className="relative flex-1 overflow-y-auto">
                      <div className="sticky top-0 z-10 bg-gradient-to-b from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30 backdrop-blur-sm">
                        <div className="flex items-center justify-between p-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur opacity-30"></div>
                              <div className="relative p-2 bg-[var(--brand-100)] dark:bg-[var(--brand-800)] rounded-xl">
                                <FiShoppingCart className="w-5 h-5 text-[var(--brand-600)] dark:text-[var(--brand-400)]" />
                              </div>
                            </div>
                            <Dialog.Title className="text-lg font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              Shopping Cart
                            </Dialog.Title>
                          </div>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="p-2 text-[var(--card-border)] hover:text-[var(--dark-text)] dark:text-[var(--card-border)] dark:hover:text-[var(--light-text)] hover:bg-[var(--soft-gray)] dark:hover:bg-[var(--brand-800)] rounded-xl transition-all duration-300"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Cart Summary Badge */}
                        {totalItems > 0 && (
                          <div className="px-6 pb-4">
                            <div className="bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-xl p-3 border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
                              <p className="text-sm text-[var(--brand-700)] dark:text-[var(--brand-300)]">
                                You have <span className="font-bold">{totalItems}</span> {totalItems === 1 ? 'item' : 'items'} in your cart
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Cart Items */}
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[60vh] px-6">
                          <div className="relative mb-8">
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-2xl opacity-20"></div>
                            <div className="relative p-8 bg-[var(--soft-gray)] dark:bg-[var(--brand-800)] rounded-full">
                              <FiShoppingBag className="w-16 h-16 text-[var(--brand-500)] dark:text-[var(--brand-400)]" />
                            </div>
                          </div>
                          <h3 className="text-xl font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-[var(--card-border)] dark:text-[var(--card-border)] text-center mb-8">
                            Looks like you haven't added any items to your cart yet.
                          </p>
                          <Button
                            variant="primary"
                            onClick={() => setIsCartOpen(false)}
                            className="px-8"
                          >
                            Continue Shopping
                          </Button>
                        </div>
                      ) : (
                        <div className="px-6 py-4 space-y-4">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="group relative bg-[var(--soft-gray)] dark:bg-[var(--brand-800)]/50 rounded-2xl p-4 border border-[var(--card-border)] hover:border-[var(--brand-200)] dark:hover:border-[var(--brand-700)] transition-all duration-300"
                            >
                              <div className="flex gap-4">
                                {/* Product Image */}
                                <CartItemImage src={item.image} alt={item.name} />

                                {/* Product Details */}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)] mb-1 line-clamp-1">
                                    {item.name}
                                  </h4>
                                  <p className="text-lg font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)] mb-2">
                                    KES {item.price.toLocaleString()}
                                  </p>

                                  {/* Quantity Controls */}
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      className="p-1.5 bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-lg border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300 disabled:opacity-50"
                                      disabled={item.quantity <= 1}
                                    >
                                      <FiMinus className="w-3 h-3" />
                                    </button>
                                    <span className="w-8 text-center text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                      {item.quantity}
                                    </span>
                                    <button
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      className="p-1.5 bg-[var(--white)] dark:bg-[var(--brand-800)] rounded-lg border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300"
                                      disabled={item.maxStock ? item.quantity >= item.maxStock : false}
                                    >
                                      <FiPlus className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="absolute top-2 right-2 p-2 text-[var(--card-border)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer with Summary */}
                    {items.length > 0 && (
                      <div className="border-t border-[var(--card-border)] bg-gradient-to-b from-[var(--white)] to-[var(--soft-gray)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)]">
                        {/* Shipping Progress */}
                        {subtotal < 50000 && (
                          <div className="px-6 pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FiTruck className="w-4 h-4 text-[var(--brand-500)]" />
                              <span className="text-xs text-[var(--card-border)] dark:text-[var(--card-border)]">
                                Add KES {(50000 - subtotal).toLocaleString()} more for free shipping
                              </span>
                            </div>
                            <div className="h-2 bg-[var(--soft-gray)] dark:bg-[var(--brand-800)] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((subtotal / 50000) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="px-6 py-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--card-border)] dark:text-[var(--card-border)]">Subtotal</span>
                            <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              KES {subtotal.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--card-border)] dark:text-[var(--card-border)]">Tax (16% VAT)</span>
                            <span className="font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
                              KES {tax.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-[var(--card-border)] dark:text-[var(--card-border)]">Shipping</span>
                            <span className={cn(
                              "font-medium",
                              shipping === 0 ? "text-green-600" : "text-[var(--dark-text)] dark:text-[var(--light-text)]"
                            )}>
                              {shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}
                            </span>
                          </div>
                          <div className="border-t border-[var(--card-border)] pt-3">
                            <div className="flex justify-between items-center">
                              <span className="text-base font-semibold text-[var(--dark-text)] dark:text-[var(--light-text)]">
                                Total
                              </span>
                              <span className="text-2xl font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                                KES {total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Checkout Buttons */}
                        <div className="px-6 pb-6 space-y-3">
                          {/* Cart Actions */}
                          <div className="space-y-4">
                            {/* View Cart */}
                            <Link href="/cart" onClick={() => setIsCartOpen(false)}>
                              <Button
                                variant="outline"
                                fullWidth
                                size="lg"
                                className="group"
                              >
                                <span className="flex items-center justify-center gap-2">
                                  View Cart
                                  <FiShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                </span>
                              </Button>
                            </Link>

                            {/* Checkout */}
                            <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                              <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                className="group relative overflow-hidden"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                  Proceed to Checkout
                                  <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                              </Button>
                            </Link>
                          </div>
                          
                          {/* Continue Shopping */}
                          <div className="mt-4">
                            <button
                              onClick={() => setIsCartOpen(false)}
                              className="w-full py-3 text-sm text-[var(--card-border)] dark:text-[var(--card-border)] hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
                            >
                              Continue Shopping
                            </button>
                          </div>
                          
                          {/* Trust Badges */}
                          <div className="flex items-center justify-center gap-4 pt-4">
                            <div className="flex items-center gap-1 text-xs text-[var(--card-border)]">
                              <FiShield className="w-3 h-3" />
                              <span>Secure</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-[var(--card-border)]">
                              <FiCreditCard className="w-3 h-3" />
                              <span>SSL Encrypted</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}