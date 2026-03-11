// app/checkout/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  FiArrowLeft,
  FiCheck,
  FiTruck,
  FiCreditCard,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiCalendar,
  FiLock,
  FiShield,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiEdit3,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiHeart,
  FiGift,
  FiPercent,
  FiSmartphone,
  FiHome,
  FiBriefcase
} from 'react-icons/fi'
import { 
  FaCcVisa, 
  FaCcMastercard, 
  FaCcAmex, 
  FaCcDiscover,
  FaPaypal
} from 'react-icons/fa'
import { cn } from '@/app/lib/utils'
import { useCart } from '@/app/context/CartContext'
import Container from '@/app/components/layout/Container'
import Button from '@/app/components/ui/Button'
import { FaMoneyBill1Wave } from 'react-icons/fa6'

function CheckoutItem({ item }: { item: { id: number; name: string; image: string; price: number; quantity: number } }) {
  const [imageError, setImageError] = useState(false)
  const placeholderImage = '/images/placeholder.png'
  const imageSrc = imageError ? placeholderImage : item.image

  return (
    <div className="flex gap-3">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[var(--soft-gray)] flex-shrink-0">
        <Image
          src={imageSrc}
          alt={item.name}
          fill
          sizes="64px"
          className={cn(
            'transition-all duration-300',
            imageError ? 'object-contain p-2 opacity-60' : 'object-cover'
          )}
          onError={() => {
            console.log(`Checkout image failed: ${item.name}, switching to placeholder`)
            setImageError(true)
          }}
          unoptimized={imageError}
        />
        
        {/* Placeholder icon overlay */}
        {/*{imageError && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <FiImage className="w-5 h-5 text-[var(--card-border)]" />
          </div>
        )}*/}
        
        {/* Quantity badge - hidden when placeholder shows */}
        {!imageError && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--brand-500)] text-[var(--white)] text-xs rounded-full flex items-center justify-center">
            {item.quantity}
          </span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-1 text-[var(--dark-text)] dark:text-[var(--light-text)]">
          {item.name}
        </h4>
        <p className="text-sm text-[var(--card-border)]">
          KES {item.price.toLocaleString()}
        </p>
      </div>
      
      <p className="text-sm font-medium text-[var(--dark-text)] dark:text-[var(--light-text)]">
        KES {(item.price * item.quantity).toLocaleString()}
      </p>
    </div>
  )
}

type Step = 'information' | 'shipping' | 'payment'

type Address = {
  id: string
  type: 'home' | 'work' | 'other'
  firstName: string
  lastName: string
  address: string
  apartment?: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

type ShippingMethod = {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: typeof FiTruck
}

type PaymentMethod = {
  id: string
  name: string
  icon: any
  description: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, subtotal, tax, shipping, clearCart } = useCart()
  
  const [currentStep, setCurrentStep] = useState<Step>('information')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  // Form States
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [saveInfo, setSaveInfo] = useState(false)
  const [receiveUpdates, setReceiveUpdates] = useState(false)
  
  // Address States
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Kimathi Street',
      apartment: 'Suite 405',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00100',
      country: 'Kenya',
      phone: '+254 712 345 678',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      firstName: 'John',
      lastName: 'Doe',
      address: '456 Mombasa Road',
      apartment: 'Industrial Area',
      city: 'Nairobi',
      state: 'Nairobi County',
      zipCode: '00200',
      country: 'Kenya',
      phone: '+254 712 345 678',
      isDefault: false
    }
  ])
  
  const [selectedAddressId, setSelectedAddressId] = useState('1')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  
  // Shipping Method States
  const shippingMethods: ShippingMethod[] = [
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Priority handling and express delivery',
      price: 2500,
      estimatedDays: '1-2 business days',
      icon: FiTruck
    },
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Regular delivery to your doorstep',
      price: 1000,
      estimatedDays: '3-5 business days',
      icon: FiPackage
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Pick up from our Nairobi store',
      price: 0,
      estimatedDays: 'Ready in 24 hours',
      icon: FiHome
    }
  ]
  
  const [selectedShipping, setSelectedShipping] = useState('standard')
  
  // Payment Method States
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: FaMoneyBill1Wave,
      description: 'Pay with M-Pesa mobile money'
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: FaCcVisa,
      description: 'Pay with Visa, Mastercard, or American Express'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: FiCreditCard,
      description: 'Direct bank transfer (EFT)'
    }
  ]
  
  const [selectedPayment, setSelectedPayment] = useState('mpesa')
  const [mpesaPhone, setMpesaPhone] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  
  // Promo Code
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoDiscount, setPromoDiscount] = useState(0)
  
  // Order Notes
  const [orderNotes, setOrderNotes] = useState('')
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.push('/cart')
    }
  }, [items, router, orderComplete])
  
  // Generate order number
  useEffect(() => {
    if (orderComplete) {
      const num = 'LCS-' + Math.random().toString(36).substr(2, 9).toUpperCase()
      setOrderNumber(num)
    }
  }, [orderComplete])
  
  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setPromoApplied(true)
      setPromoDiscount(subtotal * 0.1)
    }
  }
  
  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsProcessing(false)
    setOrderComplete(true)
    clearCart()
  }
  
  const steps = [
    { id: 'information', label: 'Information', icon: FiUser },
    { id: 'shipping', label: 'Shipping', icon: FiTruck },
    { id: 'payment', label: 'Payment', icon: FiCreditCard }
  ]
  
  const finalTotal = total - (promoApplied ? promoDiscount : 0)
  const selectedShippingMethod = shippingMethods.find(m => m.id === selectedShipping)
  const selectedAddress = addresses.find(a => a.id === selectedAddressId)
  
  if (orderComplete) {
    return (
      <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-[var(--white)]">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--brand-200)] dark:bg-[var(--brand-800)] rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--brand-300)] dark:bg-[var(--brand-700)] rounded-full filter blur-3xl opacity-20"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* Success Animation */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-400)] to-[var(--brand-600)] rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative w-32 h-32 mx-auto bg-gradient-to-br from-[var(--brand-100)] to-[var(--brand-200)] dark:from-[var(--brand-800)] dark:to-[var(--brand-700)] rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-16 h-16 text-[var(--brand-600)] dark:text-[var(--brand-400)] animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
                Thank You!
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Your order has been placed successfully
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-[var(--card-border)] p-8 mb-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Order Number</p>
              <p className="text-2xl font-mono font-bold text-[var(--brand-600)] dark:text-[var(--brand-400)] mb-4">
                {orderNumber}
              </p>
              
              <div className="h-px bg-gradient-to-r from-transparent via-[var(--brand-400)] to-transparent my-6"></div>
              
              <div className="space-y-3 text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We've sent a confirmation email to <span className="font-semibold">{email}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll receive shipping updates via SMS at <span className="font-semibold">{phone}</span>
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button variant="primary" size="lg" className="px-8">
                  Continue Shopping
                </Button>
              </Link>
              <Link href="/account/orders">
                <Button variant="outline" size="lg" className="px-8">
                  Track Order
                </Button>
              </Link>
            </div>
            
            {/* Recommended Products */}
            <div className="mt-16">
              <h3 className="text-lg font-semibold mb-6">You might also like</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-[var(--card-border)] hover:border-[var(--brand-400)] transition-all duration-300">
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-lg mb-3"></div>
                    <p className="text-sm font-medium mb-1">Product Name</p>
                    <p className="text-sm font-bold text-[var(--brand-600)]">KES 1,200</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>
    )
  }
  
  return (
    <main className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-[var(--soft-gray)] to-white dark:from-[var(--dark-text)] dark:to-[var(--white)]">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--brand-200)] dark:bg-[var(--brand-800)] rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--brand-300)] dark:bg-[var(--brand-700)] rounded-full filter blur-3xl opacity-20"></div>
      </div>
      
      <Container className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/cart"
            className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[var(--brand-600)] dark:hover:text-[var(--brand-400)] transition-colors duration-300"
          >
            <FiArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to Cart</span>
          </Link>
          <div className="w-px h-6 bg-[var(--card-border)]"></div>
          <h1 className="text-2xl md:text-3xl font-bold">
            <span className="bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-700)] dark:from-[var(--brand-400)] dark:to-[var(--brand-200)] bg-clip-text text-transparent">
              Checkout
            </span>
          </h1>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = steps.findIndex(s => s.id === currentStep) > index
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                      isActive && "bg-gradient-to-r from-[var(--brand-500)] to-[var(--brand-600)] text-white shadow-lg scale-110",
                      isCompleted && "bg-[var(--brand-100)] dark:bg-[var(--brand-900)] text-[var(--brand-600)] dark:text-[var(--brand-400)]",
                      !isActive && !isCompleted && "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    )}>
                      {isCompleted ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    
                    {/* Label - hidden on mobile, shown on desktop */}
                    <span className={cn(
                      "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap hidden md:block",
                      isActive ? "text-[var(--brand-600)] font-medium" : "text-gray-500"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-1 mx-2 rounded-full transition-all duration-300",
                      steps.findIndex(s => s.id === currentStep) > index
                        ? "bg-[var(--brand-400)]"
                        : "bg-gray-200 dark:bg-gray-700"
                    )} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1: INFORMATION */}
            {currentStep === 'information' && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="w-6 h-6 bg-[var(--brand-500)] text-white rounded-full flex items-center justify-center text-sm">1</span>
                    Contact Information
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+254 712 345 678"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  </div>
                  
                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={saveInfo}
                        onChange={(e) => setSaveInfo(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-[var(--brand-500)] focus:ring-[var(--brand-500)] transition-all duration-300"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[var(--brand-600)]">
                        Save this information for next time
                      </span>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={receiveUpdates}
                        onChange={(e) => setReceiveUpdates(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-[var(--brand-500)] focus:ring-[var(--brand-500)] transition-all duration-300"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[var(--brand-600)]">
                        Receive order updates via SMS
                      </span>
                    </label>
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex justify-end pt-4">
                    <Button
                      variant="primary"
                      onClick={() => setCurrentStep('shipping')}
                      disabled={!email || !phone}
                      className="px-8"
                    >
                      Continue to Shipping
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {/* STEP 2: SHIPPING */}
            {currentStep === 'shipping' && (
              <div className="space-y-6">
                {/* Shipping Address */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-[var(--brand-500)] text-white rounded-full flex items-center justify-center text-sm">2</span>
                      Shipping Address
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {/* Address List */}
                    <div className="space-y-3 mb-6">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddressId(address.id)}
                          className={cn(
                            "relative p-4 border rounded-xl cursor-pointer transition-all duration-300",
                            selectedAddressId === address.id
                              ? "border-[var(--brand-500)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30 shadow-md"
                              : "border-[var(--card-border)] hover:border-[var(--brand-400)] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "p-2 rounded-lg",
                              address.type === 'home' ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                              address.type === 'work' ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" :
                              "bg-gray-100 dark:bg-gray-700 text-gray-600"
                            )}>
                              {address.type === 'home' && <FiHome className="w-4 h-4" />}
                              {address.type === 'work' && <FiBriefcase className="w-4 h-4" />}
                              {address.type === 'other' && <FiMapPin className="w-4 h-4" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium capitalize">{address.type}</span>
                                {address.isDefault && (
                                  <span className="text-xs bg-[var(--brand-100)] dark:bg-[var(--brand-900)] text-[var(--brand-700)] dark:text-[var(--brand-300)] px-2 py-0.5 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.firstName} {address.lastName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.address}
                                {address.apartment && `, ${address.apartment}`}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.city}, {address.state} {address.zipCode}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {address.country}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {address.phone}
                              </p>
                            </div>
                            
                            {selectedAddressId === address.id && (
                              <div className="absolute top-4 right-4 w-5 h-5 bg-[var(--brand-500)] rounded-full flex items-center justify-center">
                                <FiCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Add New Address Button */}
                    <button
                      onClick={() => {
                        setEditingAddress(null)
                        setShowAddressForm(true)
                      }}
                      className="flex items-center gap-2 text-[var(--brand-600)] hover:text-[var(--brand-700)] font-medium text-sm transition-colors duration-300"
                    >
                      <FiPlus className="w-4 h-4" />
                      Add New Address
                    </button>
                    
                    {/* Address Form Modal */}
                    {showAddressForm && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                          <h3 className="text-lg font-semibold mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                          </h3>
                          
                          <div className="space-y-4">
                            {/* Form fields would go here - simplified for brevity */}
                            <div className="flex gap-4 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => setShowAddressForm(false)}
                                className="flex-1"
                              >
                                Save Address
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Shipping Method */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h2 className="text-lg font-semibold">Shipping Method</h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {shippingMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div
                          key={method.id}
                          onClick={() => setSelectedShipping(method.id)}
                          className={cn(
                            "relative p-4 border rounded-xl cursor-pointer transition-all duration-300",
                            selectedShipping === method.id
                              ? "border-[var(--brand-500)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30 shadow-md"
                              : "border-[var(--card-border)] hover:border-[var(--brand-400)] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "p-3 rounded-lg",
                              selectedShipping === method.id
                                ? "bg-[var(--brand-100)] dark:bg-[var(--brand-800)]"
                                : "bg-gray-100 dark:bg-gray-700"
                            )}>
                              <Icon className={cn(
                                "w-6 h-6",
                                selectedShipping === method.id
                                  ? "text-[var(--brand-600)]"
                                  : "text-gray-600 dark:text-gray-400"
                              )} />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold">{method.name}</span>
                                <span className="font-bold text-[var(--brand-600)]">
                                  {method.price === 0 ? 'Free' : `KES ${method.price.toLocaleString()}`}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {method.description}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                Estimated delivery: {method.estimatedDays}
                              </p>
                            </div>
                            
                            {selectedShipping === method.id && (
                              <div className="w-5 h-5 bg-[var(--brand-500)] rounded-full flex items-center justify-center">
                                <FiCheck className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('information')}
                  >
                    Back to Information
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setCurrentStep('payment')}
                    disabled={!selectedAddressId || !selectedShipping}
                    className="px-8"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            )}
            
            {/* STEP 3: PAYMENT */}
            {currentStep === 'payment' && (
              <div className="space-y-6">
                {/* Payment Method */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <span className="w-6 h-6 bg-[var(--brand-500)] text-white rounded-full flex items-center justify-center text-sm">3</span>
                      Payment Method
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon
                        const isSelected = selectedPayment === method.id
                        
                        return (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={cn(
                              "p-4 border rounded-xl text-center transition-all duration-300",
                              isSelected
                                ? "border-[var(--brand-500)] bg-[var(--brand-50)] dark:bg-[var(--brand-900)]/30 shadow-md"
                                : "border-[var(--card-border)] hover:border-[var(--brand-400)] hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            )}
                          >
                            <Icon className={cn(
                              "w-8 h-8 mx-auto mb-2",
                              isSelected ? "text-[var(--brand-600)]" : "text-gray-600 dark:text-gray-400"
                            )} />
                            <span className={cn(
                              "text-xs font-medium",
                              isSelected ? "text-[var(--brand-600)]" : "text-gray-600 dark:text-gray-400"
                            )}>
                              {method.name}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                    
                    {/* Payment Form - Dynamic based on selection */}
                    <div className="space-y-4">
                      {selectedPayment === 'mpesa' && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            M-Pesa Phone Number
                          </label>
                          <div className="relative">
                            <FiSmartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              value={mpesaPhone}
                              onChange={(e) => setMpesaPhone(e.target.value)}
                              placeholder="e.g., 0712 345 678"
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            You'll receive an STK push prompt on your phone to complete the payment
                          </p>
                        </div>
                      )}
                      
                      {selectedPayment === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Card Number
                            </label>
                            <div className="relative">
                              <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                placeholder="1234 5678 9012 3456"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Cardholder Name
                            </label>
                            <div className="relative">
                              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Expiry Date
                              </label>
                              <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                CVV
                              </label>
                              <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                  type="password"
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  placeholder="123"
                                  maxLength={3}
                                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedPayment === 'bank' && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                          <h4 className="font-medium mb-2">Bank Transfer Details</h4>
                          <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Bank:</span> Equity Bank</p>
                            <p><span className="text-gray-500">Account Name:</span> Linkchem Supplies Ltd</p>
                            <p><span className="text-gray-500">Account Number:</span> 1234567890</p>
                            <p><span className="text-gray-500">Branch:</span> Nairobi</p>
                            <p><span className="text-gray-500">SWIFT Code:</span> EQBLKENA</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-4">
                            Please use your order number as the payment reference
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Order Notes */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                  <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                    <h2 className="text-lg font-semibold">Order Notes (Optional)</h2>
                  </div>
                  
                  <div className="p-6">
                    <textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Add any special instructions or delivery notes..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300 resize-none"
                    />
                  </div>
                </div>
                
                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('shipping')}
                  >
                    Back to Shipping
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 relative overflow-hidden group"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <span className="relative z-10 flex items-center gap-2">
                          Place Order
                          <FiLock className="w-4 h-4" />
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-[var(--brand-600)] to-[var(--brand-700)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Order Summary - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] overflow-hidden">
                <div className="p-6 border-b border-[var(--card-border)] bg-gradient-to-r from-[var(--brand-50)] to-transparent dark:from-[var(--brand-900)]/30">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FiShoppingBag className="w-5 h-5 text-[var(--brand-500)]" />
                    Order Summary
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                    {items.map((item) => (

                    <CheckoutItem key={item.id} item={item} />
                    ))}
                  </div>
                  
                  {/* Promo Code */}
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code"
                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-[var(--card-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-500)] focus:border-transparent transition-all duration-300"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoApplied || !promoCode}
                        className="px-4 py-2 bg-[var(--brand-500)] text-white rounded-lg text-sm font-medium hover:bg-[var(--brand-600)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <FiCheck className="w-3 h-3" />
                        10% discount applied!
                      </p>
                    )}
                  </div>
                  
                  {/* Price Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-[var(--card-border)]">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span>KES {subtotal.toLocaleString()}</span>
                    </div>
                    
                    {promoApplied && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Discount (10%)</span>
                        <span className="text-green-600">-KES {promoDiscount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? 'Free' : `KES ${shipping.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax (16% VAT)</span>
                      <span>KES {tax.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-[var(--card-border)]">
                      <span>Total</span>
                      <span className="text-[var(--brand-600)] dark:text-[var(--brand-400)]">
                        KES {finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Delivery Estimate */}
              {selectedShippingMethod && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                      <FiClock className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Estimated Delivery</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedShippingMethod.estimatedDays}
                      </p>
                      {selectedAddress && (
                        <p className="text-xs text-gray-500 mt-2">
                          to {selectedAddress.city}, {selectedAddress.state}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Trust Badges */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[var(--card-border)] p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                      <FiShield className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <div>
                      <p className="font-medium">Secure Payment</p>
                      <p className="text-xs text-gray-500">256-bit SSL encrypted</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                      <FiPackage className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <div>
                      <p className="font-medium">Free Returns</p>
                      <p className="text-xs text-gray-500">30-day return policy</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="p-2 bg-[var(--brand-50)] dark:bg-[var(--brand-900)] rounded-lg">
                      <FiHeart className="w-4 h-4 text-[var(--brand-600)]" />
                    </div>
                    <div>
                      <p className="font-medium">100% Authentic</p>
                      <p className="text-xs text-gray-500">Genuine products guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Need Help? */}
              <div className="bg-gradient-to-r from-[var(--brand-50)] to-[var(--brand-100)] dark:from-[var(--brand-900)] dark:to-[var(--brand-800)] rounded-2xl p-6 border border-[var(--brand-200)] dark:border-[var(--brand-700)]">
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our support team is available 24/7 to assist you with your order.
                </p>
                <div className="space-y-2">
                  <a href="tel:+254712345678" className="flex items-center gap-2 text-sm text-[var(--brand-600)] hover:text-[var(--brand-700)]">
                    <FiPhone className="w-4 h-4" />
                    +254 712 345 678
                  </a>
                  <a href="mailto:support@linkchem.co.ke" className="flex items-center gap-2 text-sm text-[var(--brand-600)] hover:text-[var(--brand-700)]">
                    <FiMail className="w-4 h-4" />
                    support@linkchem.co.ke
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}